"use client"

/**
 * Componente de Navegação Inferior (Bottom Navigation)
 *
 * Barra de navegação fixa na parte inferior da tela para dispositivos móveis.
 * Sempre visível em todas as páginas principais do aplicativo.
 *
 * Links disponíveis:
 * - Escalas: Gerenciamento de turnos e eventos
 * - Gatos: Listagem e cadastro de gatos
 * - Notificações: Alertas e lembretes
 * - Perfil: Informações e configurações do usuário
 *
 * Design features:
 * - Ícones destacados quando a rota está ativa
 * - Fundo laranja (#CC5804) para alta visibilidade
 * - Suporte a safe area para dispositivos com notch
 *
 * @component
 */

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Cat, Calendar, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const links = [
    { href: "/escalas", label: "Escalas", icon: Calendar },
    { href: "/gatos", label: "Gatos", icon: Cat },
    { href: "/notificacoes", label: "Notificações", icon: Bell },
    { href: "/perfil", label: "Perfil", icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#CC5804] z-50 safe-area-bottom">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-around h-16 px-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors rounded-lg",
                  isActive ? "text-black" : "text-black/60",
                )}
              >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
