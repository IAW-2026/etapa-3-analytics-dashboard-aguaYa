export type Vendor = {
  id: string
  name: string
  description?: string
  address: string
  image?: string
  cuil?: string
  cuit?: string
  isActive: boolean
  createdAt: string
  clerkName: string
  clerkEmail: string
  _count: { products: number; orders: number }
}

export type ListResponse<T> = {
  items: T[]
  total: number
  pageCount: number
}

export type VendorDetailResponse = {
  success: boolean
  vendor: Vendor
}

export type ProductItem = {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  image?: string
  isActive: boolean
  createdAt: string
  vendor?: { name: string; id: string }
}

export type OrderItem = {
  id: string
  externalId: string
  buyerName: string
  status: string
  total: number
  address?: string
  createdAt: string
  items: { id: string; productName: string; productPrice: number; quantity: number }[]
  vendor?: { name: string; id: string }
}

export type AnalyticsOverview = {
  buyers: { total: number; active: number; inactive: number }
  orders: { by_status: Record<string, number>; total: number }
  revenue: number
}

export type TimelineEntry = {
  date: string
  count: number
  revenue: number
}

export type TimelineResponse = {
  timeline: TimelineEntry[]
}

export type BuyerStatItem = {
  buyer_id: string
  name: string
  mail: string
  is_active: boolean
  _count: { favorites: number; addresses: number }
}

export type BuyerStatsResponse = {
  totals: { total: number; active: number; inactive: number }
  buyers: BuyerStatItem[]
}

export type RevenueByVendor = {
  vendor_id: string
  revenue: number
  orders: number
}

export type RevenueResponse = {
  total_revenue: number
  total_orders: number
  by_vendor: RevenueByVendor[]
}
