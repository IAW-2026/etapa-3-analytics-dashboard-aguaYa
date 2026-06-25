import { buyerApi } from "@/lib/api-buyer"
import type { TimelineResponse } from "@/lib/types"
import ActivityClient from "./activity-client"

export const dynamic = "force-dynamic"

export default async function BuyerActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>
}) {
  const { days } = await searchParams
  const rangeDays = days ? Math.min(Math.max(parseInt(days, 10), 7), 365) : 30

  const now = new Date()
  const to = now.toISOString().slice(0, 10)
  const from = new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  let data: TimelineResponse | null = null
  let error: string | null = null

  try {
    data = (await buyerApi.get("/api/analytics/orders/timeline", {
      from,
      to,
      group_by: "day",
    })) as TimelineResponse
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido"
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">
          Buyer
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Actividad</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200/60 bg-white/80 px-5 py-4 text-sm text-red-700 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-red-800/60 dark:bg-slate-900/80 dark:text-red-400">
          {error}
        </div>
      )}

      {data && <ActivityClient data={data.timeline} selectedDays={rangeDays} />}
    </div>
  )
}
