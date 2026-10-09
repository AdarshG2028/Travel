import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | Admin" }, robots: { index: false, follow: false } };

const sections = [
  { label: "Dashboard", href: "/admin" },
  { label: "Packages", href: "/admin/packages" },
  { label: "Inquiries", href: "/admin/inquiries" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin/login"); // defence in depth; middleware also guards this
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-5">
        <p className="mb-6 text-sm font-semibold leading-snug">{site.name}</p>
        <nav aria-label="Admin" className="flex-1">
          <ul className="space-y-1 text-sm">
            {sections.map((s) => (
              <li key={s.href}><Link href={s.href} className="block rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100">{s.label}</Link></li>
            ))}
          </ul>
        </nav>
        <form action={async () => { "use server"; await signOut({ redirectTo: "/admin/login" }); }}>
          <p className="mb-2 truncate text-xs text-slate-500">{session.user?.email}</p>
          <button className="min-h-10 w-full rounded-md border border-slate-300 text-sm hover:bg-slate-100">Sign out</button>
        </form>
      </aside>
      <main className="flex-1 overflow-x-auto p-8">{children}</main>
    </div>
  );
}
