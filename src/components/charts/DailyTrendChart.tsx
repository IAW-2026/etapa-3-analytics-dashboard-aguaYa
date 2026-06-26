"use client"

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import type { DailyTrendPoint } from "@/lib/delivery-types"

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

type Props = {
  data: DailyTrendPoint[]
}

export default function DailyTrendChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.completed, 0)
  const avg = data.length ? Math.round(total / data.length) : 0

  return (
    <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Tendencia Diaria</h2>
        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
          <span>{total} pedidos totales</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span>{avg} / día en promedio</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="deliveryTrendGradient" x1="0" y1="0" x2="0" y2="1">
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
            dataKey="completed"
            stroke="rgba(59,130,246,0.8)"
            strokeWidth={2}
            fill="url(#deliveryTrendGradient)"
            name="Entregas"
            dot={{ r: 3, fill: "rgba(59,130,246,0.8)", stroke: "rgba(255,255,255,0.6)", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: "#3b82f6", stroke: "rgba(255,255,255,0.8)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
