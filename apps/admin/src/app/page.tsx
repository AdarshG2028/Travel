const kpis = ["Revenue", "Bookings", "Customers", "Active trips", "Pending payments", "Vehicle utilization"];

export default function Dashboard() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Shell only. Live metrics arrive in Phase 7.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-3">
        {kpis.map((k) => (
          <div key={k} className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{k}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-300">—</p>
          </div>
        ))}
      </div>
    </>
  );
}
