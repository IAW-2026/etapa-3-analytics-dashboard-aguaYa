"use client"

import { useMemo, useState } from "react"
import { VendorSparkline } from "@/app/dashboard/seller/growth/vendor-sparkline"
import { ChevronUp, ChevronDown } from "lucide-react"
import type { DriverRankingEntry } from "@/lib/delivery-types"

type Props = {
  drivers: DriverRankingEntry[]
}

type SortKey = "name" | "deliveries" | "avgTime" | "rating"

const PAGE_SIZE = 10

export default function DriverRankingTable({ drivers }: Props) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>("deliveries")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  function toggleSort(key: SortKey) {
    setPage(1)
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1
    return [...drivers]
      .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const av = a[sortKey] ?? 0
        const bv = b[sortKey] ?? 0
        if (typeof av === "string") return av.localeCompare(bv as string) * dir
        return ((av as number) - (bv as number)) * dir
      })
  }, [drivers, search, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function SortIcon({ active, direction }: { active: boolean; direction: "asc" | "desc" }) {
    if (!active) return null
    return direction === "asc" ? (
      <ChevronUp className="inline h-3 w-3" />
    ) : (
      <ChevronDown className="inline h-3 w-3" />
    )
  }

  return (
    <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Ranking de Choferes</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Buscar chofer…"
          className="w-full max-w-[240px] rounded-lg border border-white/30 bg-white/40 px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 backdrop-blur-xl transition-colors focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20 dark:border-slate-700/40 dark:bg-slate-800/40 dark:text-slate-100 dark:placeholder-slate-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/30 dark:border-slate-700/40">
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                #
              </th>
              {([
                { key: "name", label: "Nombre" },
                { key: "deliveries", label: "Pedidos" },
                { key: "avgTime", label: "Tiempo Prom." },
                { key: "rating", label: "Calificación" },
              ] as { key: SortKey; label: string }[]).map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="cursor-pointer select-none px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-sky-600 dark:text-slate-500 dark:hover:text-sky-400"
                >
                  {col.label}
                  <SortIcon active={sortKey === col.key} direction={sortDir} />
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
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                  {search ? "No se encontraron choferes con ese nombre." : "No hay datos disponibles"}
                </td>
              </tr>
            )}
            {paginated.map((driver, idx) => (
              <tr
                key={driver.name}
                className="border-b border-white/20 transition-colors hover:bg-white/20 dark:border-slate-700/30 dark:hover:bg-slate-800/30"
              >
                <td className="px-3 py-2.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                  {(currentPage - 1) * PAGE_SIZE + idx + 1}
                </td>
                <td className="max-w-[160px] truncate px-3 py-2.5 font-medium text-slate-900 dark:text-slate-100">
                  {driver.name}
                </td>
                <td className="px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-300">
                  {driver.deliveries}
                </td>
                <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400">
                  {driver.avgTime ? `${driver.avgTime.toFixed(1)} min` : "—"}
                </td>
                <td className="px-3 py-2.5">
                  {driver.rating ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
                      ★ {driver.rating.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  {driver.trend && driver.trend.length > 0 ? (
                    <VendorSparkline data={driver.trend} color="#3b82f6" />
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-4 dark:border-slate-700/30">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {sorted.length} chofer{ sorted.length !== 1 ? "es" : ""}{search && ` coinciden con "${search}"`}
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
  )
}
