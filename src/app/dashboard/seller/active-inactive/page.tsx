import { sellerApi } from "@/lib/api"
import VendorActiveChart from "./vendor-active-chart"

export const dynamic = "force-dynamic"

type VendorBrief = { id: string; name: string; isActive: boolean; _count: { products: number; orders: number } }

export default async function ActiveInactivePage() {
  let vendors: VendorBrief[] = []
  let error: string | null = null

  try {
    const res = (await sellerApi.get("/api/admin/vendors/all")) as { items: VendorBrief[]; total: number }
    vendors = res.items
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido"
  }

  if (vendors.length === 0 && !error) {
    error = "No se encontraron vendedores."
  }

  const activeCount = vendors.filter((v) => v.isActive).length
  const inactiveCount = vendors.filter((v) => !v.isActive).length

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">
          Seller / Vendedores
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Activos / Inactivos</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200/60 bg-white/80 px-5 py-4 text-sm text-red-700 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-red-800/60 dark:bg-slate-900/80 dark:text-red-400">
          {error}
        </div>
      )}

      {!error && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-6 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
            <VendorActiveChart active={activeCount} inactive={inactiveCount} />
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-white/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-emerald-800/40 dark:from-emerald-900/20 dark:to-slate-900/40">
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Vendedores Activos</p>
              <p className="mt-1 text-3xl font-bold text-emerald-700 dark:text-emerald-300">{activeCount}</p>
              <p className="mt-1 text-xs text-emerald-500/70">
                {vendors.length > 0 ? `${Math.round((activeCount / vendors.length) * 100)}% del total` : "—"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/60 bg-gradient-to-br from-slate-50/50 to-white/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-800/20 dark:to-slate-900/40">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Vendedores Inactivos</p>
              <p className="mt-1 text-3xl font-bold text-slate-600 dark:text-slate-300">{inactiveCount}</p>
              <p className="mt-1 text-xs text-slate-400/70">
                {vendors.length > 0 ? `${Math.round((inactiveCount / vendors.length) * 100)}% del total` : "—"}
              </p>
            </div>

            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Vendedores</p>
              <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{vendors.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
