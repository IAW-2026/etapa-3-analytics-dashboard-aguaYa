import { DollarSign, Star, Users } from "lucide-react"

export type VendorWithMetrics = {
  id: string
  name: string
  revenue: number
  orders: number
  avgStars: number
  totalReviews: number
}

type Category = "premium" | "oportunidad" | "prometedor" | "base"

function classify(revenue: number, orders: number, avgStars: number, medianRevenue: number, medianStars: number): Category {
  const highRevenue = revenue >= medianRevenue
  const highStars = avgStars >= medianStars
  if (highRevenue && highStars) return "premium"
  if (highRevenue && !highStars) return "oportunidad"
  if (!highRevenue && highStars) return "prometedor"
  return "base"
}

const classConfig = {
  premium: {
    label: "Premium",
    desc: "Alto revenue · Altas estrellas",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    border: "border-emerald-200/50 dark:border-emerald-800/30",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    icon: "text-emerald-500",
  },
  oportunidad: {
    label: "Oportunidad",
    desc: "Alto revenue · Bajas estrellas",
    dot: "bg-amber-500",
    bg: "bg-amber-50/50 dark:bg-amber-950/20",
    border: "border-amber-200/50 dark:border-amber-800/30",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    icon: "text-amber-500",
  },
  prometedor: {
    label: "Prometedor",
    desc: "Bajo revenue · Altas estrellas",
    dot: "bg-blue-500",
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    border: "border-blue-200/50 dark:border-blue-800/30",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    icon: "text-blue-500",
  },
  base: {
    label: "Base",
    desc: "Bajo revenue · Bajas estrellas",
    dot: "bg-slate-400",
    bg: "bg-transparent",
    border: "border-slate-200/30 dark:border-slate-700/30",
    badge: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
    icon: "text-slate-400",
  },
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n)
}

export default function VendorMatrixSection({ vendors }: { vendors: VendorWithMetrics[] }) {
  const withRevenue = vendors.filter((v) => v.revenue > 0)
  const withStars = vendors.filter((v) => v.avgStars > 0)
  const both = vendors.filter((v) => v.revenue > 0 && v.avgStars > 0)

  if (both.length === 0) {
    return (
      <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-6 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No hay suficientes datos combinados para mostrar la matriz.
        </p>
      </div>
    )
  }

  const medianRevenue = both.map((v) => v.revenue).sort((a, b) => a - b)[Math.floor(both.length / 2)]
  const medianStars = both.map((v) => v.avgStars).sort((a, b) => a - b)[Math.floor(both.length / 2)]

  const classified = both.map((v) => ({
    ...v,
    category: classify(v.revenue, v.orders, v.avgStars, medianRevenue, medianStars),
  }))

  const grouped = {
    premium: classified.filter((v) => v.category === "premium"),
    oportunidad: classified.filter((v) => v.category === "oportunidad"),
    prometedor: classified.filter((v) => v.category === "prometedor"),
    base: classified.filter((v) => v.category === "base"),
  }

  const topByCategory = Object.entries(grouped).reduce(
    (acc, [key, vendors]) => {
      acc[key as keyof typeof grouped] = vendors.slice(0, 4)
      return acc
    },
    {} as Record<string, VendorWithMetrics[]>,
  )

  const renderStars = (n: number) => {
    const full = Math.floor(n)
    const half = n - full >= 0.25 && n - full < 0.75 ? 1 : 0
    const empty = 5 - full - half
    return (
      <span className="text-amber-400">
        {"★".repeat(full)}
        {half ? "½" : ""}
        {"☆".repeat(empty)}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {(["premium", "oportunidad", "prometedor", "base"] as const).map((key) => {
          const cfg = classConfig[key]
          const list = grouped[key]
          return (
            <div
              key={key}
              className={`rounded-lg border p-3 ${cfg.bg} ${cfg.border}`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
                <span className={`text-xs font-bold ${cfg.badge}`}>{cfg.label}</span>
                <span className="ml-auto text-xs font-medium text-slate-400 dark:text-slate-500">
                  {list.length}
                </span>
              </div>
              <p className="mb-2 text-[10px] text-slate-400 dark:text-slate-500">{cfg.desc}</p>
              <ul className="space-y-1.5">
                {topByCategory[key].map((v) => (
                  <li key={v.id} className="flex items-center justify-between text-xs">
                    <span className="truncate font-medium text-slate-700 dark:text-slate-300 max-w-[120px]">
                      {v.name}
                    </span>
                    <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-0.5">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(v.revenue)}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 text-amber-400" />
                        {v.avgStars.toFixed(1)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="rounded-lg border border-slate-200/30 dark:border-slate-700/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200/30 dark:border-slate-700/30 text-slate-400 dark:text-slate-500">
                <th className="px-3 py-2 text-left font-medium">Vendedor</th>
                <th className="px-3 py-2 text-right font-medium">
                  <span className="flex items-center justify-end gap-1">
                    <DollarSign className="h-3 w-3" /> Ingresos
                  </span>
                </th>
                <th className="px-3 py-2 text-right font-medium">
                  <span className="flex items-center justify-end gap-1">
                    <Star className="h-3 w-3" /> Estrellas
                  </span>
                </th>
                <th className="px-3 py-2 text-right font-medium">
                  <span className="flex items-center justify-end gap-1">
                    <Users className="h-3 w-3" /> Reseñas
                  </span>
                </th>
                <th className="px-3 py-2 text-right font-medium">Órdenes</th>
                <th className="px-3 py-2 text-right font-medium">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/20 dark:divide-slate-700/20">
              {classified.slice(0, 20).map((v) => {
                const cfg = classConfig[v.category]
                return (
                  <tr key={v.id} className="text-slate-600 dark:text-slate-400">
                    <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">{v.name}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(v.revenue)}</td>
                    <td className="px-3 py-2 text-right">{renderStars(v.avgStars)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{v.totalReviews}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{v.orders}</td>
                    <td className="px-3 py-2 text-right">
                      <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${cfg.badge}`}>
                        <span className={`mr-1 h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {classified.length > 20 && (
          <p className="px-3 py-2 text-center text-[10px] text-slate-400 dark:text-slate-500">
            Mostrando 20 de {classified.length} vendedores
          </p>
        )}
      </div>
    </div>
  )
}
