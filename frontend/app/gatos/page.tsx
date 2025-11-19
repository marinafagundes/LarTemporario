"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { gatosApi } from "@/lib/api/gatos"
import { Plus } from "lucide-react"

type TabType = "todos" | "nao-doceis" | "adotados"

interface Gato {
  id: number
  nome: string | null
  data_nascimento: string | null
  sexo: string | null
  status: string | null
  foto: string | null
  observacao: string | null
}

export default function GatosPage() {
  const [activeTab, setActiveTab] = useState<TabType>("todos")
  const [gatos, setGatos] = useState<Gato[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGatos()
  }, [])

  const loadGatos = async () => {
    try {
      setLoading(true)
      const data = await gatosApi.getAll()
      setGatos(data)
    } catch (error) {
      console.error('Erro ao carregar gatos:', error)
    } finally {
      setLoading(false)
    }
  }

  const calcularIdade = (dataNascimento: string | null) => {
    if (!dataNascimento) return "Idade desconhecida"
    const hoje = new Date()
    const nascimento = new Date(dataNascimento)
    const diff = hoje.getTime() - nascimento.getTime()
    const anos = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
    const meses = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
    
    if (anos === 0) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`
    return `${anos} ${anos === 1 ? 'ano' : 'anos'}`
  }

  const filteredGatos = gatos.filter((gato) => {
    if (activeTab === "todos") return gato.status !== "Adotado"
    if (activeTab === "nao-doceis") return gato.status === "Não dócil"
    if (activeTab === "adotados") return gato.status === "Adotado"
    return false
  })

  if (loading) {
    return (
      <>
        <div className="min-h-screen pb-20 bg-background">
          <div className="max-w-5xl mx-auto">
            <PageHeader title="GATOS" />
            <div className="flex items-center justify-center py-20">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </div>
        </div>
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen pb-20 bg-background">
        <div className="max-w-5xl mx-auto">
          <PageHeader title="GATOS" />

          {/* Botão Adicionar Gato */}
          <div className="px-4 py-2">
            <Link href="/gatos/novo">
              <Button className="w-full bg-primary hover:bg-accent text-white rounded-full py-3 font-semibold flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Adicionar Gato
              </Button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-4 py-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("todos")}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === "todos" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary"
              }`}
            >
              TODOS
            </button>
            <button
              onClick={() => setActiveTab("nao-doceis")}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === "nao-doceis"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-secondary"
              }`}
            >
              NÃO DÓCEIS
            </button>
            <button
              onClick={() => setActiveTab("adotados")}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === "adotados" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary"
              }`}
            >
              ADOTADOS
            </button>
          </div>

          {/* Grid de gatos */}
          <div className="grid grid-cols-2 gap-4 px-4 pb-8">
            {filteredGatos.length === 0 ? (
              <div className="col-span-2 text-center py-10">
                <p className="text-muted-foreground">Nenhum gato encontrado</p>
              </div>
            ) : (
              filteredGatos.map((gato) => (
                <Link key={gato.id} href={`/gatos/${gato.id}`}>
                  <div className="bg-card rounded-3xl p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow border border-border">
                    <div className="w-28 h-28 rounded-full overflow-hidden bg-muted border-2 border-primary">
                      <img
                        src={gato.foto || "/placeholder.svg?height=112&width=112"}
                        alt={gato.nome || "Gato"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="text-center">
                      <h3 className="font-bold text-lg text-foreground">{gato.nome || "Sem nome"}</h3>
                      <p className="text-sm text-muted-foreground">{calcularIdade(gato.data_nascimento)}</p>
                      <p className="text-sm text-muted-foreground">{gato.sexo === 'M' ? 'Macho' : gato.sexo === 'F' ? 'Fêmea' : 'Indefinido'}</p>
                      <p className="text-sm text-muted-foreground">{gato.status || "Status desconhecido"}</p>
                    </div>

                    <Button className="w-full bg-primary hover:bg-accent text-white rounded-full py-2 text-sm mt-2">
                      Mais informações
                    </Button>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  )
}
