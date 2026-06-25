import { buyerApi } from "@/lib/api-buyer"
import type { RevenueResponse } from "@/lib/types"
import RevenueClient from "./revenue-client"

export const dynamic = "force-dynamic"

export default async function RevenuePage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>
}) {
  const { days } = await searchParams
  const rangeDays = days ? Math.min(Math.max(parseInt(days, 10), 7), 365) : 0

  const params: Record<string, string> = {}
  if (rangeDays > 0) {
    const now = new Date()
    params.from = new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    params.to = now.toISOString().slice(0, 10)
  }

  let data: RevenueResponse | null = null
  let error: string | null = null

  try {
    data = (await buyerApi.get("/api/analytics/revenue", params)) as RevenueResponse
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido"
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">
          Buyer
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Ingresos</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200/60 bg-white/80 px-5 py-4 text-sm text-red-700 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-red-800/60 dark:bg-slate-900/80 dark:text-red-400">
          {error}
        </div>
      )}

      {data && <RevenueClient data={data} selectedDays={rangeDays} />}
    </div>
  )
}
