import { sellerApi } from "@/lib/api"
import type { Vendor, ListResponse } from "@/lib/types"
import { Store, Package, ShoppingCart, Users } from "lucide-react"
import VendorTableClient from "./vendor-table-client"

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

          <VendorTableClient
            vendors={vendors}
            total={total}
            pageCount={pageCount}
            currentPage={Number(page ?? 1)}
            query={q ?? ""}
            basePath="/dashboard/seller"
          />
        </>
      )}
    </div>
  )
}
