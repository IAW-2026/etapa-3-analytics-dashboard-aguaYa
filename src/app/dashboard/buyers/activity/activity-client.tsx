"use client"

import Link from "next/link"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import type { TimelineEntry } from "@/lib/types"

type Props = {
  data: TimelineEntry[]
  selectedDays: number
}

const RANGES = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
]

const glassTooltip = {
  backgroundColor: "var(--tooltip-bg)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: "12px",
  border: "1px solid var(--tooltip-border)",
  boxShadow: "0 8px 32px var(--tooltip-shadow)",
  fontSize: "13px",
  padding: "8px 12px",
  color: "inherit",
}

export default function ActivityClient({ data, selectedDays }: Props) {
  const totalOrders = data.reduce((sum, d) => sum + d.count, 0)
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0)
  const avgDailyOrders = Math.round(totalOrders / data.length)
  const avgDailyRevenue = totalRevenue / data.length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {RANGES.map((r) => (
          <Link
            key={r.days}
            href={`/dashboard/buyers/activity?days=${r.days}`}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium backdrop-blur-xl transition-all duration-200 ${
              selectedDays === r.days
                ? "bg-blue-600/80 text-white shadow-lg shadow-blue-600/20"
                : "border border-white/30 bg-white/30 text-slate-500 hover:bg-white/50 dark:border-slate-700/30 dark:bg-slate-800/30 dark:text-slate-400 dark:hover:bg-slate-700/40"
            }`}
          >
            {r.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Órdenes totales</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{totalOrders}</p>
          <p className="mt-0.5 text-xs text-slate-400/70 dark:text-slate-500/70">{avgDailyOrders} / día en promedio</p>
        </div>
        <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Ingresos totales</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
          <p className="mt-0.5 text-xs text-slate-400/70 dark:text-slate-500/70">
            {formatCurrency(avgDailyRevenue)} / día en promedio
          </p>
        </div>
        <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Período</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{selectedDays} días</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
          Órdenes por día
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="buyerOrderGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="buyerRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.15)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "rgba(148,163,184,0.6)" }}
              axisLine={{ stroke: "rgba(148,163,184,0.2)" }}
              tickLine={false}
              tickFormatter={(v) => {
                const d = new Date(v as string)
                return `${d.getDate()}/${d.getMonth() + 1}`
              }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "rgba(148,163,184,0.6)" }}
              axisLine={{ stroke: "rgba(148,163,184,0.2)" }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={glassTooltip}
              labelFormatter={(v) => {
                const d = new Date(v as string)
                return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="rgba(59,130,246,0.8)"
              strokeWidth={2}
              fill="url(#buyerOrderGradient)"
              name="Órdenes"
              dot={{ r: 3, fill: "rgba(59,130,246,0.8)", stroke: "rgba(255,255,255,0.6)", strokeWidth: 2 }}
              activeDot={{ r: 5, fill: "#3b82f6", stroke: "rgba(255,255,255,0.8)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
          Detalle por día
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20 text-left text-xs font-medium text-slate-500 dark:border-slate-700/30 dark:text-slate-400">
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2 text-center">Órdenes</th>
                <th className="px-4 py-2 text-right">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry) => (
                <tr
                  key={entry.date}
                  className="border-b border-white/10 transition-colors hover:bg-white/20 dark:border-slate-700/20 dark:hover:bg-white/5"
                >
                  <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                    {new Date(entry.date).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="px-4 py-2 text-center text-slate-600 dark:text-slate-400">{entry.count}</td>
                  <td className="px-4 py-2 text-right font-medium text-slate-900 dark:text-white">
                    {formatCurrency(entry.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
