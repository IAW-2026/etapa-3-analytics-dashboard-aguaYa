import type { LucideIcon } from "lucide-react"

const colorMap: Record<string, { bg: string }> = {
  sky: { bg: "bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400" },
  amber: { bg: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400" },
  purple: { bg: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400" },
  emerald: { bg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400" },
}

type StatCardProps = {
  label: string
  value: string | number
  icon: LucideIcon
  color: keyof typeof colorMap
}

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const colors = colorMap[color]

  return (
    <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  )
}
