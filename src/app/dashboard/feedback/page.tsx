import { MessageSquare } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function FeedbackPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">
          Feedback
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Feedback</h1>
      </div>

      <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-8 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Feedback — Próximamente
          </h2>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
            Esta sección mostrará las métricas y análisis de feedback de los usuarios.
            Conectá tu feedback app para comenzar.
          </p>
        </div>
      </div>
    </div>
  )
}
