import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingCart,
  Truck,
  CreditCard,
  MessageSquare,
  Users,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

export const mainNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
]

export const sellerNav: NavItem[] = [
  { label: "Vendedores", href: "/dashboard/seller", icon: Store },
  { label: "Productos", href: "/dashboard/seller/products", icon: Package },
  { label: "Pedidos", href: "/dashboard/seller/orders", icon: ShoppingCart },
]

export const deliveryNav: NavItem[] = [
  { label: "Delivery", href: "/dashboard/delivery", icon: Truck },
]

export const paymentsNav: NavItem[] = [
  { label: "Pagos", href: "/dashboard/payments", icon: CreditCard },
]

export const feedbackNav: NavItem[] = [
  { label: "Feedback", href: "/dashboard/feedback", icon: MessageSquare },
]

export const buyerNav: NavItem[] = [
  { label: "Buyers", href: "/dashboard/buyers", icon: Users },
]

export type NavSection = {
  title: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  { title: "Seller", items: sellerNav },
  { title: "Delivery", items: deliveryNav },
  { title: "Payments", items: paymentsNav },
  { title: "Feedback", items: feedbackNav },
  { title: "Buyer", items: buyerNav },
]
