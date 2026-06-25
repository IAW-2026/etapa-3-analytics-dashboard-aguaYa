'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import type { Valoracion } from "@/lib/types"
import { Star } from "lucide-react"
import { Pagination } from "./pagination"

type ValoracionesTableProps = {
  valoraciones: Valoracion[]
  total: number
  totalPages: number
  currentPage: number
}

export function ValoracionesTable({ valoraciones, total, totalPages, currentPage }: ValoracionesTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const estrellasFilter = searchParams.get("vestrellas")

  const handleFilterChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("tab", "valoraciones")
      if (value) {
        params.set("vestrellas", value)
      } else {
        params.delete("vestrellas")
      }
      params.delete("vpage")
      router.push(`/dashboard/feedback?${params.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  return (
    <div className="rounded-xl border border-white/30 bg-linear-to-br from-white/30 to-slate-100/30 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 px-5 py-4 dark:border-slate-700/30">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Valoraciones ({total})
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

      <div className="hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20 text-left text-xs font-medium text-slate-500 dark:border-slate-700/30 dark:text-slate-400">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Usuario</th>
                <th className="px-5 py-3 text-center">Estrellas</th>
                <th className="px-5 py-3">Comentario</th>
                <th className="px-5 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {valoraciones.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                    No se encontraron valoraciones.
                  </td>
                </tr>
              )}
              {valoraciones.map((v) => (
                <tr
                  key={v.id_valoracion}
                  className="border-b border-white/20 transition-colors hover:bg-white/20 dark:border-slate-700/30 dark:hover:bg-white/5"
                >
                  <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">
                    #{v.id_valoracion}
                  </td>
                  <td className="max-w-30 truncate px-5 py-3 text-slate-600 dark:text-slate-400">
                    {v.id_usuario}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="flex items-center justify-center gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < v.estrellas
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      ))}
                    </span>
                  </td>
                  <td className="max-w-50 truncate px-5 py-3 text-slate-600 dark:text-slate-400">
                    {v.comentario ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-slate-600 dark:text-slate-400">
                    {new Date(v.fecha).toLocaleDateString("es-AR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 px-5 py-4 sm:hidden">
        {valoraciones.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">No se encontraron valoraciones.</p>
        )}
        {valoraciones.map((v) => (
          <div
            key={v.id_valoracion}
            className="rounded-xl border border-white/30 bg-white/40 p-4 shadow-sm dark:border-slate-700/40 dark:bg-slate-900/40"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                #{v.id_valoracion}
              </span>
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < v.estrellas
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                ))}
              </span>
            </div>
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <p><span className="font-medium text-slate-500 dark:text-slate-500">Usuario:</span> {v.id_usuario}</p>
              <p className="line-clamp-2"><span className="font-medium text-slate-500 dark:text-slate-500">Comentario:</span> {v.comentario ?? "—"}</p>
              <p><span className="font-medium text-slate-500 dark:text-slate-500">Fecha:</span> {new Date(v.fecha).toLocaleDateString("es-AR")}</p>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/dashboard/feedback"
        params={{ tab: "valoraciones", vestrellas: estrellasFilter ?? undefined }}
      />
    </div>
  )
}
