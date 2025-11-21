'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authApi } from '@/lib/api/auth'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const isAuthenticated = await authApi.isAuthenticated()
        
        // Rotas públicas que não precisam de autenticação
        const publicRoutes = ['/login', '/cadastro']
        const isPublicRoute = publicRoutes.includes(pathname)

        if (!isAuthenticated && !isPublicRoute) {
          // Usuário não autenticado tentando acessar rota protegida
          router.push('/login')
        } else if (isAuthenticated && pathname === '/') {
          // Usuário autenticado na página inicial, redirecionar para escalas
          router.push('/escalas')
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
