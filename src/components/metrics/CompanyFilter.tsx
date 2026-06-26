"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback, useState, useRef, useEffect, useMemo } from "react"
import { Search, X } from "lucide-react"
import type { Company } from "@/lib/delivery-types"

type Props = {
  companies: Company[]
}

export default function CompanyFilter({ companies }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const companyId = searchParams.get("companyId") || ""

  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = useMemo(
    () => companies.find((c) => c.id === companyId),
    [companies, companyId],
  )

  const filtered = useMemo(
    () =>
      query.trim()
        ? companies.filter((c) =>
            c.name.toLowerCase().includes(query.toLowerCase()),
          )
        : companies,
    [companies, query],
  )

  const setCompany = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (id) params.set("companyId", id)
      else params.delete("companyId")
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative min-w-[260px] max-w-[260px]">
      {selected ? (
        <div className="flex w-full items-center gap-1.5 rounded-lg border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 py-1.5 pl-9 pr-3 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
          <span className="flex-1 truncate text-sm font-medium text-slate-900 dark:text-slate-100">
            {selected.name}
          </span>
          <button
            type="button"
            onClick={() => { setCompany(""); setQuery("") }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/50 hover:text-slate-600 dark:hover:bg-slate-700/50 dark:hover:text-slate-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            placeholder="Buscar empresa…"
            className="w-full rounded-lg border border-white/30 bg-white/40 py-1.5 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 backdrop-blur-xl transition-colors focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20 dark:border-slate-700/40 dark:bg-slate-800/40 dark:text-slate-100 dark:placeholder-slate-500"
          />
        </div>
      )}

      {open && !selected && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-lg border border-white/30 bg-white/90 shadow-xl shadow-black/10 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/90">
          {filtered.length === 0 && (
            <p className="px-3 py-4 text-center text-sm text-slate-400 dark:text-slate-500">
              Sin resultados
            </p>
          )}
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => { setCompany(c.id); setOpen(false); setQuery("") }}
              className="w-full px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-sky-50 dark:text-slate-300 dark:hover:bg-sky-900/30"
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
