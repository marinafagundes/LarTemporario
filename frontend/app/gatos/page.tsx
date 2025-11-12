"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"

type TabType = "todos" | "nao-doceis" | "adotados"

const gatos = [
  {
    id: 1,
    nome: "Rio",
    idade: "2 anos",
    sexo: "Macho",
    raca: "Frajola",
    temperamento: "Dócil",
    castrado: true,
    adotado: false,
    imagem: "/gray-tabby-cat.jpg",
  },
  {
    id: 2,
    nome: "Molta",
    idade: "2 anos",
    sexo: "Fêmea",
    raca: "Frajola",
    temperamento: "Dócil",
    castrado: true,
    adotado: false,
    imagem: "/black-white-cat.jpg",
  },
  {
    id: 3,
    nome: "Brownie",
    idade: "2 anos",
    sexo: "Macho",
    raca: "Persa",
    temperamento: "Não dócil",
    castrado: true,
    adotado: false,
    imagem: "/brown-persian-cat.jpg",
  },
  {
    id: 4,
    nome: "Caramelo",
    idade: "1 ano",
    sexo: "Macho",
    raca: "Amarelo",
    temperamento: "Não dócil",
    castrado: true,
    adotado: false,
    imagem: "/orange-tabby-cat.png",
  },
  {
    id: 5,
    nome: "Mimo",
    idade: "3 anos",
    sexo: "Fêmea",
    raca: "Siamês",
    temperamento: "Dócil",
    castrado: true,
    adotado: true,
    adotante: {
      nome: "João Souza",
      telefone: "(16) XXXXX-XXXX",
      dataAdocao: "10/10/2025",
    },
    imagem: "/siamese-cat.png",
  },
]

export default function GatosPage() {
  const [activeTab, setActiveTab] = useState<TabType>("todos")

  const filteredGatos = gatos.filter((gato) => {
    if (activeTab === "todos") return !gato.adotado
    if (activeTab === "nao-doceis") return !gato.adotado && gato.temperamento === "Não dócil"
    if (activeTab === "adotados") return gato.adotado
    return false
  })

  return (
    <>
      <div className="min-h-screen pb-20 bg-background">
        <div className="max-w-5xl mx-auto">
          <PageHeader title="GATOS" />

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
            {filteredGatos.map((gato) => (
              <Link key={gato.id} href={`/gatos/${gato.id}`}>
                <div className="bg-card rounded-3xl p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow border border-border">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-muted border-2 border-primary">
                    <img
                      src={gato.imagem || "/placeholder.svg?height=112&width=112"}
                      alt={gato.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="text-center">
                    <h3 className="font-bold text-lg text-foreground">{gato.nome}</h3>
                    <p className="text-sm text-muted-foreground">{gato.idade}</p>
                    <p className="text-sm text-muted-foreground">{gato.sexo}</p>
                    <p className="text-sm text-muted-foreground">{gato.raca}</p>
                    <p className="text-sm text-muted-foreground">{gato.temperamento}</p>
                  </div>

                  <Button className="w-full bg-primary hover:bg-accent text-white rounded-full py-2 text-sm mt-2">
                    Mais informações
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  )
}
