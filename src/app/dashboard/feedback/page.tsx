import { feedbackApi } from "@/lib/api"
import type { FeedbackStats, Review, VendorRating, FeedbackResponse, PaginatedData } from "@/lib/types"
import { MessageSquare, Star, Users, BarChart3, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { StarDistribution } from "./star-distribution"
import { VendorRatings } from "./vendor-ratings"
import { ReviewsTable } from "./reviews-table"

export const dynamic = "force-dynamic"

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; estrellas?: string }>
}) {
  const { page, estrellas } = await searchParams

  let stats: FeedbackStats | null = null
  let reviews: Review[] = []
  let totalReviews = 0
  let totalPages = 0
  let topVendors: VendorRating[] = []
  let bottomVendors: VendorRating[] = []
  let error: string | null = null

  try {
    const params: Record<string, string> = {}
    if (page) params.page = page
    params.limit = "20"
    if (estrellas) params.estrellas = estrellas

    const [statsRes, reviewsRes, topRes, bottomRes] = await Promise.all([
      feedbackApi.get("/api/analytics/stats"),
      feedbackApi.get("/api/analytics/reviews", params),
      feedbackApi.get("/api/analytics/vendors/top", { limit: "5" }),
      feedbackApi.get("/api/analytics/vendors/bottom", { limit: "5" }),
    ])

    stats = (statsRes as FeedbackResponse<FeedbackStats>).data
    const reviewsData = reviewsRes as FeedbackResponse<PaginatedData<Review>>
    reviews = reviewsData.data.items
    totalReviews = reviewsData.data.total
    totalPages = reviewsData.data.totalPages
    topVendors = (topRes as FeedbackResponse<VendorRating[]>).data
    bottomVendors = (bottomRes as FeedbackResponse<VendorRating[]>).data
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido"
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">
          Feedback
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Feedback</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200/60 bg-white/80 px-5 py-4 text-sm text-red-700 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-red-800/60 dark:bg-slate-900/80 dark:text-red-400">
          {error}
        </div>
      )}

      {!error && stats && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Reseñas</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.totalResenas}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Prom. Reseñas</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {stats.promedioEstrellasResenas.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Valoraciones</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.totalValoraciones}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Vendedores c/ Reseñas</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.vendedoresConResenas}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <div className="grid gap-6">
              <StarDistribution
                resenasPorEstrella={stats.resenasPorEstrella}
                promedio={stats.promedioEstrellasResenas}
                total={stats.totalResenas}
                title="Distribución de Reseñas"
              />
              <StarDistribution
                resenasPorEstrella={stats.valoracionesPorEstrella}
                promedio={stats.promedioEstrellasValoraciones}
                total={stats.totalValoraciones}
                title="Distribución de Valoraciones"
              />
            </div>

            <div className="grid gap-6">
              <VendorRatings
                vendors={topVendors}
                title="Mejores Vendedores"
                icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
                variant="top"
              />
              <VendorRatings
                vendors={bottomVendors}
                title="Peores Vendedores"
                icon={<TrendingDown className="h-4 w-4 text-red-500" />}
                variant="bottom"
              />
            </div>
          </div>

          <ReviewsTable
            reviews={reviews}
            total={totalReviews}
            totalPages={totalPages}
            currentPage={Number(page ?? 1)}
            estrellasFilter={estrellas ?? null}
          />
        </>
      )}
    </div>
  )
}
