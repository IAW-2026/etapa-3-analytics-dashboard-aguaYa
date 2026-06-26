import { sellerApi } from "@/lib/api"
import RegistrationsClient from "./registrations-client"

export const dynamic = "force-dynamic"

type RecentVendor = {
  id: string
  name: string
  createdAt: string
}

type RegistrationsData = {
  daily: { date: string; count: number }[]
  currentPeriod: number
  previousPeriod: number
  growth: number
  days: number
  recentVendors: RecentVendor[]
}

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>
}) {
  const { days } = await searchParams
  const rangeDays = days ? Math.min(Math.max(parseInt(days, 10), 7), 365) : 30

  let data: RegistrationsData | null = null
  let error: string | null = null

  try {
    data = (await sellerApi.get("/api/admin/vendors/registrations", {
      days: String(rangeDays),
    })) as RegistrationsData
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido"
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">
          Seller / Vendedores
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Registros</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200/60 bg-white/80 px-5 py-4 text-sm text-red-700 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-red-800/60 dark:bg-slate-900/80 dark:text-red-400">
          {error}
        </div>
      )}

      {data && <RegistrationsClient data={data} selectedDays={rangeDays} />}
    </div>
  )
}
