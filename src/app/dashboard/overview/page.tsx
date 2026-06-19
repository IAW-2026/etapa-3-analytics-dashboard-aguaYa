export default async function OverviewPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">Dashboard</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Overview</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Transacciones", value: "—", color: "bg-blue-500" },
          { label: "Ingresos", value: "—", color: "bg-emerald-500" },
          { label: "Pedidos", value: "—", color: "bg-amber-500" },
          { label: "Rating Promedio", value: "—", color: "bg-violet-500" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-6 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color}`}>
                <span className="text-lg font-bold text-white">{card.label.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-6 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Bienvenido al Analytics Dashboard</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Panel de métricas y reportes del sistema AguaYa. Desde aquí podés visualizar
          indicadores clave, tendencias y datos consolidados de todas las aplicaciones del ecosistema.
        </p>
      </div>
    </div>
  )
}
