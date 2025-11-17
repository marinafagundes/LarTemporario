import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Rotas públicas que não precisam de autenticação
  const publicPaths = ['/login', '/cadastro']
  const { pathname } = request.nextUrl

  // Se está tentando acessar a raiz, redireciona para login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verifica se a rota é pública
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  // Por enquanto, apenas redireciona rotas públicas
  // A autenticação real será feita no cliente via AuthProvider
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
