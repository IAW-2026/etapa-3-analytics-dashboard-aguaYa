export type FeedbackStats = {
  totalResenas: number
  totalValoraciones: number
  totalPedidos: number
  promedioEstrellasResenas: number
  promedioEstrellasValoraciones: number
  resenasPorEstrella: Record<string, number>
  valoracionesPorEstrella: Record<string, number>
  vendedoresConResenas: number
}

export type Review = {
  id_resena: number
  id_pedido: string
  id_usuario: string
  id_vendedor: string
  estrellas: number
  comentario: string | null
  foto: string | null
  fecha: string
}

export type Valoracion = {
  id_valoracion: number
  id_usuario: string
  estrellas: number
  comentario: string | null
  fecha: string
}

export type VendorRating = {
  id_vendedor: string
  totalResenas: number
  promedioEstrellas: number
}

export type FeedbackResponse<T> = {
  success: boolean
  data: T
}

export type PaginatedData<T> = {
  items: T[]
  total: number
  page: number
  totalPages: number
}

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
