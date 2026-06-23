import { sellerApi } from "@/lib/api"
import type { ProductItem, ListResponse } from "@/lib/types"
import Link from "next/link"
import { Package, Search } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams

  let products: ProductItem[] = []
  let total = 0
  let pageCount = 0
  let error: string | null = null

  try {
    const params: Record<string, string> = {}
    if (q) params.q = q
    if (page) params.page = page
    params.limit = "20"
    const res = (await sellerApi.get("/api/admin/products", params)) as ListResponse<ProductItem>
    products = res.items
    total = res.total
    pageCount = res.pageCount
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido"
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">
          Seller
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Productos</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200/60 bg-white/80 px-5 py-4 text-sm text-red-700 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-red-800/60 dark:bg-slate-900/80 dark:text-red-400">
          {error}
        </div>
      )}

      {!error && (
        <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <div className="flex items-center justify-between border-b border-white/20 px-5 py-4 dark:border-slate-700/30">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Listado de Productos ({total})
            </h2>
            <form method="GET" action="/dashboard/seller/products" className="relative">
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
                  <th className="px-5 py-3">Producto</th>
                  <th className="px-5 py-3">Vendedor</th>
                  <th className="px-5 py-3 text-right">Precio</th>
                  <th className="px-5 py-3 text-center">Stock</th>
                  <th className="px-5 py-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                      No se encontraron productos.
                    </td>
                  </tr>
                )}
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-white/20 transition-colors hover:bg-white/20 dark:border-slate-700/30 dark:hover:bg-white/5"
                  >
                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">{p.name}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-400">
                      {p.vendor?.name ?? "-"}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-900 dark:text-white">
                      ${p.price.toLocaleString("es-AR")}
                    </td>
                    <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">
                      {p.stock}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          p.isActive
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                        }`}
                      >
                        {p.isActive ? "Activo" : "Inactivo"}
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
                    href={`/dashboard/seller/products?${new URLSearchParams({ ...(q && { q }), page: String(Number(page ?? 1) - 1) }).toString()}`}
                    className="rounded-lg border border-white/30 bg-white/50 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-slate-300"
                  >
                    Anterior
                  </Link>
                )}
                {Number(page ?? 1) < pageCount && (
                  <Link
                    href={`/dashboard/seller/products?${new URLSearchParams({ ...(q && { q }), page: String(Number(page ?? 1) + 1) }).toString()}`}
                    className="rounded-lg border border-white/30 bg-white/50 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-slate-300"
                  >
                    Siguiente
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
