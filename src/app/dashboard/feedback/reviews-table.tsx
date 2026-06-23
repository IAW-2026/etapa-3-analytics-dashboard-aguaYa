'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import type { Review } from "@/lib/types"
import { Star } from "lucide-react"
import { Pagination } from "./pagination"

type ReviewsTableProps = {
  reviews: Review[]
  total: number
  totalPages: number
  currentPage: number
}

export function ReviewsTable({ reviews, total, totalPages, currentPage }: ReviewsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const estrellasFilter = searchParams.get("estrellas")

  const handleFilterChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set("estrellas", value)
      } else {
        params.delete("estrellas")
      }
      params.delete("page")
      router.push(`/dashboard/feedback?${params.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  return (
    <div className="rounded-xl border border-white/30 bg-linear-to-br from-white/30 to-slate-100/30 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 px-5 py-4 dark:border-slate-700/30">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Reseñas ({total})
        </h2>

        <div className="flex items-center gap-2">
          <select
            value={estrellasFilter ?? ""}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="rounded-lg border border-white/30 bg-white/50 px-3 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/40 dark:bg-slate-900/50 dark:text-slate-300"
          >
            <option value="">Todas las estrellas</option>
            <option value="5">5 estrellas</option>
            <option value="4">4 estrellas</option>
            <option value="3">3 estrellas</option>
            <option value="2">2 estrellas</option>
            <option value="1">1 estrella</option>
          </select>
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/dashboard/feedback"
        params={{ estrellas: estrellasFilter ?? undefined }}
      />
    </div>
  )
}
