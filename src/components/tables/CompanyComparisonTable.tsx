"use client"

import { useMemo, useState } from "react"
import type { CompanyStats } from "@/lib/delivery-types"
import { formatNumber } from "@/lib/utils"

type Props = {
  stats: CompanyStats[]
}

type SortKey = keyof CompanyStats

export default function CompanyComparisonTable({ stats }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("ordersCompleted")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1
    return [...stats].sort((a, b) => {
      const av = a[sortKey] ?? 0
      const bv = b[sortKey] ?? 0
      if (typeof av === "string") return av.localeCompare(bv as string) * dir
      return ((av as number) - (bv as number)) * dir
    })
  }, [stats, sortKey, sortDir])

  const columns: { key: SortKey; label: string }[] = [
    { key: "companyName", label: "Empresa" },
    { key: "ordersCompleted", label: "Pedidos" },
    { key: "totalBidones", label: "Bidones" },
    { key: "avgMinutes", label: "Tiempo" },
    { key: "availableDrivers", label: "Choferes" },
    { key: "activeVehicles", label: "Vehículos" },
    { key: "pendingRequests", label: "Pend." },
    { key: "blockedUsers", label: "Bloq." },
  ]

  return (
    <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
      <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
        Resumen por Empresa
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/30 dark:border-slate-700/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="cursor-pointer select-none whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-sky-600 dark:text-slate-500 dark:hover:text-sky-400"
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1">{sortDir === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                  No hay datos disponibles
                </td>
              </tr>
            )}
            {sorted.map((company) => (
              <tr
                key={company.companyId}
                className="border-b border-white/20 transition-colors hover:bg-white/20 dark:border-slate-700/30 dark:hover:bg-slate-800/30"
              >
                <td className="max-w-[180px] truncate px-3 py-2.5 font-medium text-slate-900 dark:text-slate-100">
                  {company.companyName}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 dark:text-slate-300">
                  {company.ordersCompleted}
                  <span className="text-slate-400">
                    /{company.ordersFailed}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-300">
                  {formatNumber(company.totalBidones)}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-500 dark:text-slate-400">
                  {company.avgMinutes.toFixed(1)} min
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 dark:text-slate-300">
                  {company.availableDrivers}/{company.totalDrivers}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-700 dark:text-slate-300">
                  {company.activeVehicles}/{company.pausedVehicles}
                </td>
                <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400">
                  {company.pendingRequests}
                </td>
                <td className="px-3 py-2.5">
                  <span className={company.blockedUsers > 0 ? "text-red-500 dark:text-red-400" : "text-slate-400"}>
                    {company.blockedUsers}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
