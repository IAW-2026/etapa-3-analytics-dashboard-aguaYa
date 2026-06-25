import { paymentsApi } from "@/lib/payments-api"
import { Users, UserCheck, TrendingUp } from "lucide-react"
import { InfoTooltip } from "@/components/ui/InfoTooltip"

export const dynamic = "force-dynamic"

type ConversionStats = {
  registered: number
  withApprovedPayment: number
  conversionRate: number
}

export default async function PaymentUsersPage() {
  let stats: ConversionStats | null = null
  let error: string | null = null

  try {
    stats = (await paymentsApi.get("/api/admin/stats/users")) as ConversionStats
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido"
  }

  const cards = stats
    ? [
        { label: "Usuarios registrados", value: stats.registered, icon: Users, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400", tooltip: undefined },
        { label: "Con pago aprobado", value: stats.withApprovedPayment, icon: UserCheck, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400", tooltip: undefined },
        { label: "Tasa de conversión", value: `${stats.conversionRate}%`, icon: TrendingUp, color: "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400", tooltip: "Usuarios con al menos un pago aprobado sobre el total de registrados" },
      ]
    : []

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700 dark:text-violet-400">
          Payments
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Usuarios</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200/60 bg-white/80 px-5 py-4 text-sm text-red-700 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-red-800/60 dark:bg-slate-900/80 dark:text-red-400">
          {error}
        </div>
      )}

      {!error && stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                    {card.tooltip && <InfoTooltip text={card.tooltip} />}
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
