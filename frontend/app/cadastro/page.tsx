"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Cat, Mail, Lock, User, Phone, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authApi } from "@/lib/api/auth"
import Link from "next/link"

export default function CadastroPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Verificar se o usuário já está logado
  useEffect(() => {
    async function checkAuth() {
      const isAuth = await authApi.isAuthenticated()
      if (isAuth) {
        router.push("/escalas")
      }
    }
    checkAuth()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    // Validações
    if (!formData.nome || formData.nome.trim() === "") {
      setError("O nome é obrigatório")
      setLoading(false)
      return
    }

    if (!formData.telefone || formData.telefone.trim() === "") {
      setError("O telefone é obrigatório")
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setLoading(false)
      return
    }

    try {
      await authApi.signUp(formData.email, formData.password, {
        nome: formData.nome,
        telefone: formData.telefone
      })
      
      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err: any) {
      console.error("Erro ao cadastrar:", err)
      
      // Verificar se é erro de email já em uso
      if (err.message?.includes("User already registered") || 
          err.message?.includes("already registered") ||
          err.code === "user_already_exists") {
        setError("Este email já está cadastrado. Tente fazer login ou use outro email.")
      } else if (err.message?.includes("Email address is invalid")) {
        setError("Email inválido. Verifique se digitou corretamente.")
      } else if (err.message?.includes("Password")) {
        setError("Senha inválida. A senha deve ter pelo menos 6 caracteres.")
      } else {
        setError(err.message || "Erro ao criar conta. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8 bg-background">
      <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-lg">
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
            <Cat className="w-16 h-16 text-white" strokeWidth={2} />
          </div>

          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">Criar Conta</h1>
            <p className="text-muted-foreground text-sm mt-1">Junte-se ao Lar Temporário</p>
          </div>

          {error && (
            <Alert variant="destructive" className="w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="w-full border-green-500 bg-green-50 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Conta criada com sucesso! Redirecionando...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="space-y-1">
              <Label htmlFor="nome" className="text-sm">
                Nome completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                placeholder="Seu nome"
                value={formData.nome}
                onChange={handleChange}
                className="bg-muted border-border rounded-2xl py-6 px-4"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-muted border-border rounded-2xl py-6 px-4"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="telefone" className="text-sm">
                Telefone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="telefone"
                name="telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.telefone}
                onChange={handleChange}
                className="bg-muted border-border rounded-2xl py-6 px-4"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm">
                Senha <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                className="bg-muted border-border rounded-2xl py-6 px-4"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-sm">
                Confirmar senha <span className="text-destructive">*</span>
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-muted border-border rounded-2xl py-6 px-4"
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-accent text-white font-semibold py-6 rounded-full mt-2"
              disabled={loading || success}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Criando conta...
                </div>
              ) : (
                "Cadastrar"
              )}
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-muted-foreground hover:text-foreground text-sm">
                Já tem conta? Fazer login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
