"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"
import { cn } from "@/lib/utils"

const RANGES = [
  { label: "Hoy", days: 0 },
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
]

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function daysAgoISO(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

export default function DateFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const dateFrom = searchParams.get("dateFrom") || ""
  const dateTo = searchParams.get("dateTo") || ""

  const setParams = useCallback(
    (from: string, to: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (from) params.set("dateFrom", from)
      else params.delete("dateFrom")
      if (to) params.set("dateTo", to)
      else params.delete("dateTo")
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  function handleRange(days: number) {
    if (days === 0) {
      const today = todayISO()
      setParams(today, today)
    } else {
      setParams(daysAgoISO(days), todayISO())
    }
  }

  function activeRange(): number | null {
    if (!dateFrom && !dateTo) return null
    for (const r of RANGES) {
      if (r.days === 0) {
        if (dateFrom === todayISO() && dateTo === todayISO()) return r.days
      } else {
        if (dateFrom === daysAgoISO(r.days) && dateTo === todayISO()) return r.days
      }
    }
    return null
  }

  const active = activeRange()

  return (
    <div className="flex flex-wrap items-center gap-2">
      {RANGES.map((r) => (
        <button
          key={r.days}
          type="button"
          onClick={() => handleRange(r.days)}
          className={cn(
            "rounded-lg px-4 py-1.5 text-sm font-medium backdrop-blur-xl transition-all duration-200",
            active === r.days
              ? "bg-blue-600/80 text-white shadow-lg shadow-blue-600/20"
              : "border border-white/30 bg-white/30 text-slate-500 hover:bg-white/50 dark:border-slate-700/30 dark:bg-slate-800/30 dark:text-slate-400 dark:hover:bg-slate-700/40",
          )}
        >
          {r.label}
        </button>
      ))}
      <span className="mx-1 text-xs text-slate-400 dark:text-slate-500">|</span>
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => setParams(e.target.value, dateTo || todayISO())}
        className="rounded-lg border border-white/30 bg-white/40 px-2 py-1.5 text-sm text-slate-900 backdrop-blur-xl transition-colors focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20 dark:border-slate-700/40 dark:bg-slate-800/40 dark:text-slate-100"
      />
      <span className="text-xs text-slate-400 dark:text-slate-500">a</span>
      <input
        type="date"
        value={dateTo}
        onChange={(e) => setParams(dateFrom || daysAgoISO(7), e.target.value)}
        className="rounded-lg border border-white/30 bg-white/40 px-2 py-1.5 text-sm text-slate-900 backdrop-blur-xl transition-colors focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20 dark:border-slate-700/40 dark:bg-slate-800/40 dark:text-slate-100"
      />
    </div>
  )
}
