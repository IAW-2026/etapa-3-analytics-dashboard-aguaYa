"use client"

import { cn } from "@/lib/utils"

type Props = {
  title: string
  value: string | number
  subtitle?: string
  trend?: "up" | "down" | "neutral"
  className?: string
}

export default function MetricCard({ title, value, subtitle, trend, className }: Props) {
  const trendColors = {
    up: "text-emerald-600 dark:text-emerald-400",
    down: "text-red-600 dark:text-red-400",
    neutral: "text-slate-500 dark:text-slate-400",
  }
  return (
    <div
      className={cn(
        "rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30",
        "p-5 shadow-lg shadow-black/5 backdrop-blur-xl",
        "dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40",
        className,
      )}
    >
      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{title}</p>
      <p className={cn("mt-1 text-2xl font-bold", trend && trendColors[trend])}>{value}</p>
      {subtitle && <p className="mt-0.5 text-xs text-slate-400/70">{subtitle}</p>}
    </div>
  )
}