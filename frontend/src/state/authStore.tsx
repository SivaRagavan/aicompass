import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiClient } from '@/lib/api'

type User = {
  id: string
  email: string
}

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<string | null>
  register: (email: string, password: string) => Promise<string | null>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = async () => {
    setIsLoading(true)
    const response = await apiClient.get<User | null>('/api/auth/me')
    if (response.data !== undefined) {
      setUser(response.data)
    }
    setIsLoading(false)
  }

  const login = async (email: string, password: string) => {
    const response = await apiClient.post<{ user: User; token: string }>(
      '/api/auth/login',
      { email, password },
    )
    if (response.error) return response.error
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token)
    }
    await refresh()
    return null
  }

  const register = async (email: string, password: string) => {
    const response = await apiClient.post<{ user: User; token: string }>(
      '/api/auth/register',
      { email, password },
    )
    if (response.error) return response.error
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token)
    }
    await refresh()
    return null
  }

  const logout = async () => {
    localStorage.removeItem('authToken')
    setUser(null)
  }

  useEffect(() => {
    void refresh()
  }, [])

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, refresh }),
    [user, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
