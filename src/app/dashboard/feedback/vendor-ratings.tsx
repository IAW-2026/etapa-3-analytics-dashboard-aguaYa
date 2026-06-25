import type { VendorRating } from "@/lib/types"
import { Star } from "lucide-react"

type VendorRatingsProps = {
  vendors: VendorRating[]
  title: string
  icon: React.ReactNode
  variant: "top" | "bottom"
}

export function VendorRatings({ vendors, title, icon, variant }: VendorRatingsProps) {
  return (
    <div className="rounded-xl border border-white/30 bg-linear-to-br from-white/30 to-slate-100/30 p-5 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>

      {vendors.length === 0 ? (
        <p className="py-4 text-center text-xs text-slate-500 dark:text-slate-400">Sin datos</p>
      ) : (
        <div className="space-y-2">
          {vendors.map((v, i) => (
            <div
              key={v.id_vendedor}
              className="flex items-center justify-between rounded-lg bg-white/40 px-3 py-2 dark:bg-slate-900/40"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
                    variant === "top"
                      ? "bg-emerald-500"
                      : "bg-red-500"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="max-w-35 truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                  {v.id_vendedor}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>{v.totalResenas} res.</span>
                <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                  <Star className="h-3 w-3 fill-current" />
                  {v.promedioEstrellas.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
