import { Suspense } from "react"
import { LayoutDashboard, DollarSign, Star, Users, Clock, ArrowUpRight, ArrowDownRight, Truck } from "lucide-react"
import { sellerApi } from "@/lib/api"
import { buyerApi } from "@/lib/api-buyer"
import { deliveryApi } from "@/lib/delivery-api"
import { getTopVendors, getBottomVendors, getFeedbackStats } from "@/lib/feedback-service"
import type { FeedbackStats, RevenueResponse, TimelineResponse } from "@/lib/types"
import CrossAppBadge from "@/components/overview/CrossAppBadge"
import VendorMatrixSection from "@/components/overview/VendorMatrixSection"
import type { VendorWithMetrics } from "@/components/overview/VendorMatrixSection"
import ReviewCoverageChart from "@/components/overview/ReviewCoverageChart"
import type { QuartileData } from "@/components/overview/ReviewCoverageChart"
import TemporalPatternComparison from "@/components/overview/TemporalPatternComparison"

export const dynamic = "force-dynamic"

type VendorBrief = { id: string; name: string; isActive: boolean; _count: { products: number; orders: number } }
type HourlyEntry = { hour: number; count: number }

const MSG_ERROR = "No se puede conectar con uno o más servicios."

const DEFAULT_FEEDBACK_STATS: FeedbackStats = {
  totalResenas: 0,
  totalValoraciones: 0,
  totalPedidos: 0,
  promedioEstrellasResenas: 0,
  promedioEstrellasValoraciones: 0,
  resenasPorEstrella: {},
  valoracionesPorEstrella: {},
  vendedoresConResenas: 0,
}

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n)
}

