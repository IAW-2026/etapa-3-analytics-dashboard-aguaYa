"use client"

import { useState, useMemo } from "react"
import { Store, Package, DollarSign, TrendingUp, Search, ArrowUpDown } from "lucide-react"

const PAGE_SIZE = 8

type InventoryItem = {
  id: string
  name: string
  isActive: boolean
  productCount: number
  inventoryValue: number
  totalRevenue: number
}

type Props = {
  data: {
    items: InventoryItem[]
    totals: {
      productCount: number
      inventoryValue: number
      totalRevenue: number
    }
  }
}

const fmt = (v: number) =>
  v.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

type SortKey = "name" | "productCount" | "inventoryValue" | "totalRevenue"

export default function InventoryClient({ data }: Props) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>("totalRevenue")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const sorted = useMemo(() => {
    let list = data.items
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((v) => v.name.toLowerCase().includes(q))

    list.sort((a, b) => {
      let cmp = 0
      if (sortKey === "name") cmp = a.name.localeCompare(b.name)
      else cmp = (a[sortKey] as number) - (b[sortKey] as number)
      return sortDir === "desc" ? -cmp : cmp
    })
    return list
  }, [data.items, search, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const paginated = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"))
    else { setSortKey(key); setSortDir("desc") }
    setPage(1)
  }

  function SortTh({ sortKey: sk, label, className }: { sortKey: SortKey; label: string; className?: string }) {
    const active = sortKey === sk
    return (
      <th className={`${className ?? ""} cursor-pointer select-none transition-colors hover:text-slate-900 dark:hover:text-white`}>
        <button onClick={() => toggleSort(sk)} className="inline-flex items-center gap-1">
          {label}
          <ArrowUpDown className={`h-3 w-3 transition-opacity ${active ? "opacity-100" : "opacity-40"}`} />
        </button>
      </th>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="group relative overflow-hidden rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-500/10 blur-2xl transition-all duration-500 group-hover:bg-blue-500/20" />
          <Package className="relative mb-2 h-4 w-4 text-blue-500" />
          <p className="relative text-xs font-medium text-slate-400 dark:text-slate-500">Productos</p>
          <p className="relative mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {data.totals.productCount}
          </p>
        </div>
        <div className="group relative overflow-hidden rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/20" />
          <DollarSign className="relative mb-2 h-4 w-4 text-emerald-500" />
          <p className="relative text-xs font-medium text-slate-400 dark:text-slate-500">Valor inventario</p>
          <p className="relative mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            ${fmt(data.totals.inventoryValue)}
          </p>
        </div>
        <div className="group relative overflow-hidden rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-sky-500/10 blur-2xl transition-all duration-500 group-hover:bg-sky-500/20" />
          <TrendingUp className="relative mb-2 h-4 w-4 text-sky-500" />
          <p className="relative text-xs font-medium text-slate-400 dark:text-slate-500">Ingresos totales</p>
          <p className="relative mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            ${fmt(data.totals.totalRevenue)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <div className="flex items-center justify-between border-b border-white/20 px-5 py-4 dark:border-slate-700/30">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Vendedores ({sorted.length})
            </h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Buscar vendedor..."
              className="w-56 rounded-lg border border-white/30 bg-white/50 px-8 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20 text-left text-xs font-medium text-slate-500 dark:border-slate-700/30 dark:text-slate-400">
                <SortTh sortKey="name" label="Vendedor" className="px-5 py-3" />
                <SortTh sortKey="productCount" label="Productos" className="px-5 py-3 text-right" />
                <SortTh sortKey="inventoryValue" label="Valor inventario" className="px-5 py-3 text-right" />
                <SortTh sortKey="totalRevenue" label="Ingresos" className="px-5 py-3 text-right" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-sm text-slate-500">
                    No se encontraron vendedores.
                  </td>
                </tr>
              )}
              {paginated.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-white/20 transition-colors hover:bg-white/20 dark:border-slate-700/30 dark:hover:bg-white/5"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
                        {v.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{v.name}</p>
                        <p className={`text-xs ${v.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                          {v.isActive ? "Activo" : "Inactivo"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-slate-900 dark:text-white">
                    {v.productCount}
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-slate-900 dark:text-white">
                    ${fmt(v.inventoryValue)}
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-slate-900 dark:text-white">
                    ${fmt(v.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <div className="flex items-center justify-between border-t border-white/20 px-5 py-3 dark:border-slate-700/30">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Página {safePage} de {pageCount}
            </p>
            <div className="flex gap-2">
              {safePage > 1 && (
                <button
                  onClick={() => setPage(safePage - 1)}
                  className="rounded-lg border border-white/30 bg-white/50 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-slate-300"
                >
                  Anterior
                </button>
              )}
              {safePage < pageCount && (
                <button
                  onClick={() => setPage(safePage + 1)}
                  className="rounded-lg border border-white/30 bg-white/50 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-slate-300"
                >
                  Siguiente
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
