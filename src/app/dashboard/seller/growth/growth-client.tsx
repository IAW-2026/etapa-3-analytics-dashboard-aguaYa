"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { VendorSparkline } from "./vendor-sparkline"

export type GrowthVendor = {
  vendorId: string
  vendorName: string
  currentOrders: number
  previousOrders: number
  growth: number
  trend: number[]
}

export type GrowthData = {
  vendors: GrowthVendor[]
  days: number
  summary: {
    avgGrowth: number
    growing: number
    declining: number
    stable: number
  }
}

type Props = {
  data: GrowthData
  selectedDays: number
}

const RANGES = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
]

type SortKey = "vendorName" | "previousOrders" | "currentOrders" | "growth"

const PAGE_SIZE = 15

function formatGrowth(v: number) {
  const sign = v >= 0 ? "+" : ""
  return `${sign}${v}%`
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
  return [`Período anterior (${fmtDate(from)} - ${fmtDate(mid)})`, `Período actual (${fmtDate(mid)} - ${fmtDate(now)})`]
}

function VendorTableCard({
  title,
  vendors,
  accent,
}: {
  title: string
  vendors: GrowthVendor[]
  accent: "green" | "red" | "neutral"
}) {
  if (vendors.length === 0) return null

  const headerBorder = {
    green: "border-emerald-200/60 dark:border-emerald-800/40",
    red: "border-red-200/60 dark:border-red-800/40",
    neutral: "border-white/30 dark:border-slate-700/40",
  }[accent]

  return (
    <div className={`rounded-xl border ${headerBorder} bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:from-slate-900/40 dark:to-slate-800/40`}>
      <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/30 dark:border-slate-700/40">
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Nombre</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Anterior</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Actual</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Crecimiento</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Tendencia</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.vendorId} className="border-b border-white/20 transition-colors hover:bg-white/20 dark:border-slate-700/30 dark:hover:bg-slate-800/30">
                <td className="max-w-[180px] truncate px-3 py-2.5 font-medium text-slate-900 dark:text-slate-100">{v.vendorName}</td>
                <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400">{v.previousOrders}</td>
                <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400">{v.currentOrders}</td>
                <td className={`px-3 py-2.5 font-semibold ${
                  accent === "green"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : accent === "red"
                    ? "text-red-600 dark:text-red-400"
                    : v.growth > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : v.growth < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}>
                  {formatGrowth(v.growth)}
                </td>
                <td className="px-3 py-2.5">
                  <VendorSparkline data={v.trend} color={accent === "green" ? "#22c55e" : accent === "red" ? "#ef4444" : v.growth >= 0 ? "#22c55e" : "#ef4444"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function GrowthClient({ data, selectedDays }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("growth")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const { vendors, summary } = data
  const topGrowing = useMemo(
    () =>
      [...vendors]
        .filter((v) => v.growth > 0)
        .sort((a, b) => b.growth - a.growth)
        .slice(0, 5),
    [vendors],
  )
  const topDeclining = useMemo(
    () =>
      [...vendors]
        .filter((v) => v.growth < 0)
        .sort((a, b) => a.growth - b.growth)
        .slice(0, 5),
    [vendors],
  )

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1
    return [...vendors].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === "string") return av.localeCompare(bv as string) * dir
      return ((av as number) - (bv as number)) * dir
    })
  }, [vendors, sortKey, sortDir])

  const filtered = useMemo(
    () => sorted.filter((v) => v.vendorName.toLowerCase().includes(search.toLowerCase())),
    [sorted, search],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const [prevLabel, currLabel] = dateRangeLabel(selectedDays)

  function toggleSort(key: SortKey) {
    setPage(1)
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {RANGES.map((r) => (
          <Link
            key={r.days}
            href={`/dashboard/seller/growth?days=${r.days}`}
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

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Crecimiento promedio</p>
          <p className={`mt-1 text-2xl font-bold ${
            summary.avgGrowth >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
          }`}>
            {formatGrowth(summary.avgGrowth)}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-white/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-emerald-800/40 dark:from-emerald-900/20 dark:to-slate-900/40">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">En crecimiento</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{summary.growing}</p>
          <p className="mt-0.5 text-xs text-emerald-500/70">vendedores</p>
        </div>
        <div className="rounded-xl border border-red-200/60 bg-gradient-to-br from-red-50/50 to-white/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-red-800/40 dark:from-red-900/20 dark:to-slate-900/40">
          <p className="text-xs font-medium text-red-500 dark:text-red-400">En declive</p>
          <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">{summary.declining}</p>
          <p className="mt-0.5 text-xs text-red-400/70">vendedores</p>
        </div>
        <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Estables</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{summary.stable}</p>
          <p className="mt-0.5 text-xs text-slate-400/70">vendedores</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <VendorTableCard title="Top crecimiento" vendors={topGrowing} accent="green" />
        <VendorTableCard title="Top declive" vendors={topDeclining} accent="red" />
      </div>

      <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Todos los vendedores</h2>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Buscar por nombre…"
            className="w-full max-w-[260px] rounded-lg border border-white/30 bg-white/40 px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 backdrop-blur-xl transition-colors focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20 dark:border-slate-700/40 dark:bg-slate-800/40 dark:text-slate-100 dark:placeholder-slate-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/30 dark:border-slate-700/40">
                {([
                  { key: "vendorName", label: "Nombre" },
                  { key: "previousOrders", label: prevLabel },
                  { key: "currentOrders", label: currLabel },
                  { key: "growth", label: "Crecimiento" },
                ] as { key: SortKey; label: string }[]).map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className={`cursor-pointer select-none px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider transition-colors hover:text-sky-600 dark:hover:text-sky-400 ${
                      sortKey === col.key
                        ? "text-sky-600 dark:text-sky-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {col.label}
                    {sortKey === col.key && (
                      <span className="ml-1">{sortDir === "asc" ? "▲" : "▼"}</span>
                    )}
                  </th>
                ))}
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Tendencia
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                    {search ? "No se encontraron vendedores con ese nombre." : "No hay datos disponibles"}
                  </td>
                </tr>
              )}
              {paginated.map((v) => (
                <tr
                  key={v.vendorId}
                  className="border-b border-white/20 transition-colors hover:bg-white/20 dark:border-slate-700/30 dark:hover:bg-slate-800/30"
                >
                  <td className="max-w-[180px] truncate px-3 py-2.5 font-medium text-slate-900 dark:text-slate-100">
                    {v.vendorName}
                  </td>
                  <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400">{v.previousOrders}</td>
                  <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400">{v.currentOrders}</td>
                  <td className={`px-3 py-2.5 font-semibold ${
                    v.growth > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : v.growth < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}>
                    {formatGrowth(v.growth)}
                  </td>
                  <td className="px-3 py-2.5">
                    <VendorSparkline data={v.trend} color={v.growth >= 0 ? "#22c55e" : "#ef4444"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-4 dark:border-slate-700/30">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {filtered.length} vendedor{filtered.length !== 1 ? "es" : ""}
              {search && ` coinciden con "${search}"`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="rounded-lg border border-white/30 bg-white/30 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur-xl transition-colors hover:bg-white/50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700/40 dark:bg-slate-800/30 dark:text-slate-300"
              >
                Anterior
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="rounded-lg border border-white/30 bg-white/30 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur-xl transition-colors hover:bg-white/50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700/40 dark:bg-slate-800/30 dark:text-slate-300"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
