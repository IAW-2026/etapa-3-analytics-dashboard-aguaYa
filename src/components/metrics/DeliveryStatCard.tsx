import type { LucideIcon } from "lucide-react"

type Props = {
  label: string
  value: string | number
  icon: LucideIcon
  color: "sky" | "amber" | "purple" | "emerald"
  trend?: {
    direction: "up" | "down"
    percent: number
    tooltip?: string
  }
}

const colorMap: Record<string, { bg: string }> = {
  sky: { bg: "bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400" },
  amber: { bg: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400" },
  purple: { bg: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400" },
  emerald: { bg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400" },
}

export default function DeliveryStatCard({ label, value, icon: Icon, color, trend }: Props) {
  const colors = colorMap[color]

  return (
    <div className="group relative rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-200 hover:shadow-xl hover:shadow-black/10 dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-500/10 blur-2xl transition-all duration-500 group-hover:bg-blue-500/20" />
      <div className="relative flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
            {trend && (
              <span
                title={trend.tooltip}
                className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  trend.direction === "up"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                }`}
              >
                {trend.direction === "up" ? "▲" : "▼"} {trend.percent > 0 ? trend.percent : -trend.percent}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
