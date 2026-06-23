'use client'

import type { Review } from "@/lib/types"
import { Star, Search } from "lucide-react"
import Link from "next/link"

type ReviewsTableProps = {
  reviews: Review[]
  total: number
  totalPages: number
  currentPage: number
  estrellasFilter: string | null
}

export function ReviewsTable({ reviews, total, totalPages, currentPage, estrellasFilter }: ReviewsTableProps) {
  const baseUrl = "/dashboard/feedback"

  return (
    <div className="rounded-xl border border-white/30 bg-linear-to-br from-white/30 to-slate-100/30 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 px-5 py-4 dark:border-slate-700/30">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Reseñas ({total})
        </h2>

        <div className="flex items-center gap-2">
          <form method="GET" action={baseUrl} className="flex items-center gap-2">
            <select
              name="estrellas"
              defaultValue={estrellasFilter ?? ""}
              onChange={(e) => e.target.form?.submit()}
              className="rounded-lg border border-white/30 bg-white/50 px-3 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-slate-300"
            >
              <option value="">Todas las estrellas</option>
              <option value="5">5 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="2">2 estrellas</option>
              <option value="1">1 estrella</option>
            </select>
          </form>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/20 text-left text-xs font-medium text-slate-500 dark:border-slate-700/30 dark:text-slate-400">
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Pedido</th>
              <th className="px-5 py-3">Vendedor</th>
              <th className="px-5 py-3 text-center">Estrellas</th>
              <th className="px-5 py-3">Comentario</th>
              <th className="px-5 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">
                  No se encontraron reseñas.
                </td>
              </tr>
            )}
            {reviews.map((review) => (
              <tr
                key={review.id_resena}
                className="border-b border-white/20 transition-colors hover:bg-white/20 dark:border-slate-700/30 dark:hover:bg-white/5"
              >
                <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">
                  #{review.id_resena}
                </td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-400">
                  {review.id_pedido}
                </td>
                <td className="max-w-30 truncate px-5 py-3 text-slate-600 dark:text-slate-400">
                  {review.id_vendedor}
                </td>
                <td className="px-5 py-3 text-center">
                  <span className="flex items-center justify-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < review.estrellas
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-slate-600"
                        }`}
                      />
                    ))}
                  </span>
                </td>
                <td className="max-w-50 truncate px-5 py-3 text-slate-600 dark:text-slate-400">
                  {review.comentario ?? "—"}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-slate-600 dark:text-slate-400">
                  {new Date(review.fecha).toLocaleDateString("es-AR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/20 px-5 py-3 dark:border-slate-700/30">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`${baseUrl}?${new URLSearchParams({
                  ...(estrellasFilter && { estrellas: estrellasFilter }),
                  page: String(currentPage - 1),
                }).toString()}`}
                className="rounded-lg border border-white/30 bg-white/50 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-slate-300"
              >
                Anterior
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`${baseUrl}?${new URLSearchParams({
                  ...(estrellasFilter && { estrellas: estrellasFilter }),
                  page: String(currentPage + 1),
                }).toString()}`}
                className="rounded-lg border border-white/30 bg-white/50 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-slate-300"
              >
                Siguiente
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
