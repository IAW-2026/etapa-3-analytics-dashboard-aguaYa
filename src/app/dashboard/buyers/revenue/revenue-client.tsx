"use client"

import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import type { RevenueResponse } from "@/lib/types"

type Props = {
  data: RevenueResponse
  selectedDays: number
}

const RANGES = [
  { label: "Todo", days: 0 },
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

export default function RevenueClient({ data, selectedDays }: Props) {
  const topVendors = [...data.by_vendor]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {RANGES.map((r) => (
          <Link
            key={r.days}
            href={`/dashboard/buyers/revenue${r.days > 0 ? `?days=${r.days}` : ""}`}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Ingresos totales</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(data.total_revenue)}
          </p>
        </div>
        <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Órdenes totales</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{data.total_orders}</p>
        </div>
      </div>

      {topVendors.length > 0 && (
        <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
            Top vendedores por ingresos
          </h2>
          <ResponsiveContainer width="100%" height={Math.max(200, topVendors.length * 40)}>
            <BarChart
              data={topVendors.map((v) => ({
                name: v.vendor_id.length > 20 ? v.vendor_id.slice(0, 20) + "…" : v.vendor_id,
                revenue: v.revenue,
                fullId: v.vendor_id,
              }))}
              layout="vertical"
              margin={{ left: 130, right: 20 }}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.15)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "rgba(148,163,184,0.6)" }}
                axisLine={{ stroke: "rgba(148,163,184,0.2)" }}
                tickLine={false}
                tickFormatter={(v) => `$${(v as number).toLocaleString("es-AR")}`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "rgba(100,116,139,0.7)" }}
                axisLine={false}
                tickLine={false}
                width={125}
              />
              <Tooltip
                contentStyle={glassTooltip}
                formatter={(value) => [formatCurrency(Number(value)), "Ingresos"]}
              />
              <Bar
                dataKey="revenue"
                fill="#10b981"
                radius={[0, 6, 6, 0]}
                name="Ingresos"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <div className="border-b border-white/20 px-5 py-4 dark:border-slate-700/30">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Ingresos por vendedor
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20 text-left text-xs font-medium text-slate-500 dark:border-slate-700/30 dark:text-slate-400">
                <th className="px-5 py-3">Vendedor</th>
                <th className="px-5 py-3 text-center">Órdenes</th>
                <th className="px-5 py-3 text-right">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {data.by_vendor.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-sm text-slate-500">
                    No hay datos de ingresos.
                  </td>
                </tr>
              )}
              {data.by_vendor.map((vendor) => (
                <tr
                  key={vendor.vendor_id}
                  className="border-b border-white/10 transition-colors hover:bg-white/20 dark:border-slate-700/20 dark:hover:bg-white/5"
                >
                  <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">
                    {vendor.vendor_id}
                  </td>
                  <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">
                    {vendor.orders}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(vendor.revenue)}
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
