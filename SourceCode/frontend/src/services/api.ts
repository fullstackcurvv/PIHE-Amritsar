import axios from 'axios'

const api = axios.create({
  baseURL:         import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,               // sends httpOnly refresh-token cookie
  headers: { 'Content-Type': 'application/json' },
})

// ── Request: attach access token from localStorage ──
api.interceptors.request.use(config => {
  try {
    const raw   = localStorage.getItem('iskcon-auth')
    const state = raw ? JSON.parse(raw) : null
    const token = state?.state?.accessToken
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch {
    // ignore parse errors
  }
  return config
})

// ── Response: silent token refresh on 401 ──────────
let isRefreshing = false
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token!))
  failedQueue = []
}

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    const isAuthEndpoint = original?.url?.includes('/auth/login') || original?.url?.includes('/auth/register')

    if (err.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const res   = await api.post('/auth/refresh')
        const token = res.data.data?.accessToken

        // Update stored token
        const raw   = localStorage.getItem('iskcon-auth')
        const state = raw ? JSON.parse(raw) : { state: {} }
        state.state.accessToken = token
        localStorage.setItem('iskcon-auth', JSON.stringify(state))

        processQueue(null, token)
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        localStorage.removeItem('iskcon-auth')
        window.location.href = '/login'
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(err)
  }
)

export default api
