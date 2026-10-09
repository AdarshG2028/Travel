import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const statusSchema = z.object({ id: z.string().min(1), status: z.enum(["NEW", "CONTACTED", "CLOSED"]) });

async function setStatus(formData: FormData) {
  "use server";
  if ((await auth())?.user?.role !== "ADMIN") throw new Error("Unauthorized"); // every action re-checks
  const data = statusSchema.parse(Object.fromEntries(formData));
  await db.inquiry.update({ where: { id: data.id }, data: { status: data.status } });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

const fmt = (d: Date | null) => (d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-");

export default async function InquiriesPage() {
  const rows = await db.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <>
      <h1 className="text-2xl font-semibold">Inquiries</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>{["Received", "Name", "Contact", "Destination", "Dates", "Travellers", "Budget", "Status"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="px-4 py-3">{fmt(r.createdAt)}</td>
                <td className="px-4 py-3">{r.name}{r.requirements && <p className="mt-1 max-w-xs text-xs text-slate-500">{r.requirements}</p>}</td>
                <td className="px-4 py-3"><a href={`tel:${r.phone}`} className="underline">{r.phone}</a><br /><a href={`mailto:${r.email}`} className="text-slate-500">{r.email}</a></td>
                <td className="px-4 py-3">{r.destination}</td>
                <td className="px-4 py-3">{fmt(r.startDate)} to {fmt(r.endDate)}</td>
                <td className="px-4 py-3">{r.travelers}</td>
                <td className="px-4 py-3">{r.budget ? `₹${r.budget.toLocaleString("en-IN")}` : "-"}</td>
                <td className="px-4 py-3">
                  <form action={setStatus} className="flex gap-2">
                    <input type="hidden" name="id" value={r.id} />
                    <select name="status" defaultValue={r.status} aria-label={`Status for ${r.name}`} className="min-h-9 rounded border border-slate-300 bg-white px-2">
                      <option value="NEW">New</option><option value="CONTACTED">Contacted</option><option value="CLOSED">Closed</option>
                    </select>
                    <button className="min-h-9 rounded bg-slate-900 px-3 text-white">Save</button>
                  </form>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-500">No inquiries yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
