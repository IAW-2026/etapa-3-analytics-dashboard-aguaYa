import Link from "next/link"
import { cn } from "@/lib/utils"

type TabBarProps = {
  activeTab: "resenas" | "valoraciones"
  estrellas?: string
  vestrellas?: string
}

export function TabBar({ activeTab, estrellas, vestrellas }: TabBarProps) {
  const resenasHref = estrellas ? `/dashboard/feedback?estrellas=${estrellas}` : "/dashboard/feedback"
  const valoracionesHref = `/dashboard/feedback?tab=valoraciones${vestrellas ? `&vestrellas=${vestrellas}` : ""}`

  return (
    <div className="mb-6 flex gap-1 rounded-xl border border-white/30 bg-white/40 p-1 shadow-sm dark:border-slate-700/40 dark:bg-slate-900/40">
      <Link
        href={resenasHref}
        scroll={false}
        className={cn(
          "flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium transition-colors",
          activeTab === "resenas"
            ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        )}
      >
        Reseñas
      </Link>
      <Link
        href={valoracionesHref}
        scroll={false}
        className={cn(
          "flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium transition-colors",
          activeTab === "valoraciones"
            ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        )}
      >
        Valoraciones
      </Link>
    </div>
  )
}
