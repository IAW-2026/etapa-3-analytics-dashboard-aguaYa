import { feedbackApi } from "@/lib/api"
import type { FeedbackStats, Review, Valoracion, VendorRating, PaginatedData } from "@/lib/types"

export async function getFeedbackStats(): Promise<FeedbackStats> {
  const res = await feedbackApi.get("/api/analytics/stats") as { success: true; data: FeedbackStats }
  return res.data
}

export async function getReviews(params: Record<string, string> = {}): Promise<PaginatedData<Review>> {
  const res = await feedbackApi.get("/api/analytics/reviews", params) as { success: true; data: PaginatedData<Review> }
  return res.data
}

export async function getValoraciones(params: Record<string, string> = {}): Promise<PaginatedData<Valoracion>> {
  const res = await feedbackApi.get("/api/analytics/valoraciones", params) as { success: true; data: PaginatedData<Valoracion> }
  return res.data
}

export async function getTopVendors(limit = 5): Promise<VendorRating[]> {
  const res = await feedbackApi.get("/api/analytics/vendors/top", { limit: String(limit) }) as { success: true; data: VendorRating[] }
  return res.data
}

export async function getBottomVendors(limit = 5): Promise<VendorRating[]> {
  const res = await feedbackApi.get("/api/analytics/vendors/bottom", { limit: String(limit) }) as { success: true; data: VendorRating[] }
  return res.data
}
