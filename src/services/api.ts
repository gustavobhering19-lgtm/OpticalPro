import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/* ── Request interceptor: injeta token de autenticação ── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('optical_pro_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

/* ── Response interceptor: trata erros globalmente ── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('optical_pro_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
