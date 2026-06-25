"use client"

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

type DataPoint = { date: string; count: number; amount: number }

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

export default function VolumeChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "currentColor" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="count"
          orientation="left"
          tick={{ fontSize: 11, fill: "currentColor" }}
          tickLine={false}
          axisLine={false}
          width={30}
        />
        <YAxis
          yAxisId="amount"
          orientation="right"
          tick={{ fontSize: 11, fill: "currentColor" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          width={45}
        />
        <Tooltip
          contentStyle={glassTooltip}
          formatter={(value: number, name: string) =>
            name === "amount"
              ? [`$${value.toLocaleString("es-AR")}`, "Monto"]
              : [value, "Transacciones"]
          }
        />
        <Legend
          formatter={(value) => (value === "count" ? "Transacciones" : "Monto")}
          wrapperStyle={{ fontSize: 12 }}
        />
        <Bar yAxisId="count" dataKey="count" fill="#6366f1" opacity={0.85} radius={[3, 3, 0, 0]} />
        <Line
          yAxisId="amount"
          type="monotone"
          dataKey="amount"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
