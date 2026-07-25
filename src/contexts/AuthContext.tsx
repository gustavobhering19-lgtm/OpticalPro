import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

/* ── Tipos ── */
export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'operator' | 'viewer'
  company: string
  avatarInitials: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

/* ── Contexto ── */
const AuthContext = createContext<AuthContextValue | null>(null)

/* ── Mock user — remover quando o backend estiver pronto ── */
const MOCK_USER: AuthUser = {
  id: '1',
  name: 'Ana Beatriz',
  email: 'ana@opticalpro.com.br',
  role: 'admin',
  company: 'Ótica Visão Perfeita',
  avatarInitials: 'AB',
}

/* ── Credenciais de demo — remover quando o backend estiver pronto ── */
const DEMO_CREDENTIALS = {
  email: 'ana@opticalpro.com.br',
  password: '123456',
}

const STORAGE_KEY = 'optical_pro_auth'

/* ── Provider ── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as AuthUser) : null
    } catch {
      return null
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  /* 
   * LOGIN
   * Frontend only: valida contra credenciais mock.
   * Quando o backend estiver pronto, substituir por:
   *   const { data } = await api.post('/auth/login', { email, password })
   *   setUser(data.user)
   *   localStorage.setItem('optical_pro_token', data.token)
   */
  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true)

      // Simula latência de rede
      await new Promise((r) => setTimeout(r, 1000))

      if (
        email.toLowerCase().trim() === DEMO_CREDENTIALS.email &&
        password === DEMO_CREDENTIALS.password
      ) {
        setUser(MOCK_USER)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USER))
        setIsLoading(false)
        return { success: true }
      }

      setIsLoading(false)
      return {
        success: false,
        error: 'E-mail ou senha incorretos. Tente: ana@opticalpro.com.br / 123456',
      }
    },
    [],
  )

  /*
   * LOGOUT
   * Quando o backend estiver pronto, adicionar:
   *   await api.post('/auth/logout')
   *   localStorage.removeItem('optical_pro_token')
   */
  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/* ── Hook ── */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
