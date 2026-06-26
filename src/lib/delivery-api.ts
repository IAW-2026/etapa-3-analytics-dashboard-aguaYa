const DELIVERY_APP_URL = process.env.DELIVERY_APP_URL!
const API_KEY = process.env.CONTROL_PLANE_API_KEY!

type RequestOptions = {
  method?: string
  body?: unknown
  params?: Record<string, string>
}

async function request(path: string, opts: RequestOptions = {}) {
  let url: URL
  try {
    url = new URL(path, DELIVERY_APP_URL)
  } catch {
    throw new Error(`Error interno: URL inválida (${path})`)
  }
  if (opts.params) {
    for (const [k, v] of Object.entries(opts.params)) {
      url.searchParams.set(k, v)
    }
  }

  let response
  try {
    response = await fetch(url.toString(), {
      method: opts.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,

      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      next: { revalidate: 0 },
    })
  } catch {
    throw new Error(
      `No se puede conectar con la app. Verificá que el servicio esté corriendo en ${DELIVERY_APP_URL}`
    )
  }

  const bodyText = await response.text()
  if (!response.ok) {
    throw new Error(`Error ${response.status} de la app [${path}]: ${bodyText.slice(0, 200)}`)
  }

  try {
    return JSON.parse(bodyText)
  } catch {
    if (bodyText.startsWith('<!DOCTYPE') || bodyText.startsWith('<html')) {
      throw new Error(
        `No se puede conectar con la app. Verificá que el servicio esté corriendo en ${DELIVERY_APP_URL}`
      )
    }
    throw new Error(`Respuesta inválida de la app: ${bodyText.slice(0, 100)}`)
  }
}

export const deliveryApi = {
  getStats: {
    orders: (params?: Record<string, string>) => request("/api/delivery/stats/orders", { params }),
    bidones: (params?: Record<string, string>) => request("/api/delivery/stats/bidones", { params }),
    zones: (params?: Record<string, string>) => request("/api/delivery/stats/zones", { params }),
    times: (params?: Record<string, string>) => request("/api/delivery/stats/times", { params }),
    drivers: (params?: Record<string, string>) => request("/api/delivery/stats/drivers", { params }),
    vehicles: (params?: Record<string, string>) => request("/api/delivery/stats/vehicles", { params }),
    requests: (params?: Record<string, string>) => request("/api/delivery/stats/requests", { params }),
    blocked: (params?: Record<string, string>) => request("/api/delivery/stats/blocked", { params }),
  },

  getCompanies: () => request("/api/delivery/companies"),

  getStatsByCompany: (params?: Record<string, string>) => request("/api/delivery/stats/by-company", { params }),

  getAdvanced: {
    dailyTrend: (params?: Record<string, string>) => request("/api/delivery/stats/daily-trend", { params }),
    driverRanking: (params?: Record<string, string>) => request("/api/delivery/stats/drivers/ranking", { params }),
    hourlyDistribution: (params?: Record<string, string>) => request("/api/delivery/stats/orders/hourly", { params }),
    comparison: (params?: Record<string, string>) => request("/api/delivery/stats/comparison", { params }),
  },
}