"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"

const catsData: Record<string, any> = {
  rio: {
    nome: "Rio",
    idade: "2 anos",
    sexo: "macho",
    raca: "Frajola",
    temperamento: "docil",
    castrado: "sim",
    foto: "/gray-tabby-cat.jpg",
    vacinas: [
      { nome: "V4", data: "18/03/2024" },
      { nome: "Antirrábica", data: "23/01/2025" },
    ],
    historicoSaude: ["Tomou floral por 6 meses para ansiedade", "Já tratou pneumonia"],
    observacoes: ["Cuidado ao pegar na barriga"],
  },
  molta: {
    nome: "Molta",
    idade: "1 ano",
    sexo: "femea",
    raca: "SRD",
    temperamento: "docil",
    castrado: "sim",
    foto: "/black-and-white-cat.png",
    vacinas: [
      { nome: "V4", data: "15/02/2024" },
      { nome: "Antirrábica", data: "10/01/2025" },
    ],
    historicoSaude: ["Saudável"],
    observacoes: ["Muito ativa"],
  },
  mimo: {
    nome: "Mimo",
    idade: "3 anos",
    sexo: "macho",
    raca: "Persa",
    temperamento: "docil",
    castrado: "sim",
    foto: "/siamese-cat.png",
    vacinas: [
      { nome: "V4", data: "20/04/2024" },
      { nome: "Antirrábica", data: "15/02/2025" },
    ],
    historicoSaude: ["Problema respiratório tratado"],
    observacoes: ["Precisa de escovação diária"],
  },
  brownie: {
    nome: "Brownie",
    idade: "6 meses",
    sexo: "femea",
    raca: "SRD",
    temperamento: "docil",
    castrado: "nao",
    foto: "/brown-persian-cat.jpg",
    vacinas: [{ nome: "V4", data: "10/06/2024" }],
    historicoSaude: ["Filhote saudável"],
    observacoes: ["Ainda precisa castrar"],
  },
}

