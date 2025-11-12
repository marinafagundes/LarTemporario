"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Cat, X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"

export default function CadastrarGatoPage() {
  const router = useRouter()
  const [vacinas, setVacinas] = useState([{ nome: "", data: "" }])
  const [historicoSaude, setHistoricoSaude] = useState([""])
  const [observacoes, setObservacoes] = useState([""])

  const adicionarVacina = () => {
    setVacinas([...vacinas, { nome: "", data: "" }])
  }

  const removerVacina = (index: number) => {
    setVacinas(vacinas.filter((_, i) => i !== index))
  }

  const adicionarHistorico = () => {
    setHistoricoSaude([...historicoSaude, ""])
  }

  const removerHistorico = (index: number) => {
    setHistoricoSaude(historicoSaude.filter((_, i) => i !== index))
  }

  const adicionarObservacao = () => {
    setObservacoes([...observacoes, ""])
  }

  const removerObservacao = (index: number) => {
    setObservacoes(observacoes.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui salvaria no banco de dados
    router.push("/gatos")
  }

  return (
    <>
      <div className="min-h-screen pb-20 bg-background">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <header className="bg-card px-4 py-4 sm:px-6 flex items-center justify-between border-b border-border">
            <Link href="/gatos">
              <button className="w-10 h-10 bg-transparent hover:bg-muted rounded-full flex items-center justify-center transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Link>

            <h1 className="text-xl font-bold">CADASTRAR GATO</h1>

            <Link href="/escalas">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-accent transition-colors">
                <Cat className="w-6 h-6 text-white" />
              </div>
            </Link>
          </header>

          {/* Form */}
          <div className="px-4 py-6 sm:px-6">
            <Card className="border-border bg-card">
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Foto */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                      <Cat className="w-16 h-16 text-primary" />
                    </div>
                    <Button type="button" className="bg-primary hover:bg-accent text-white rounded-full px-6 text-sm">
                      Adicionar foto
                    </Button>
                  </div>

                  {/* Nome */}
                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      placeholder="Digite o nome do(a) gato(a)"
                      className="bg-secondary/50 border-border"
                      required
                    />
                  </div>

                  {/* Idade */}
                  <div>
                    <Label htmlFor="idade">Idade</Label>
                    <Input
                      id="idade"
                      placeholder="Digite a idade do(a) gato(a)"
                      className="bg-secondary/50 border-border"
                      required
                    />
                  </div>

                  {/* Sexo */}
                  <div>
                    <Label htmlFor="sexo">Sexo</Label>
                    <Select required>
                      <SelectTrigger className="bg-secondary/50 border-border">
                        <SelectValue placeholder="Selecione o sexo do(a) gato(a)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="macho">Macho</SelectItem>
                        <SelectItem value="femea">Fêmea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Raça */}
                  <div>
                    <Label htmlFor="raca">Raça</Label>
                    <Input
                      id="raca"
                      placeholder="Digite a cor do(a) gato(a)"
                      className="bg-secondary/50 border-border"
                      required
                    />
                  </div>

                  {/* Temperamento */}
                  <div>
                    <Label htmlFor="temperamento">Temperamento</Label>
                    <Select required>
                      <SelectTrigger className="bg-secondary/50 border-border">
                        <SelectValue placeholder="Selecione o temperamento do(a) gato(a)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="docil">Dócil</SelectItem>
                        <SelectItem value="nao-docil">Não dócil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Castrado */}
                  <div>
                    <Label htmlFor="castrado">Castrado</Label>
                    <Select required>
                      <SelectTrigger className="bg-secondary/50 border-border">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Vacinas */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Vacinas</Label>
                      <Button
                        type="button"
                        size="sm"
                        onClick={adicionarVacina}
                        className="bg-transparent hover:bg-muted text-primary p-2 h-auto"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {vacinas.map((vacina, index) => (
                      <div key={index} className="flex gap-2 mb-2 items-start">
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Ex.: V4 - 15/03/2024"
                            className="bg-secondary/50 border-border text-sm"
                            value={vacina.nome}
                            onChange={(e) => {
                              const novasVacinas = [...vacinas]
                              novasVacinas[index].nome = e.target.value
                              setVacinas(novasVacinas)
                            }}
                          />
                        </div>
                        {vacinas.length > 1 && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => removerVacina(index)}
                            className="bg-transparent hover:bg-muted text-primary p-2 h-auto"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Histórico de saúde */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Histórico de saúde</Label>
                      <Button
                        type="button"
                        size="sm"
                        onClick={adicionarHistorico}
                        className="bg-transparent hover:bg-muted text-primary p-2 h-auto"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {historicoSaude.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder="Digite aqui"
                          className="bg-secondary/50 border-border text-sm"
                          value={item}
                          onChange={(e) => {
                            const novoHistorico = [...historicoSaude]
                            novoHistorico[index] = e.target.value
                            setHistoricoSaude(novoHistorico)
                          }}
                        />
                        {historicoSaude.length > 1 && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => removerHistorico(index)}
                            className="bg-transparent hover:bg-muted text-primary p-2 h-auto"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Observações */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Observações</Label>
                      <Button
                        type="button"
                        size="sm"
                        onClick={adicionarObservacao}
                        className="bg-transparent hover:bg-muted text-primary p-2 h-auto"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {observacoes.map((obs, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder="Digite aqui"
                          className="bg-secondary/50 border-border text-sm"
                          value={obs}
                          onChange={(e) => {
                            const novasObs = [...observacoes]
                            novasObs[index] = e.target.value
                            setObservacoes(novasObs)
                          }}
                        />
                        {observacoes.length > 1 && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => removerObservacao(index)}
                            className="bg-transparent hover:bg-muted text-primary p-2 h-auto"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Adotado */}
                  <div>
                    <Label htmlFor="adotado">Adotado</Label>
                    <Select defaultValue="nao">
                      <SelectTrigger className="bg-secondary/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Botões */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-border bg-transparent rounded-full"
                      onClick={() => router.push("/gatos")}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1 bg-primary hover:bg-accent text-white rounded-full">
                      Cadastrar gato
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  )
}
