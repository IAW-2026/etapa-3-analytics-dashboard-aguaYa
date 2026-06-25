"use client"

import Link from "next/link"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type ActivityData = {
  daily: { date: string; totalOrders: number; activeVendors: number }[]
  topVendors: { vendorId: string; vendorName: string; totalOrders: number }[]
  totalVendors: number
  from: string
  to: string
}

type Props = {
  data: ActivityData
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
  const totalOrdersRange = data.daily.reduce((sum, d) => sum + d.totalOrders, 0)
  const avgDailyOrders = Math.round(totalOrdersRange / data.daily.length)
  const avgActivePct = Math.round(
    data.daily.reduce((sum, d) => sum + d.activeVendors, 0) / data.daily.length / data.totalVendors * 100
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {RANGES.map((r) => (
          <Link
            key={r.days}
            href={`/dashboard/seller/activity?days=${r.days}`}
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
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{totalOrdersRange}</p>
          <p className="mt-0.5 text-xs text-slate-400/70 dark:text-slate-500/70">{avgDailyOrders} / día en promedio</p>
        </div>
        <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Vendedores activos (prom.)</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{avgActivePct}%</p>
          <p className="mt-0.5 text-xs text-slate-400/70 dark:text-slate-500/70">del total de {data.totalVendors} vendedores</p>
        </div>
        <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Vendedores totales</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{data.totalVendors}</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
          Órdenes por día
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.daily}>
            <defs>
              <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
              dataKey="totalOrders"
              stroke="rgba(59,130,246,0.8)"
              strokeWidth={2}
              fill="url(#orderGradient)"
              name="Órdenes"
              dot={{ r: 3, fill: "rgba(59,130,246,0.8)", stroke: "rgba(255,255,255,0.6)", strokeWidth: 2 }}
              activeDot={{ r: 5, fill: "#3b82f6", stroke: "rgba(255,255,255,0.8)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
          Top vendedores por órdenes
        </h2>
        <ResponsiveContainer width="100%" height={Math.max(200, data.topVendors.length * 40)}>
          <BarChart
            data={data.topVendors.map((v) => ({
              name: v.vendorName.length > 20 ? v.vendorName.slice(0, 20) + "…" : v.vendorName,
              orders: v.totalOrders,
              fullName: v.vendorName,
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
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "rgba(100,116,139,0.7)" }}
              axisLine={false}
              tickLine={false}
              width={125}
            />
            <Tooltip contentStyle={glassTooltip} />
            <Bar
              dataKey="orders"
              fill="#3b82f6"
              radius={[0, 6, 6, 0]}
              name="Órdenes"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
