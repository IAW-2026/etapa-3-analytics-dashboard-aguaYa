import { sellerApi } from "@/lib/api"
import InventoryClient from "./inventory-client"

export const dynamic = "force-dynamic"

type InventoryItem = {
  id: string
  name: string
  isActive: boolean
  productCount: number
  inventoryValue: number
  totalRevenue: number
}

type InventoryResponse = {
  items: InventoryItem[]
  totals: {
    productCount: number
    inventoryValue: number
    totalRevenue: number
  }
}

export default async function InventoryPage() {
  let data: InventoryResponse | null = null
  let error: string | null = null

  try {
    data = (await sellerApi.get("/api/admin/vendors/inventory")) as InventoryResponse
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido"
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">
          Seller / Vendedores
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Inventario</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200/60 bg-white/80 px-5 py-4 text-sm text-red-700 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-red-800/60 dark:bg-slate-900/80 dark:text-red-400">
          {error}
        </div>
      )}

      {data && <InventoryClient data={data} />}
    </div>
  )
}
