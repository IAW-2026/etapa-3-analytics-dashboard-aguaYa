"use client"

import { useEffect } from "react"

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DeliveryError({ error, reset }: Props) {
  useEffect(() => {
    console.error("Delivery Dashboard Error:", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="rounded-xl border border-red-200/60 bg-gradient-to-br from-red-50/50 to-white/30 p-8 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-red-800/40 dark:from-red-900/20 dark:to-slate-900/40">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
          Error al cargar el Dashboard
        </h2>
        <p className="mb-6 max-w-md text-sm text-slate-500 dark:text-slate-400">
          No se pudieron obtener las métricas de Delivery. Verificá que la Delivery App esté funcionando y que las variables de entorno estén configuradas correctamente.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
