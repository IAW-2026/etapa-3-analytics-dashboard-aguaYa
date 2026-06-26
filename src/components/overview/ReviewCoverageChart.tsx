export type QuartileData = {
  label: string
  total: number
  withReviews: number
  percentage: number
}

export default function ReviewCoverageChart({ quartiles }: { quartiles: QuartileData[] }) {
  if (quartiles.length === 0) {
    return (
      <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-6 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No hay datos suficientes para mostrar cobertura.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {quartiles.map((q) => (
        <div key={q.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700 dark:text-slate-300">{q.label}</span>
            <span className="text-slate-400 dark:text-slate-500">
              {q.withReviews} / {q.total} · {q.percentage}%
            </span>
          </div>
          <div className="relative h-5 w-full overflow-hidden rounded-full bg-slate-200/60 dark:bg-slate-700/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-500 transition-all duration-500"
              style={{ width: `${q.percentage}%` }}
            />
          </div>
        </div>
      ))}
      <p className="text-[10px] text-slate-400 dark:text-slate-500">
        Porcentaje de vendedores con al menos una reseña, agrupados por quartil de ingresos.
      </p>
    </div>
  )
}
