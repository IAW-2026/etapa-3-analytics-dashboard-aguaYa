import {
  LayoutDashboard,
  Store,
  Truck,
  CreditCard,
  MessageSquare,
  Users,
  PieChart,
  Table2,
  Activity,
  TrendingUp,
  UserPlus,
  BarChart3,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  label: string
  href?: string
  icon: LucideIcon
  children?: NavItem[]
}

export const mainNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
]

export const sellerNav: NavItem[] = [
  {
    label: "Vendedores",
    icon: Store,
    children: [
      { label: "General", href: "/dashboard/seller", icon: Table2 },
      { label: "Activos / Inactivos", href: "/dashboard/seller/active-inactive", icon: PieChart },
      { label: "Actividad", href: "/dashboard/seller/activity", icon: Activity },
      { label: "Crecimiento", href: "/dashboard/seller/growth", icon: TrendingUp },
      { label: "Registros", href: "/dashboard/seller/registrations", icon: UserPlus },
      { label: "Inventario", href: "/dashboard/seller/inventory", icon: BarChart3 },
    ],
  },
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
  {
    label: "Buyers",
    icon: Users,
    children: [
      { label: "Overview", href: "/dashboard/buyers", icon: LayoutDashboard },
      { label: "Actividad", href: "/dashboard/buyers/activity", icon: Activity },
      { label: "Ingresos", href: "/dashboard/buyers/revenue", icon: BarChart3 },
    ],
  },
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
