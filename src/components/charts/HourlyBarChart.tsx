"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import type { HourlyEntry } from "@/lib/delivery-types"

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
  data: HourlyEntry[]
}

export default function HourlyBarChart({ data }: Props) {
  const peak = Math.max(...data.map((d) => d.count), 1)
  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Entregas por Hora</h2>
        <span className="text-xs text-slate-400 dark:text-slate-500">{total} entregas totales</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.15)" vertical={false} />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 11, fill: "rgba(148,163,184,0.6)" }}
            axisLine={{ stroke: "rgba(148,163,184,0.2)" }}
            tickLine={false}
            tickFormatter={(v) => `${String(v).padStart(2, "0")}:00`}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "rgba(148,163,184,0.6)" }}
            axisLine={{ stroke: "rgba(148,163,184,0.2)" }}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={glassTooltip}
            labelFormatter={(v) => `${String(v).padStart(2, "0")}:00 hs`}
          />
          <Bar
            dataKey="count"
            radius={[4, 4, 0, 0]}
            fill="#3b82f6"
            name="Entregas"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
