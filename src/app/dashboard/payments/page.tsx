import { paymentsApi } from "@/lib/payments-api"
import { DollarSign, CheckCircle, Clock, XCircle, Ban, TrendingUp } from "lucide-react"
import RevenueChart from "./revenue-chart"
import StatusChart from "./status-chart"

export const dynamic = "force-dynamic"

type Stats = {
  total: number
  approved: number
  pending: number
  rejected: number
  cancelled: number
  expired: number
  revenue: number
}

type MonthlyRevenue = { month: string; revenue: number }

export default async function PaymentsPage() {
  let stats: Stats | null = null
  let monthlyRevenue: MonthlyRevenue[] = []
  let error: string | null = null

  try {
    const res = await paymentsApi.get("/api/admin/stats")
    stats = res.stats
    monthlyRevenue = res.monthlyRevenue ?? []
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido"
  }

  const cards = stats
    ? [
        { label: "Total transacciones", value: stats.total, icon: TrendingUp, color: "blue" },
        { label: "Aprobados", value: stats.approved, icon: CheckCircle, color: "emerald" },
        { label: "Pendientes", value: stats.pending, icon: Clock, color: "amber" },
        { label: "Rechazados", value: stats.rejected, icon: XCircle, color: "red" },
        { label: "Cancelados", value: stats.cancelled, icon: Ban, color: "slate" },
        {
          label: "Ingresos totales",
          value: `$${stats.revenue.toLocaleString("es-AR")}`,
          icon: DollarSign,
          color: "violet",
        },
      ]
    : []

  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400",
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    violet: "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400",
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700 dark:text-violet-400">
          Payments
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Overview</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200/60 bg-white/80 px-5 py-4 text-sm text-red-700 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-red-800/60 dark:bg-slate-900/80 dark:text-red-400">
          {error}
        </div>
      )}

      {!error && stats && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[card.color]}`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3 rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                Ingresos mensuales (últimos 12 meses)
              </h2>
              <RevenueChart data={monthlyRevenue} />
            </div>

            <div className="lg:col-span-2 rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                Distribución por estado
              </h2>
              <StatusChart
                approved={stats.approved}
                pending={stats.pending}
                rejected={stats.rejected}
                cancelled={stats.cancelled}
                expired={stats.expired}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
