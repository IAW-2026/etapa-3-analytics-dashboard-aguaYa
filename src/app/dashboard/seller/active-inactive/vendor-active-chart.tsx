"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const COLORS = {
  active: "#10b981",
  inactive: "#9ca3af",
}

type Props = {
  active: number
  inactive: number
}

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

export default function VendorActiveChart({ active, inactive }: Props) {
  const data = [
    { name: "Activos", value: active, color: COLORS.active },
    { name: "Inactivos", value: inactive, color: COLORS.inactive },
  ]

  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
        Distribución de Vendedores
      </h2>
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
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={glassTooltip} formatter={(value) => [`${value} vendedores`]} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 flex justify-center gap-6">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full ring-1 ring-white/30"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-slate-500/80 dark:text-slate-400/80">
              {entry.name}: <strong className="text-slate-700 dark:text-slate-200">{entry.value}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
