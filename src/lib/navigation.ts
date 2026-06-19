import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  ShoppingCart,
  Star,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

export const mainNav: NavItem[] = [
  { label: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
]

export const analyticsNav: NavItem[] = [
  { label: "Transacciones", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { label: "Usuarios", href: "/dashboard/users", icon: Users },
  { label: "Pedidos", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Reseñas", href: "/dashboard/reviews", icon: Star },
]

export type NavSection = {
  title: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  { title: "Analytics", items: analyticsNav },
]
