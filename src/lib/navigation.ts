import {
  LayoutDashboard,
  Store,
  Package,
  Truck,
  CreditCard,
  MessageSquare,
  Users,
  PieChart,
  Table2,
  Activity,
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
    ],
  },
  { label: "Productos", href: "/dashboard/seller/products", icon: Package },
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
