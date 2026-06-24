import { MessageSquare, Star, BarChart3, Users, TrendingUp, TrendingDown } from "lucide-react"
import { getFeedbackStats, getReviews, getValoraciones, getTopVendors, getBottomVendors } from "@/lib/feedback-service"
import { StarDistribution } from "./star-distribution"
import { VendorRatings } from "./vendor-ratings"
import { ReviewsTable } from "./reviews-table"
import { ValoracionesTable } from "./valoraciones-table"
import { StatCard } from "./stat-card"
import { TabBar } from "./tab-bar"

export const dynamic = "force-dynamic"

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string; estrellas?: string; vpage?: string; vestrellas?: string }>
}) {
  const { tab, page, estrellas, vpage, vestrellas } = await searchParams
  const activeTab = tab === "valoraciones" ? "valoraciones" : "resenas"

  let stats: Awaited<ReturnType<typeof getFeedbackStats>> | null = null
  let reviewsData: Awaited<ReturnType<typeof getReviews>> | null = null
  let valoracionesData: Awaited<ReturnType<typeof getValoraciones>> | null = null
  let topVendors: Awaited<ReturnType<typeof getTopVendors>> = []
  let bottomVendors: Awaited<ReturnType<typeof getBottomVendors>> = []
  let error: string | null = null

  try {
    const reviewsParams: Record<string, string> = {}
    if (page) reviewsParams.page = page
    reviewsParams.limit = "15"
    if (estrellas) reviewsParams.estrellas = estrellas

    const valoracionesParams: Record<string, string> = {}
    if (vpage) valoracionesParams.page = vpage
    valoracionesParams.limit = "15"
    if (vestrellas) valoracionesParams.estrellas = vestrellas

    stats = await getFeedbackStats()
    topVendors = await getTopVendors(5)
    bottomVendors = await getBottomVendors(5)

    if (activeTab === "resenas") {
      reviewsData = await getReviews(reviewsParams)
    } else {
      valoracionesData = await getValoraciones(valoracionesParams)
    }
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
            <StatCard label="Total Reseñas" value={stats.totalResenas} icon={MessageSquare} color="sky" />
            <StatCard label="Prom. Reseñas" value={stats.promedioEstrellasResenas.toFixed(1)} icon={Star} color="amber" />
            <StatCard label="Total Valoraciones" value={stats.totalValoraciones} icon={BarChart3} color="purple" />
            <StatCard label="Vendedores c/ Reseñas" value={stats.vendedoresConResenas} icon={Users} color="emerald" />
          </div>

          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <div className="grid gap-6">
              <StarDistribution
                data={stats.resenasPorEstrella}
                promedio={stats.promedioEstrellasResenas}
                total={stats.totalResenas}
                title="Distribución de Reseñas"
              />
              <StarDistribution
                data={stats.valoracionesPorEstrella}
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

          <TabBar activeTab={activeTab} estrellas={estrellas} vestrellas={vestrellas} />

          {activeTab === "resenas" && (
            <ReviewsTable
              reviews={reviewsData?.items ?? []}
              total={reviewsData?.total ?? 0}
              totalPages={reviewsData?.totalPages ?? 0}
              currentPage={Number(page ?? 1)}
            />
          )}

          {activeTab === "valoraciones" && (
            <ValoracionesTable
              valoraciones={valoracionesData?.items ?? []}
              total={valoracionesData?.total ?? 0}
              totalPages={valoracionesData?.totalPages ?? 0}
              currentPage={Number(vpage ?? 1)}
            />
          )}
        </>
      )}
    </div>
  )
}
