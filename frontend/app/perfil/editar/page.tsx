"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Cat, User, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { authApi } from "@/lib/api/auth"
import { usuariosApi } from "@/lib/api/usuarios"
import { Database } from "@/lib/supabase"

type Usuario = Database['public']['Tables']['usuarios']['Row']

export default function EditarPerfilPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: ""
  })

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true)
        setError("")
        
        // Busca dados do usuário
        const userData = await usuariosApi.getCurrent()
        setUsuario(userData)
        
        // Preenche o formulário
        setFormData({
          nome: userData.nome || "",
          telefone: userData.telefone || "",
          email: userData.email || "",
          senhaAtual: "",
          novaSenha: "",
          confirmarSenha: ""
        })
      } catch (err: any) {
        console.error("Erro ao carregar dados do usuário:", err)
        setError("Erro ao carregar seus dados. Tente novamente.")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!usuario) return
    
    setSaving(true)
    setError("")
    setSuccess(false)

    try {
      // Validações
      if (!formData.nome || formData.nome.trim() === "") {
        setError("O nome é obrigatório")
        setSaving(false)
        return
      }

      if (!formData.telefone || formData.telefone.trim() === "") {
        setError("O telefone é obrigatório")
        setSaving(false)
        return
      }

      // Validação de senha (se fornecida)
      if (formData.novaSenha || formData.confirmarSenha || formData.senhaAtual) {
        if (!formData.senhaAtual) {
          setError("Digite sua senha atual para alterar a senha")
          setSaving(false)
          return
        }

        if (!formData.novaSenha) {
          setError("Digite a nova senha")
          setSaving(false)
          return
        }

        if (formData.novaSenha.length < 6) {
          setError("A nova senha deve ter pelo menos 6 caracteres")
          setSaving(false)
          return
        }

        if (formData.novaSenha !== formData.confirmarSenha) {
          setError("As senhas não coincidem")
          setSaving(false)
          return
        }
      }

      // Atualiza os dados do usuário
      await usuariosApi.update(usuario.id, {
        nome: formData.nome,
        telefone: formData.telefone
      })

      // Se o email mudou, atualiza também
      if (formData.email !== usuario.email && formData.email.trim() !== "") {
        await authApi.updateEmail(formData.email)
      }

      // Se forneceu nova senha, atualiza
      if (formData.novaSenha) {
        await authApi.updatePassword(formData.novaSenha)
      }

      setSuccess(true)
      
      // Redireciona após 1.5 segundos
      setTimeout(() => {
        router.push("/perfil")
      }, 1500)
    } catch (err: any) {
      console.error("Erro ao atualizar perfil:", err)
      setError(err.message || "Erro ao atualizar perfil. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        <PageHeader
          title="EDITAR PERFIL"
          leftButton={
            <Link href="/perfil">
              <button className="w-10 h-10 bg-transparent hover:bg-muted rounded-full flex items-center justify-center transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Link>
          }
        />

        <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-500 bg-green-50 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Perfil atualizado com sucesso! Redirecionando...
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <Card className="border-border bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <Skeleton className="w-24 h-24 rounded-full" />
                  <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="w-24 h-24 rounded-full bg-muted border-2 border-primary flex items-center justify-center">
                  <User className="w-12 h-12 text-muted-foreground" />
                </div>
                {/* Funcionalidade de upload de foto pode ser implementada depois */}
                {/* <Button className="bg-primary hover:bg-accent text-white rounded-full px-6 text-sm">
                  Modificar foto
                </Button> */}
              </div>

              <Card className="border-border bg-card">
                <CardContent className="p-4 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="nome">
                        Nome completo <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="nome"
                        name="nome"
                        type="text"
                        value={formData.nome}
                        onChange={handleChange}
                        className="bg-muted border-border"
                        placeholder="Seu nome completo"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <Label htmlFor="telefone">
                        Telefone <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        type="tel"
                        value={formData.telefone}
                        onChange={handleChange}
                        className="bg-muted border-border"
                        placeholder="(11) 99999-9999"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-muted border-border"
                        placeholder="seu@email.com"
                        disabled={saving}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Alterar o email pode exigir confirmação
                      </p>
                    </div>

                    <div>
                      <Label>Perfil</Label>
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-sm text-foreground font-medium">
                          {usuario?.perfil === "Lider" ? "Líder" : "Voluntário"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          O perfil não pode ser alterado
                        </p>
                      </div>
                    </div>

                    {/* Seção de Alteração de Senha */}
                    <div className="pt-4 border-t border-border">
                      <h3 className="text-sm font-semibold mb-3">Alterar Senha (opcional)</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="senhaAtual">Senha Atual</Label>
                          <Input
                            id="senhaAtual"
                            name="senhaAtual"
                            type="password"
                            value={formData.senhaAtual}
                            onChange={handleChange}
                            className="bg-muted border-border"
                            placeholder="Digite sua senha atual"
                            disabled={saving}
                          />
                        </div>

                        <div>
                          <Label htmlFor="novaSenha">Nova Senha</Label>
                          <Input
                            id="novaSenha"
                            name="novaSenha"
                            type="password"
                            value={formData.novaSenha}
                            onChange={handleChange}
                            className="bg-muted border-border"
                            placeholder="Mínimo 6 caracteres"
                            disabled={saving}
                          />
                        </div>

                        <div>
                          <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                          <Input
                            id="confirmarSenha"
                            name="confirmarSenha"
                            type="password"
                            value={formData.confirmarSenha}
                            onChange={handleChange}
                            className="bg-muted border-border"
                            placeholder="Digite a nova senha novamente"
                            disabled={saving}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 border-border bg-transparent rounded-full"
                        onClick={() => router.push("/perfil")}
                        disabled={saving}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-primary hover:bg-accent text-white rounded-full"
                        disabled={saving || success}
                      >
                        {saving ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Salvando...
                          </div>
                        ) : (
                          "Salvar alterações"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      <BottomNav />
    </>
  )
}
