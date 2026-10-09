import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [newInquiries, packages, published, bookings] = await Promise.all([
    db.inquiry.count({ where: { status: "NEW" } }),
    db.package.count(),
    db.package.count({ where: { published: true } }),
    db.booking.count(),
  ]);
  const cards = [
    { label: "New inquiries", value: newInquiries, href: "/admin/inquiries" },
    { label: "Published packages", value: `${published} of ${packages}`, href: "/admin/packages" },
    { label: "Bookings", value: bookings },
  ];
  return (
    <>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Bookings, payments and analytics arrive with the booking phases.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => {
          const body = (<><p className="text-sm text-slate-500">{c.label}</p><p className="mt-2 text-3xl font-semibold">{c.value}</p></>);
          return c.href
            ? <Link key={c.label} href={c.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-400">{body}</Link>
            : <div key={c.label} className="rounded-lg border border-slate-200 bg-white p-5">{body}</div>;
        })}
      </div>
    </>
  );
}
