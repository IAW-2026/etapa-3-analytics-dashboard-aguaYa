import { sellerApi } from "@/lib/api"
import type { VendorDetailResponse, ProductItem, OrderItem, ListResponse } from "@/lib/types"
import Link from "next/link"
import { Store, Package, ShoppingCart, ArrowLeft, Mail, Calendar } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let vendor: VendorDetailResponse["vendor"] | null = null
  let products: ProductItem[] = []
  let orders: OrderItem[] = []
  let error: string | null = null

  try {
    const res = (await sellerApi.get(`/api/admin/vendors/${id}`)) as VendorDetailResponse
    if (!res.success) throw new Error("Vendedor no encontrado")
    vendor = res.vendor

    const [prodRes, ordRes] = await Promise.all([
      sellerApi.get(`/api/admin/vendors/${id}/products`),
      sellerApi.get(`/api/admin/vendors/${id}/orders`),
    ])
    products = (prodRes as ListResponse<ProductItem>).items
    orders = (ordRes as ListResponse<OrderItem>).items
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido"
  }

  if (error || !vendor) {
    return (
      <div>
        <Link href="/dashboard/seller" className="mb-4 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
          <ArrowLeft className="h-4 w-4" />
          Volver a vendedores
        </Link>
        <div className="rounded-xl border border-red-200/60 bg-white/80 px-5 py-4 text-sm text-red-700 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-red-800/60 dark:bg-slate-900/80 dark:text-red-400">
          {error ?? "Vendedor no encontrado"}
        </div>
      </div>
    )
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div>
      <Link
        href="/dashboard/seller"
        className="mb-4 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a vendedores
      </Link>

      <div className="mb-6 rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-6 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-md">
              {vendor.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{vendor.name}</h1>
              <div className="mt-1 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {vendor.clerkEmail}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Creado {new Date(vendor.createdAt).toLocaleDateString("es-AR")}
                </span>
              </div>
            </div>
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              vendor.isActive
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"
            }`}
          >
            {vendor.isActive ? "Activo" : "Inactivo"}
          </span>
        </div>

        {vendor.description && (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{vendor.description}</p>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-white/20 bg-white/40 p-4 dark:border-slate-700/30 dark:bg-slate-900/40">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Productos</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {vendor._count.products}
            </p>
          </div>
          <div className="rounded-lg border border-white/20 bg-white/40 p-4 dark:border-slate-700/30 dark:bg-slate-900/40">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pedidos</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {vendor._count.orders}
            </p>
          </div>
          <div className="rounded-lg border border-white/20 bg-white/40 p-4 dark:border-slate-700/30 dark:bg-slate-900/40">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Ingresos</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              ${totalRevenue.toLocaleString("es-AR")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <div className="flex items-center gap-2 border-b border-white/20 px-5 py-4 dark:border-slate-700/30">
            <Package className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Productos</h2>
          </div>
          {products.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">Sin productos.</p>
          ) : (
            <div className="divide-y divide-white/20 dark:divide-slate-700/30">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Stock: {p.stock}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      ${p.price.toLocaleString("es-AR")}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.isActive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                      }`}
                    >
                      {p.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <div className="flex items-center gap-2 border-b border-white/20 px-5 py-4 dark:border-slate-700/30">
            <ShoppingCart className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Pedidos Recientes</h2>
          </div>
          {orders.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">Sin pedidos.</p>
          ) : (
            <div className="divide-y divide-white/20 dark:divide-slate-700/30">
              {orders.slice(0, 10).map((o) => (
                <div key={o.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      #{o.externalId}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{o.buyerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      ${o.total.toLocaleString("es-AR")}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
