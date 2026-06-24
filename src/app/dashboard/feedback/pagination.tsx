import Link from "next/link"

type PaginationProps = {
  currentPage: number
  totalPages: number
  baseUrl: string
  params?: Record<string, string | undefined>
}

export function Pagination({ currentPage, totalPages, baseUrl, params = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  const buildHref = (page: number) => {
    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value) searchParams.set(key, value)
    }
    searchParams.set("page", String(page))
    return `${baseUrl}?${searchParams.toString()}`
  }

  return (
    <div className="flex items-center justify-between border-t border-white/20 px-5 py-3 dark:border-slate-700/30">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Página {currentPage} de {totalPages}
      </p>
      <div className="flex gap-2">
        {currentPage > 1 && (
          <Link
            href={buildHref(currentPage - 1)}
            scroll={false}
            className="rounded-lg border border-white/30 bg-white/50 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-slate-300"
          >
            Anterior
          </Link>
        )}
        {currentPage < totalPages && (
          <Link
            href={buildHref(currentPage + 1)}
            scroll={false}
            className="rounded-lg border border-white/30 bg-white/50 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-slate-300"
          >
            Siguiente
          </Link>
        )}
      </div>
    </div>
  )
}
