export default function DeliveryLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 rounded-lg bg-white/20 backdrop-blur-xl dark:bg-slate-800/40" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/30 bg-white/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-800/30"
          >
            <div className="mb-2 h-3 w-24 rounded bg-slate-300/50 dark:bg-slate-600/50" />
            <div className="h-7 w-16 rounded bg-slate-300/50 dark:bg-slate-600/50" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i + 4}
            className="rounded-xl border border-white/30 bg-white/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-800/30"
          >
            <div className="mb-2 h-3 w-24 rounded bg-slate-300/50 dark:bg-slate-600/50" />
            <div className="h-7 w-16 rounded bg-slate-300/50 dark:bg-slate-600/50" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/30 bg-white/30 p-5 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-800/30">
        <div className="mb-4 h-4 w-48 rounded bg-slate-300/50 dark:bg-slate-600/50" />
        <div className="h-[280px] rounded bg-slate-300/50 dark:bg-slate-600/50" />
      </div>
    </div>
  )
}
