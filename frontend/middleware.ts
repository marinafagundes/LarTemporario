import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Rotas públicas que não precisam de autenticação
  const publicPaths = ['/login', '/cadastro']
  const { pathname } = request.nextUrl

  // Se está tentando acessar a raiz, redireciona para login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verifica se a rota é pública
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  // Criar cliente Supabase para o middleware
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Se não está autenticado e tentando acessar rota protegida
  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se está autenticado e tentando acessar página de login/cadastro
  if (user && isPublicPath) {
    return NextResponse.redirect(new URL('/escalas', request.url))
  }

  return supabaseResponse
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