export default async function OverviewPage() {
  const now = new Date()
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const today = now.toISOString().slice(0, 10)

  const revenueParams: Record<string, string> = {}
  revenueParams.from = ninetyDaysAgo
  revenueParams.to = today

  const timelineParams: Record<string, string> = {}
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  timelineParams.from = thirtyDaysAgo
  timelineParams.to = today

  const [
    sellerAll,
    revenue,
    feedbackStats,
    topVendors,
    bottomVendors,
    hourly,
    timeline,
  ] = await Promise.all([
    safeFetch(() => sellerApi.get("/api/admin/vendors/all") as Promise<{ items: VendorBrief[]; total: number }>, {
      items: [],
      total: 0,
    }),
    safeFetch(() => buyerApi.get("/api/analytics/revenue", revenueParams) as Promise<RevenueResponse>, {
      total_revenue: 0,
      total_orders: 0,
      by_vendor: [],
    }),
    safeFetch(() => getFeedbackStats(), DEFAULT_FEEDBACK_STATS),
    safeFetch(() => getTopVendors(200), []),
    safeFetch(() => getBottomVendors(200), []),
    safeFetch(() => deliveryApi.getAdvanced.hourlyDistribution() as Promise<HourlyEntry[]>, []),
    safeFetch(() => buyerApi.get("/api/analytics/orders/timeline", timelineParams) as Promise<TimelineResponse>, {
      timeline: [],
    }),
  ])

  const allVendors = sellerAll.items
  const totalVendors = sellerAll.total

  const revenueMap = new Map<string, { revenue: number; orders: number }>()
  for (const v of revenue.by_vendor) {
    revenueMap.set(v.vendor_id, { revenue: v.revenue, orders: v.orders })
  }

  const ratingMap = new Map<string, { avgStars: number; totalReviews: number }>()
  const mergedRatings = [...topVendors, ...bottomVendors]
  for (const v of mergedRatings) {
    if (!ratingMap.has(v.id_vendedor)) {
      ratingMap.set(v.id_vendedor, { avgStars: v.promedioEstrellas, totalReviews: v.totalResenas })
    }
  }

  const combinedVendors: VendorWithMetrics[] = allVendors
    .filter((v) => revenueMap.has(v.id) || ratingMap.has(v.id))
    .map((v) => ({
      id: v.id,
      name: v.name,
      revenue: revenueMap.get(v.id)?.revenue ?? 0,
      orders: revenueMap.get(v.id)?.orders ?? 0,
      avgStars: ratingMap.get(v.id)?.avgStars ?? 0,
      totalReviews: ratingMap.get(v.id)?.totalReviews ?? 0,
    }))
    .filter((v) => v.revenue > 0 || v.totalReviews > 0)

  const revenueVendors = allVendors.filter((v) => revenueMap.has(v.id))
  revenueVendors.sort(
    (a, b) => (revenueMap.get(b.id)?.revenue ?? 0) - (revenueMap.get(a.id)?.revenue ?? 0),
  )

  const quartileSize = Math.ceil(revenueVendors.length / 4)
  const quartiles: QuartileData[] = []
  for (let i = 0; i < 4; i++) {
    const slice = revenueVendors.slice(i * quartileSize, (i + 1) * quartileSize)
    const withReviews = slice.filter((v) => ratingMap.has(v.id)).length
    const label = i === 0 ? "Q4 (mayores ingresos)" : i === 3 ? "Q1 (menores ingresos)" : `Q${4 - i}`
    quartiles.push({
      label,
      total: slice.length,
      withReviews,
      percentage: slice.length > 0 ? Math.round((withReviews / slice.length) * 100) : 0,
    })
  }

  const hourlyData = Array.isArray(hourly) ? hourly : []
  const timelineData = timeline.timeline ?? []

  const totalOrders = revenue.total_orders
  const totalRevenue = revenue.total_revenue
  const avgStars = feedbackStats.promedioEstrellasResenas
  const vendorsWithReviews = feedbackStats.vendedoresConResenas
  const vendorsReviewRate = totalVendors > 0 ? Math.round((vendorsWithReviews / totalVendors) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">
          Cross-App Analytics
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Overview del Marketplace</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Truck}
          iconBg="bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400"
          label="Órdenes (90d)"
          value={formatNumber(totalOrders)}
          sub={`${revenue.by_vendor.length} vendedores`}
        />
        <StatCard
          icon={DollarSign}
          iconBg="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
          label="Revenue Total (90d)"
          value={formatCurrency(totalRevenue)}
        />
        <StatCard
          icon={Star}
          iconBg="bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
          label="Prom. Estrellas Reseñas"
          value={avgStars.toFixed(1)}
          sub={`${feedbackStats.totalResenas} reseñas`}
        />
        <StatCard
          icon={Users}
          iconBg="bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
          label="Vendedores c/ Reseñas"
          value={`${vendorsWithReviews} / ${totalVendors}`}
          sub={`${vendorsReviewRate}% del total`}
        />
      </div>

      {/* Revenue vs Stars Matrix */}
      <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Matriz Revenue vs Estrellas</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Vendedores clasificados por ingresos y calificación promedio
            </p>
          </div>
          <CrossAppBadge apps={["Buyer", "Feedback", "Seller"]} />
        </div>
        <VendorMatrixSection vendors={combinedVendors} />
      </div>

      {/* Review Coverage + Temporal */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Cobertura de Reseñas</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                % de vendedores con reseñas por quartil de ingresos
              </p>
            </div>
            <CrossAppBadge apps={["Seller", "Buyer", "Feedback"]} />
          </div>
          <ReviewCoverageChart quartiles={quartiles} />
        </div>

        <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Patrón de Actividad</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Comparativa de pedidos vs entregas
              </p>
            </div>
            <CrossAppBadge apps={["Buyer", "Delivery"]} />
          </div>
          <TemporalPatternComparison hourly={hourlyData} timeline={timelineData} />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  iconBg,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
          {sub && <p className="text-[10px] text-slate-400 dark:text-slate-500">{sub}</p>}
        </div>
      </div>
    </div>
  )
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("es-AR").format(n)
}
