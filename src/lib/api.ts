type RequestOptions = {
  method?: string
  body?: unknown
  params?: Record<string, string>
}

function createApiClient(baseUrl: string, apiKey: string) {
  async function request(path: string, opts: RequestOptions = {}) {
    let url
    try {
      url = new URL(path, baseUrl)
    } catch {
      throw new Error(`Error interno: URL inválida (${path})`)
    }
    if (opts.params) {
      for (const [key, value] of Object.entries(opts.params)) {
        url.searchParams.set(key, value)
      }
    }

    let response
    try {
      response = await fetch(url.toString(), {
        method: opts.method ?? "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        next: { revalidate: 0 },
      })
    } catch {
      throw new Error(`No se puede conectar con la app. Verificá que el servicio esté corriendo en ${baseUrl}`)
    }

    const bodyText = await response.text()
    if (!response.ok) {
      throw new Error(`Error ${response.status} de la app: ${bodyText.slice(0, 200)}`)
    }

    try {
      return JSON.parse(bodyText)
    } catch {
      if (bodyText.startsWith('<!DOCTYPE') || bodyText.startsWith('<html')) {
        throw new Error(`No se puede conectar con la app. Verificá que el servicio esté corriendo en ${baseUrl}`)
      }
      throw new Error(`Respuesta inválida de la app: ${bodyText.slice(0, 100)}`)
    }
  }

  return {
    get: (path: string, params?: Record<string, string>) =>
      request(path, { params }),

    post: (path: string, body: unknown) =>
      request(path, { method: "POST", body }),

    put: (path: string, body: unknown) =>
      request(path, { method: "PUT", body }),

    patch: (path: string, body?: unknown) =>
      request(path, { method: "PATCH", body }),

    delete: (path: string) =>
      request(path, { method: "DELETE" }),
  }
}

const SELLER_APP_URL = process.env.SELLER_APP_URL!
const CONTROL_PLANE_API_KEY = process.env.CONTROL_PLANE_API_KEY!
const FEEDBACK_APP_URL = process.env.FEEDBACK_APP_URL!
const FEEDBACK_API_KEY = process.env.FEEDBACK_API_KEY!

export const sellerApi = createApiClient(SELLER_APP_URL, CONTROL_PLANE_API_KEY)
export const feedbackApi = createApiClient(FEEDBACK_APP_URL, FEEDBACK_API_KEY)
