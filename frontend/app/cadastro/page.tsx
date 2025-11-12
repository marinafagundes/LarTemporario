"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Cat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function CadastroPage() {
  const router = useRouter()
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [senha, setSenha] = useState("")

  const handleCadastro = () => {
    router.push("/escalas")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8 bg-background">
      <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-lg">
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
            <Cat className="w-16 h-16 text-white" strokeWidth={2} />
          </div>

          <h1 className="text-xl font-bold text-center text-foreground">Criar Conta</h1>

          <div className="w-full flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="bg-muted border-border rounded-2xl py-6 px-4"
            />

            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted border-border rounded-2xl py-6 px-4"
            />

            <Input
              type="tel"
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="bg-muted border-border rounded-2xl py-6 px-4"
            />

            <Input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="bg-muted border-border rounded-2xl py-6 px-4"
            />

            <Button
              onClick={handleCadastro}
              className="w-full bg-primary hover:bg-accent text-white font-semibold py-6 rounded-full mt-2"
            >
              Cadastrar
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-muted-foreground hover:text-foreground text-sm">
                Já tem conta? Fazer login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
