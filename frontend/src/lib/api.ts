const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://api.aicompass.co'

type ApiResponse<T> = {
  data?: T
  error?: string
}

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken')
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    return { error: payload.detail ?? payload.error ?? 'Request failed.' }
  }
  return { data: await response.json() }
}

export const apiClient = {
  get: async <T>(path: string): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<T>(response)
  },
  post: async <T>(path: string, body?: unknown): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: body ? JSON.stringify(body) : undefined,
    })
    return handleResponse<T>(response)
  },
  patch: async <T>(path: string, body?: unknown): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: body ? JSON.stringify(body) : undefined,
    })
    return handleResponse<T>(response)
  },
}
