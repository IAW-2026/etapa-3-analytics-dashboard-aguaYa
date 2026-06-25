const PAYMENT_APP_URL = process.env.PAYMENT_APP_URL!
const API_KEY = process.env.CONTROL_PLANE_API_KEY!

type RequestOptions = {
  method?: string
  body?: unknown
  params?: Record<string, string>
}

async function request(path: string, opts: RequestOptions = {}) {
  let url
  try {
    url = new URL(path, PAYMENT_APP_URL)
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
        Authorization: `Bearer ${API_KEY}`,
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      next: { revalidate: 0 },
    })
  } catch {
    throw new Error(`No se puede conectar con la app de pagos. Verificá que el servicio esté corriendo en ${PAYMENT_APP_URL}`)
  }

  const bodyText = await response.text()
  if (!response.ok) {
    throw new Error(`Error ${response.status} de la app de pagos: ${bodyText.slice(0, 200)}`)
  }

  try {
    return JSON.parse(bodyText)
  } catch {
    if (bodyText.startsWith("<!DOCTYPE") || bodyText.startsWith("<html")) {
      throw new Error(`No se puede conectar con la app de pagos. Verificá que el servicio esté corriendo en ${PAYMENT_APP_URL}`)
    }
    throw new Error(`Respuesta inválida de la app de pagos: ${bodyText.slice(0, 100)}`)
  }
}

export const paymentsApi = {
  get: (path: string, params?: Record<string, string>) =>
    request(path, { params }),

  patch: (path: string, body?: unknown) =>
    request(path, { method: "PATCH", body }),
}
