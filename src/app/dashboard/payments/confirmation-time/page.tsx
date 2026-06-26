import { paymentsApi } from "@/lib/payments-api"
import { Timer, Clock } from "lucide-react"
import BucketsChart from "./buckets-chart"
import { InfoTooltip } from "@/components/ui/InfoTooltip"

export const dynamic = "force-dynamic"

type Bucket = { range: string; count: number }

type ConfirmationStats = {
  avgMinutes: number | null
  medianMinutes: number | null
  buckets: Bucket[]
}

function formatMinutes(minutes: number | null): string {
  if (minutes === null) return "—"
  if (minutes < 1) return `${Math.round(minutes * 60)}s`
  if (minutes < 60) return `${minutes.toFixed(1)} min`
  return `${(minutes / 60).toFixed(1)} h`
}

export default async function ConfirmationTimePage() {
  let stats: ConfirmationStats | null = null
  let error: string | null = null

  try {
    stats = (await paymentsApi.get("/api/admin/stats/confirmation-time")) as ConfirmationStats
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido"
  }

  const total = stats?.buckets.reduce((s, b) => s + b.count, 0) ?? 0

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700 dark:text-violet-400">
          Payments
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tiempo de confirmación</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200/60 bg-white/80 px-5 py-4 text-sm text-red-700 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-red-800/60 dark:bg-slate-900/80 dark:text-red-400">
          {error}
        </div>
      )}

      {!error && stats && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400">
                  <Timer className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Promedio</p>
                    <InfoTooltip text="Tiempo medio entre la creación de la preferencia y la aprobación por MercadoPago" />
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {formatMinutes(stats.avgMinutes)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Mediana</p>
                    <InfoTooltip text="El 50% de los pagos se confirmaron en menos de este tiempo. Menos sensible a valores extremos que el promedio" />
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {formatMinutes(stats.medianMinutes)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <Timer className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pagos medidos</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{total}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
            <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Distribución por rango de tiempo
            </h2>
            {total === 0 ? (
              <p className="py-12 text-center text-sm text-slate-500">
                Sin datos — los pagos aprobados con <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">mpPaymentDate</code> aparecerán aquí.
              </p>
            ) : (
              <BucketsChart buckets={stats.buckets} />
            )}
          </div>
        </>
      )}
    </div>
  )
}
