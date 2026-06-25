"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const STATUS_COLORS: Record<string, string> = {
  approved: "#10b981",
  pending: "#f59e0b",
  rejected: "#ef4444",
  cancelled: "#9ca3af",
  expired: "#6366f1",
}

const STATUS_LABELS: Record<string, string> = {
  approved: "Aprobado",
  pending: "Pendiente",
  rejected: "Rechazado",
  cancelled: "Cancelado",
  expired: "Expirado",
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

type Props = {
  approved: number
  pending: number
  rejected: number
  cancelled: number
  expired: number
}

export default function StatusChart(props: Props) {
  const data = Object.entries(props)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: STATUS_LABELS[key] ?? key,
      value,
      color: STATUS_COLORS[key] ?? "#9ca3af",
    }))

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={2}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={glassTooltip}
            formatter={(value) => [`${value ?? 0} pagos`]}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-3 flex flex-wrap justify-center gap-3">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full ring-1 ring-white/30"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {entry.name}: <strong className="text-slate-700 dark:text-slate-200">{entry.value}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
