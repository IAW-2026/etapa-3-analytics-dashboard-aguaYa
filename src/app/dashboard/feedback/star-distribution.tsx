"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const STAR_COLORS: Record<string, string> = {
  "1": "#ef4444",
  "2": "#f97316",
  "3": "#eab308",
  "4": "#84cc16",
  "5": "#22c55e",
}

type StarDistributionProps = {
  resenasPorEstrella: Record<string, number>
  promedio: number
  total: number
  title: string
}

export function StarDistribution({ resenasPorEstrella, promedio, total, title }: StarDistributionProps) {
  const data = ["5", "4", "3", "2", "1"].map((star) => ({
    star: `${star} ★`,
    count: resenasPorEstrella[star] ?? 0,
    fill: STAR_COLORS[star],
  }))

  return (
    <div className="rounded-xl border border-white/30 bg-linear-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Promedio: <strong className="text-amber-600 dark:text-amber-400">{promedio.toFixed(1)}</strong>
          </span>
          <span>
            Total: <strong>{total}</strong>
          </span>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barCategoryGap={8}>
            <XAxis type="number" tick={{ fontSize: 12 }}  stroke="#94a3b8" />
            <YAxis type="category" dataKey="star" width={50} tick={{ fontSize: 13 }} stroke="#94a3b8" />
            <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(12px)",
                  fontSize: "13px",
                  color: "#0f172a",
                }}
                formatter={(value) => [`${value}`, "Cantidad"]}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
