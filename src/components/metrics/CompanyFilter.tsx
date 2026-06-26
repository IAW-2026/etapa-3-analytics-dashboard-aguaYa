"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"
import { Building2 } from "lucide-react"
import type { Company } from "@/lib/delivery-types"

type Props = {
  companies: Company[]
}

export default function CompanyFilter({ companies }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const companyId = searchParams.get("companyId") || ""

  const setCompany = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (id) params.set("companyId", id)
      else params.delete("companyId")
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
      <select
        value={companyId}
        onChange={(e) => setCompany(e.target.value)}
        className="max-w-[220px] rounded-lg border border-white/30 bg-white/40 px-3 py-1.5 text-sm text-slate-900 backdrop-blur-xl transition-colors focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20 dark:border-slate-700/40 dark:bg-slate-800/40 dark:text-slate-100"
      >
        <option value="">Todas las empresas</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  )
}
