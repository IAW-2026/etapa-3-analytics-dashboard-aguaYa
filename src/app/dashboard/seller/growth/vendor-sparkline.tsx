"use client"

import { LineChart, Line, ResponsiveContainer } from "recharts"

export function VendorSparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length === 0) return null

  const chartData = data.map((v, i) => ({ v, i }))

  return (
    <ResponsiveContainer width={80} height={24}>
      <LineChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
