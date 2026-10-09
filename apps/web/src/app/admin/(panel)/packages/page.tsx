import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const toggleSchema = z.object({ id: z.string().min(1), published: z.enum(["true", "false"]) });

async function setPublished(formData: FormData) {
  "use server";
  if ((await auth())?.user?.role !== "ADMIN") throw new Error("Unauthorized");
  const data = toggleSchema.parse(Object.fromEntries(formData));
  const p = await db.package.update({ where: { id: data.id }, data: { published: data.published === "true" } });
  revalidateTag("packages");
  revalidateTag(`package-${p.slug}`);
  revalidatePath("/admin/packages");
}

export default async function PackagesAdmin() {
  const rows = await db.package.findMany({ include: { destination: true }, orderBy: [{ category: "asc" }, { title: "asc" }] });
  return (
    <>
      <h1 className="text-2xl font-semibold">Packages</h1>
      <p className="mt-1 text-sm text-slate-500">Publish or unpublish. Full editing (itinerary, dates, images) comes with the admin phase.</p>
      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>{["Package", "Route", "Type", "Days", "Price", "Status"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3">{p.route}</td>
                <td className="px-4 py-3">{p.category === "RELIGIOUS" ? "Religious" : "Getaway"}</td>
                <td className="px-4 py-3">{p.days}</td>
                <td className="px-4 py-3">₹{p.pricePerPerson.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <form action={setPublished} className="flex items-center gap-3">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="published" value={String(!p.published)} />
                    <span className={p.published ? "text-green-700" : "text-slate-500"}>{p.published ? "Published" : "Draft"}</span>
                    <button className="min-h-9 rounded border border-slate-300 px-3 hover:bg-slate-100">{p.published ? "Unpublish" : "Publish"}</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
