import { sellerApi } from "@/lib/api"
import type { Vendor, ListResponse } from "@/lib/types"
import Link from "next/link"
import { Store, Package, ShoppingCart, Users, Search } from "lucide-react"

export const dynamic = "force-dynamic"

type VendorBrief = { id: string; name: string; isActive: boolean; _count: { products: number; orders: number } }

export default async function SellerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams

  let vendors: Vendor[] = []
  let total = 0
  let pageCount = 0
  let error: string | null = null

  let allVendors: VendorBrief[] = []
  let globalTotal = 0

  try {
    const params: Record<string, string> = {}
    if (q) params.q = q
    if (page) params.page = page
    params.limit = "20"
    const res = (await sellerApi.get("/api/admin/vendors", params)) as ListResponse<Vendor>
    vendors = res.items
    total = res.total
    pageCount = res.pageCount
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido"
  }

  try {
    const res = (await sellerApi.get("/api/admin/vendors/all")) as { items: VendorBrief[]; total: number }
    allVendors = res.items
    globalTotal = res.total
  } catch {
    allVendors = vendors.map((v) => ({ id: v.id, name: v.name, isActive: v.isActive, _count: v._count }))
    globalTotal = total
  }

  const activeVendors = allVendors.filter((v) => v.isActive).length
  const totalProducts = allVendors.reduce((sum, v) => sum + v._count.products, 0)
  const totalOrders = allVendors.reduce((sum, v) => sum + v._count.orders, 0)

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">
          Seller
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Vendedores</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200/60 bg-white/80 px-5 py-4 text-sm text-red-700 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-red-800/60 dark:bg-slate-900/80 dark:text-red-400">
          {error}
        </div>
      )}

      {!error && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Vendedores</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{globalTotal}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Activos</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{activeVendors}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Productos</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pedidos</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{totalOrders}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
            <div className="flex items-center justify-between border-b border-white/20 px-5 py-4 dark:border-slate-700/30">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Listado de Vendedores
              </h2>
              <form method="GET" action="/dashboard/seller" className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="q"
                  defaultValue={q ?? ""}
                  placeholder="Buscar..."
                  className="w-56 rounded-lg border border-white/30 bg-white/50 px-8 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500"
                />
              </form>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20 text-left text-xs font-medium text-slate-500 dark:border-slate-700/30 dark:text-slate-400">
                    <th className="px-5 py-3">Vendedor</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3 text-center">Productos</th>
                    <th className="px-5 py-3 text-center">Pedidos</th>
                    <th className="px-5 py-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                        No se encontraron vendedores.
                      </td>
                    </tr>
                  )}
                  {vendors.map((vendor) => (
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
                  Página {page ? Number(page) : 1} de {pageCount}
                </p>
                <div className="flex gap-2">
                  {Number(page ?? 1) > 1 && (
                    <Link
                      href={`/dashboard/seller?${new URLSearchParams({ ...(q && { q }), page: String(Number(page ?? 1) - 1) }).toString()}`}
                      className="rounded-lg border border-white/30 bg-white/50 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-slate-300"
                    >
                      Anterior
                    </Link>
                  )}
                  {Number(page ?? 1) < pageCount && (
                    <Link
                      href={`/dashboard/seller?${new URLSearchParams({ ...(q && { q }), page: String(Number(page ?? 1) + 1) }).toString()}`}
                      className="rounded-lg border border-white/30 bg-white/50 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-slate-300"
                    >
                      Siguiente
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
