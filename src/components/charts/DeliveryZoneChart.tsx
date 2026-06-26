"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899"]

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

export default function DeliveryZoneChart({ zones }: { zones: Record<string, number> }) {
  const data = Object.entries(zones).map(([name, value]) => ({ name, value }))
  return (
    <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
      <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Entregas por Zona</h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
            dataKey="value"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={2}
          >
            {data.map((entry, idx) => (
              <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={glassTooltip} formatter={(value) => [`${value} pedidos`]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}