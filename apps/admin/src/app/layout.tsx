import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

const sections = ["Dashboard", "Bookings", "Packages", "Destinations", "Vehicles", "Drivers", "Customers", "Payments", "Reviews", "Inquiries", "Coupons", "Analytics", "Settings"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body className="flex min-h-screen bg-slate-50 text-slate-900">
        <aside className="w-60 shrink-0 border-r border-slate-200 bg-white p-5">
          <p className="mb-6 text-lg font-semibold">Guru Raghavendra Tours and Travels</p>
          <nav aria-label="Admin">
            <ul className="space-y-1 text-sm">
              {sections.map((s, i) => (
                <li key={s}><span className={`block rounded-md px-3 py-2 ${i === 0 ? "bg-slate-900 text-white" : "text-slate-600"}`}>{s}</span></li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </body>
    </html>
  );
}
