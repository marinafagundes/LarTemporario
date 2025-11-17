"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Pencil, Mail, Phone, Shield, AlertCircle, LogOut } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { authApi } from "@/lib/api/auth"
import { usuariosApi } from "@/lib/api/usuarios"
import { Database } from "@/lib/supabase"

type Usuario = Database['public']['Tables']['usuarios']['Row']

export default function PerfilPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true)
        setError("")
        
        // Verifica se está autenticado
        const isAuth = await authApi.isAuthenticated()
        if (!isAuth) {
          router.push("/login")
          return
        }

        // Busca dados do usuário
        const userData = await usuariosApi.getCurrent()
        setUsuario(userData)
      } catch (err: any) {
        console.error("Erro ao carregar dados do usuário:", err)
        setError("Erro ao carregar seus dados. Tente novamente.")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleLogout = async () => {
    try {
      await authApi.signOut()
      router.push("/login")
    } catch (err) {
      console.error("Erro ao fazer logout:", err)
    }
  }

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-background pb-20">
          <PageHeader title="PERFIL" />
          <div className="max-w-md mx-auto px-4 py-6 space-y-4">
            <div className="flex flex-col items-center gap-4 mb-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
        <BottomNav />
      </>
    )
  }

  if (error || !usuario) {
    return (
      <>
        <div className="min-h-screen bg-background pb-20">
          <PageHeader title="PERFIL" />
          <div className="max-w-md mx-auto px-4 py-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "Não foi possível carregar seus dados."}
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <BottomNav />
      </>
    )
  }

  const isLider = usuario.perfil === 'Lider'

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        <PageHeader title="PERFIL" />

        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          {/* Avatar e Nome */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full bg-muted border-2 border-primary flex items-center justify-center">
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">
                  {usuario.nome || "Sem nome"}
                </h2>
                <Link href="/perfil/editar">
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Informações Pessoais */}
          <Card className="border-border bg-card">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-muted-foreground">INFORMAÇÕES PESSOAIS</h3>
              
              <div className="space-y-3">
                {/* Nome */}
                <div className="flex items-start gap-3 bg-secondary/50 rounded-lg p-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Nome</p>
                    <p className="text-sm font-medium text-foreground">
                      {usuario.nome || "Não informado"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 bg-secondary/50 rounded-lg p-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm font-medium text-foreground">
                      {usuario.email || "Não informado"}
                    </p>
                  </div>
                </div>

                {/* Telefone */}
                {usuario.telefone && (
                  <div className="flex items-start gap-3 bg-secondary/50 rounded-lg p-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Telefone</p>
                      <p className="text-sm font-medium text-foreground">
                        {usuario.telefone}
                      </p>
                    </div>
                  </div>
                )}

                {/* Perfil/Cargo */}
                <div className="flex items-start gap-3 bg-secondary/50 rounded-lg p-3">
                  <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Cargo</p>
                    <p className="text-sm font-medium text-foreground">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isLider 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {usuario.perfil}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-start gap-3 bg-secondary/50 rounded-lg p-3">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="text-sm font-medium text-foreground">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        usuario.ativo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botão de Logout */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair da conta
          </Button>
        </div>
      </div>

      <BottomNav />
    </>
  )
}
