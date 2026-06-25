"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, ArrowUpDown } from "lucide-react"

type SortKey = "name" | "products" | "orders"

type VendorRow = {
  id: string
  name: string
  clerkEmail: string
  isActive: boolean
  _count: { products: number; orders: number }
}

type Props = {
  vendors: VendorRow[]
  total: number
  pageCount: number
  currentPage: number
  query: string
  basePath: string
}

export default function VendorTableClient({ vendors, total, pageCount, currentPage, query, basePath }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const sorted = useMemo(() => {
    const list = [...vendors]
    list.sort((a, b) => {
      let cmp = 0
      if (sortKey === "name") cmp = a.name.localeCompare(b.name)
      else if (sortKey === "products") cmp = a._count.products - b._count.products
      else cmp = a._count.orders - b._count.orders
      return sortDir === "desc" ? -cmp : cmp
    })
    return list
  }, [vendors, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"))
    else { setSortKey(key); setSortDir(key === "name" ? "asc" : "desc") }
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
    <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
      <div className="flex items-center justify-between border-b border-white/20 px-5 py-4 dark:border-slate-700/30">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Listado de Vendedores ({total})
        </h2>
        <form method="GET" action={basePath} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Buscar..."
            className="w-56 rounded-lg border border-white/30 bg-white/50 px-8 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500"
          />
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/20 text-left text-xs font-medium text-slate-500 dark:border-slate-700/30 dark:text-slate-400">
              <SortTh sortKey="name" label="Vendedor" className="px-5 py-3" />
              <th className="px-5 py-3">Email</th>
              <SortTh sortKey="products" label="Productos" className="px-5 py-3 text-center" />
              <SortTh sortKey="orders" label="Pedidos" className="px-5 py-3 text-center" />
              <th className="px-5 py-3 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                  No se encontraron vendedores.
                </td>
              </tr>
            )}
            {sorted.map((vendor) => (
              <tr
                key={vendor.id}
                className="border-b border-white/20 transition-colors hover:bg-white/20 dark:border-slate-700/30 dark:hover:bg-white/5"
              >
                <td className="px-5 py-3">
                  <Link
                    href={`/dashboard/seller/${vendor.id}`}
                    className="font-medium text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                  >
                    {vendor.name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{vendor.clerkEmail}</td>
                <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">
                  {vendor._count.products}
                </td>
                <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">
                  {vendor._count.orders}
                </td>
                <td className="px-5 py-3 text-center">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      vendor.isActive
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                    }`}
                  >
                    {vendor.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-white/20 px-5 py-3 dark:border-slate-700/30">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Página {currentPage} de {pageCount}
          </p>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`${basePath}?${new URLSearchParams({ ...(query && { q: query }), page: String(currentPage - 1) }).toString()}`}
                className="rounded-lg border border-white/30 bg-white/50 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-slate-300"
              >
                Anterior
              </Link>
            )}
            {currentPage < pageCount && (
              <Link
                href={`${basePath}?${new URLSearchParams({ ...(query && { q: query }), page: String(currentPage + 1) }).toString()}`}
                className="rounded-lg border border-white/30 bg-white/50 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-slate-300"
              >
                Siguiente
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
