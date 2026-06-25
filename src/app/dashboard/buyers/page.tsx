import { buyerApi } from "@/lib/api-buyer"
import type { BuyerStatsResponse } from "@/lib/types"
import BuyerActiveChart from "./buyer-active-chart"

export const dynamic = "force-dynamic"

export default async function BuyersPage() {
  let data: BuyerStatsResponse | null = null
  let error: string | null = null

  try {
    data = (await buyerApi.get("/api/analytics/buyers/stats")) as BuyerStatsResponse
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido"
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">
          Buyer
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Overview</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200/60 bg-white/80 px-5 py-4 text-sm text-red-700 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-red-800/60 dark:bg-slate-900/80 dark:text-red-400">
          {error}
        </div>
      )}

      {data && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Buyers</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{data.totals.total}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Activos</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{data.totals.active}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Inactivos</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{data.totals.inactive}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-6 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <BuyerActiveChart active={data.totals.active} inactive={data.totals.inactive} />
            </div>

            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-6 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                Resumen
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-white/40 px-4 py-3 dark:bg-slate-800/40">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Buyers activos</span>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {data.totals.active}
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      ({data.totals.total > 0 ? Math.round((data.totals.active / data.totals.total) * 100) : 0}%)
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/40 px-4 py-3 dark:bg-slate-800/40">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Buyers inactivos</span>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {data.totals.inactive}
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      ({data.totals.total > 0 ? Math.round((data.totals.inactive / data.totals.total) * 100) : 0}%)
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/40 px-4 py-3 dark:bg-slate-800/40">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{data.totals.total}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
            <div className="border-b border-white/20 px-5 py-4 dark:border-slate-700/30">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Listado de Buyers
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20 text-left text-xs font-medium text-slate-500 dark:border-slate-700/30 dark:text-slate-400">
                    <th className="px-5 py-3">Nombre</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3 text-center">Favoritos</th>
                    <th className="px-5 py-3 text-center">Direcciones</th>
                    <th className="px-5 py-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.buyers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                        No se encontraron buyers.
                      </td>
                    </tr>
                  )}
                  {data.buyers.map((buyer) => (
                    <tr
                      key={buyer.buyer_id}
                      className="border-b border-white/20 transition-colors hover:bg-white/20 dark:border-slate-700/30 dark:hover:bg-white/5"
                    >
                      <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">
                        {buyer.name}
                      </td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{buyer.mail}</td>
                      <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">
                        {buyer._count.favorites}
                      </td>
                      <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">
                        {buyer._count.addresses}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            buyer.is_active
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                          }`}
                        >
                          {buyer.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
