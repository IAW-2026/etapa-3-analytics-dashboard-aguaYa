"use client"

import { useState } from "react"
import { Info } from "lucide-react"

export function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false)

  return (
    <span className="relative inline-flex items-center">
      <Info
        className="h-3.5 w-3.5 cursor-help text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      {show && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs leading-relaxed text-white shadow-xl dark:bg-slate-100 dark:text-slate-900">
          {text}
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-100" />
        </span>
      )}
    </span>
  )
}
