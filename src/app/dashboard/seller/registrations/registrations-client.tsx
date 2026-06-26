"use client"

import Link from "next/link"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Calendar, Store, Clock } from "lucide-react"

type RecentVendor = {
  id: string
  name: string
  createdAt: string
}

type RegistrationsData = {
  daily: { date: string; count: number }[]
  currentPeriod: number
  previousPeriod: number
  growth: number
  days: number
  recentVendors: RecentVendor[]
}

type Props = {
  data: RegistrationsData
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

function fmtDate(d: Date) {
  return `${d.getDate()}/${d.getMonth() + 1}`
}

function dateRangeLabel(days: number): [string, string] {
  const now = new Date()
  now.setHours(23, 59, 59, 999)
  const mid = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  mid.setHours(0, 0, 0, 0)
  const from = new Date(mid.getTime() - days * 24 * 60 * 60 * 1000)
  from.setHours(0, 0, 0, 0)
  return [`${fmtDate(from)} - ${fmtDate(mid)}`, `${fmtDate(mid)} - ${fmtDate(now)}`]
}

function formatGrowth(v: number) {
  const sign = v >= 0 ? "+" : ""
  return `${sign}${v}%`
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "hoy"
  if (days === 1) return "ayer"
  if (days < 30) return `hace ${days} días`
  const months = Math.floor(days / 30)
  return `hace ${months} ${months === 1 ? "mes" : "meses"}`
}

export default function RegistrationsClient({ data, selectedDays }: Props) {
  const [prevLabel, currLabel] = dateRangeLabel(selectedDays)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {RANGES.map((r) => (
          <Link
            key={r.days}
            href={`/dashboard/seller/registrations?days=${r.days}`}
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
        <div className="group relative overflow-hidden rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-500/10 blur-2xl transition-all duration-500 group-hover:bg-blue-500/20" />
          <p className="relative text-xs font-medium text-slate-400 dark:text-slate-500">Registrados</p>
          <p className="relative mt-1 text-2xl font-bold text-slate-900 dark:text-white">{data.currentPeriod}</p>
          <p className="relative mt-0.5 text-xs text-slate-400/70">{currLabel}</p>
        </div>
        <div className="group relative overflow-hidden rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-sky-500/10 blur-2xl transition-all duration-500 group-hover:bg-sky-500/20" />
          <p className="relative text-xs font-medium text-slate-400 dark:text-slate-500">Período anterior</p>
          <p className="relative mt-1 text-2xl font-bold text-slate-900 dark:text-white">{data.previousPeriod}</p>
          <p className="relative mt-0.5 text-xs text-slate-400/70">{prevLabel}</p>
        </div>
        <div className="group relative overflow-hidden rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/20" />
          <p className="relative text-xs font-medium text-slate-400 dark:text-slate-500">Crecimiento</p>
          <p className={`relative mt-1 text-2xl font-bold ${
            data.growth >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
          }`}>
            {formatGrowth(data.growth)}
          </p>
          <p className="relative mt-0.5 text-xs text-slate-400/70">vs período anterior</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
          Registros por {selectedDays > 7 ? "semana" : "día"}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.daily}>
            <defs>
              <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
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
              formatter={(v) => [`${v} vendedor${v !== 1 ? "es" : ""}`, "Registrados"]}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="rgba(59,130,246,0.8)"
              strokeWidth={2}
              fill="url(#regGradient)"
              name="Registrados"
              dot={{ r: 3, fill: "rgba(59,130,246,0.8)", stroke: "rgba(255,255,255,0.6)", strokeWidth: 2 }}
              activeDot={{ r: 5, fill: "#3b82f6", stroke: "rgba(255,255,255,0.8)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <div className="flex items-center gap-2 border-b border-white/20 px-5 py-4 dark:border-slate-700/30">
          <Store className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Últimos vendedores creados
          </h2>
        </div>
        <div className="relative overflow-hidden">
          {data.recentVendors.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">Sin vendedores.</p>
          ) : (
            <div className="group/marquee flex gap-4 px-5 py-4">
              <div className="flex shrink-0 animate-marquee gap-4 group-hover/marquee:[animation-play-state:paused]">
                {[...data.recentVendors, ...data.recentVendors].map((v, i) => (
                  <div
                    key={`${v.id}-${i}`}
                    className="flex w-52 shrink-0 flex-col gap-1.5 rounded-xl border border-white/30 bg-gradient-to-br from-white/40 to-slate-100/40 p-4 shadow-md shadow-black/5 backdrop-blur-2xl transition-all duration-300 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/10 dark:border-slate-700/40 dark:from-slate-900/50 dark:to-slate-800/40 dark:hover:border-blue-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
                        {v.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {v.name}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(v.createdAt).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(v.createdAt).toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
