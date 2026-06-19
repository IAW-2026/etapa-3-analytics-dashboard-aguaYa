export default function ReviewsPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">Analytics</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reseñas</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Calificaciones y feedback del sistema
        </p>
      </div>

      <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-8 text-center shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <p className="text-slate-500 dark:text-slate-400">
          Próximamente — Reseñas y calificaciones
        </p>
      </div>
    </div>
  )
}