export default function EditarGatoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const catData = catsData[params.id.toLowerCase()] || catsData.rio

  const [adotado, setAdotado] = useState("nao")
  const [vacinas, setVacinas] = useState(catData.vacinas.map((v: any) => ({ nome: `${v.nome} - ${v.data}`, data: "" })))
  const [historicoSaude, setHistoricoSaude] = useState(catData.historicoSaude)
  const [observacoes, setObservacoes] = useState(catData.observacoes)

  const adicionarVacina = () => setVacinas([...vacinas, { nome: "", data: "" }])
  const removerVacina = (index: number) => setVacinas(vacinas.filter((_, i) => i !== index))

  const adicionarHistorico = () => setHistoricoSaude([...historicoSaude, ""])
  const removerHistorico = (index: number) => setHistoricoSaude(historicoSaude.filter((_, i) => i !== index))

  const adicionarObservacao = () => setObservacoes([...observacoes, ""])
  const removerObservacao = (index: number) => setObservacoes(observacoes.filter((_, i) => i !== index))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/gatos/${params.id}`)
  }

  return (
    <>
      <div className="min-h-screen pb-20 bg-background">
        <div className="max-w-md mx-auto">
          <PageHeader
            title="EDITAR GATO"
            leftButton={
              <Link href={`/gatos/${params.id}`}>
                <button className="w-10 h-10 bg-transparent hover:bg-muted rounded-full flex items-center justify-center transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Link>
            }
          />

          <div className="px-4 py-6">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-2 border-primary">
                      <img
                        src={catData.foto || "/placeholder.svg"}
                        alt={catData.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button type="button" className="bg-primary hover:bg-accent text-white rounded-full px-6 text-sm">
                      Modificar foto
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input id="nome" defaultValue={catData.nome} className="bg-secondary/50 border-border" required />
                  </div>

                  <div>
                    <Label htmlFor="idade">Idade</Label>
                    <Input id="idade" defaultValue={catData.idade} className="bg-secondary/50 border-border" required />
                  </div>

                  <div>
                    <Label htmlFor="sexo">Sexo</Label>
                    <Select defaultValue={catData.sexo}>
                      <SelectTrigger className="bg-secondary/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="macho">Macho</SelectItem>
                        <SelectItem value="femea">Fêmea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="raca">Raça</Label>
                    <Input id="raca" defaultValue={catData.raca} className="bg-secondary/50 border-border" required />
                  </div>

                  <div>
                    <Label htmlFor="temperamento">Temperamento</Label>
                    <Select defaultValue={catData.temperamento}>
                      <SelectTrigger className="bg-secondary/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="docil">Dócil</SelectItem>
                        <SelectItem value="nao-docil">Não dócil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="castrado">Castrado</Label>
                    <Select defaultValue={catData.castrado}>
                      <SelectTrigger className="bg-secondary/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Vacinas</Label>
                      <Button
                        type="button"
                        size="sm"
                        onClick={adicionarVacina}
                        className="bg-transparent hover:bg-muted text-foreground p-2 h-auto"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {vacinas.map((vacina, index) => (
                      <div key={index} className="flex gap-2 mb-2 items-center">
                        <div className="flex-1">
                          <Input
                            className="bg-secondary/50 border-border text-sm text-foreground placeholder:text-muted-foreground"
                            placeholder="Nome da vacina - Data de aplicação"
                            value={vacina.nome}
                            onChange={(e) => {
                              const novasVacinas = [...vacinas]
                              novasVacinas[index].nome = e.target.value
                              setVacinas(novasVacinas)
                            }}
                          />
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => removerVacina(index)}
                          className="bg-transparent hover:bg-muted text-foreground p-2 h-auto"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Histórico de saúde</Label>
                      <Button
                        type="button"
                        size="sm"
                        onClick={adicionarHistorico}
                        className="bg-transparent hover:bg-muted text-foreground p-2 h-auto"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {historicoSaude.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          className="bg-secondary/50 border-border text-sm text-foreground placeholder:text-muted-foreground"
                          placeholder="Adicionar registro de saúde"
                          value={item}
                          onChange={(e) => {
                            const novoHistorico = [...historicoSaude]
                            novoHistorico[index] = e.target.value
                            setHistoricoSaude(novoHistorico)
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => removerHistorico(index)}
                          className="bg-transparent hover:bg-muted text-foreground p-2 h-auto"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Observações</Label>
                      <Button
                        type="button"
                        size="sm"
                        onClick={adicionarObservacao}
                        className="bg-transparent hover:bg-muted text-foreground p-2 h-auto"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {observacoes.map((obs, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          className="bg-secondary/50 border-border text-sm text-foreground placeholder:text-muted-foreground"
                          placeholder="Adicionar observação"
                          value={obs}
                          onChange={(e) => {
                            const novasObs = [...observacoes]
                            novasObs[index] = e.target.value
                            setObservacoes(novasObs)
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => removerObservacao(index)}
                          className="bg-transparent hover:bg-muted text-foreground p-2 h-auto"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="adotado">Adotado</Label>
                    <Select value={adotado} onValueChange={setAdotado}>
                      <SelectTrigger className="bg-secondary/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {adotado === "sim" && (
                    <div className="space-y-4 p-4 bg-secondary/30 rounded-lg">
                      <h3 className="font-bold text-sm">ADOTANTE</h3>

                      <div>
                        <Label htmlFor="nomeAdotante" className="text-foreground">
                          Nome do adotante
                        </Label>
                        <Input
                          id="nomeAdotante"
                          placeholder="Digite o nome completo"
                          className="bg-card border-border"
                        />
                      </div>

                      <div>
                        <Label htmlFor="telefoneAdotante" className="text-foreground">
                          Telefone do adotante
                        </Label>
                        <Input id="telefoneAdotante" placeholder="(00) 00000-0000" className="bg-card border-border" />
                      </div>

                      <div>
                        <Label htmlFor="dataAdocao" className="text-foreground">
                          Data de adoção
                        </Label>
                        <Input id="dataAdocao" type="date" className="bg-card border-border" />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-border bg-transparent rounded-full"
                      onClick={() => router.push(`/gatos/${params.id}`)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1 bg-primary hover:bg-accent text-white rounded-full">
                      Salvar alterações
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
