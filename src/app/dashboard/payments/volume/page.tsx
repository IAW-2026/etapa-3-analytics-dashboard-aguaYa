import { paymentsApi } from "@/lib/payments-api"
import Link from "next/link"
import VolumeChart from "./volume-chart"
import { InfoTooltip } from "@/components/ui/InfoTooltip"

export const dynamic = "force-dynamic"

type Period = "daily" | "weekly" | "monthly"
type DataPoint = { date: string; count: number; amount: number }

const PERIODS: { value: Period; label: string }[] = [
  { value: "daily", label: "Diario" },
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensual" },
]

export default async function VolumePage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; from?: string; to?: string }>
}) {
  const { period: periodParam, from, to } = await searchParams
  const period: Period =
    periodParam === "weekly" || periodParam === "monthly" ? periodParam : "daily"

  let data: DataPoint[] = []
  let error: string | null = null
  let totalCount = 0
  let totalAmount = 0

  try {
    const params: Record<string, string> = { period }
    if (from) params.from = from
    if (to) params.to = to

    const res = await paymentsApi.get("/api/admin/stats/volume", params)
    data = res.data ?? []
    totalCount = data.reduce((s, d) => s + d.count, 0)
    totalAmount = data.reduce((s, d) => s + d.amount, 0)
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido"
  }

  function buildHref(p: Period) {
    const params = new URLSearchParams()
    params.set("period", p)
    if (from) params.set("from", from)
    if (to) params.set("to", to)
    return `/dashboard/payments/volume?${params.toString()}`
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700 dark:text-violet-400">
          Payments
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Volumen</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200/60 bg-white/80 px-5 py-4 text-sm text-red-700 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-red-800/60 dark:bg-slate-900/80 dark:text-red-400">
          {error}
        </div>
      )}

      {!error && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Transacciones</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCount}</p>
            </div>
            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Monto total</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                ${totalAmount.toLocaleString("es-AR")}
              </p>
            </div>
            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <div className="flex items-center gap-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Ticket promedio</p>
                <InfoTooltip text="Monto total facturado dividido la cantidad de transacciones del período" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                ${totalCount > 0 ? Math.round(totalAmount / totalCount).toLocaleString("es-AR") : 0}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Evolución de transacciones
              </h2>
              <div className="flex gap-1">
                {PERIODS.map((p) => (
                  <Link
                    key={p.value}
                    href={buildHref(p.value)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                      period === p.value
                        ? "bg-violet-600 text-white"
                        : "text-slate-500 hover:bg-white/30 dark:text-slate-400"
                    }`}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>

            {data.length === 0 ? (
              <p className="py-16 text-center text-sm text-slate-500">Sin datos para el período seleccionado.</p>
            ) : (
              <VolumeChart data={data} />
            )}
          </div>
        </>
      )}
    </div>
  )
}
