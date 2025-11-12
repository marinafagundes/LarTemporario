"use client"

import Link from "next/link"
import { Cat, ArrowLeft, Pencil } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"

const gatosData = {
  "1": {
    nome: "Rio",
    imagem: "/gray-tabby-cat.jpg",
    idade: "2 anos",
    sexo: "Macho",
    raca: "Frajola",
    temperamento: "Dócil",
    castrado: "Sim",
    vacinas: [
      { nome: "V4", data: "18/03/2024" },
      { nome: "Antirrábica", data: "23/01/2025" },
    ],
    historicoSaude: ["Tomou floral por 6 meses para ansiedade", "Já tratou pneumonia"],
    observacoes: "Cuidado ao pegar na barriga",
    adotado: false,
  },
  "2": {
    nome: "Molta",
    imagem: "/black-white-cat.jpg",
    idade: "2 anos",
    sexo: "Fêmea",
    raca: "Frajola",
    temperamento: "Dócil",
    castrado: "Sim",
    vacinas: [
      { nome: "V4", data: "15/03/2024" },
      { nome: "Antirrábica", data: "20/01/2025" },
    ],
    historicoSaude: ["Saudável"],
    observacoes: "Muito carinhosa",
    adotado: false,
  },
  "3": {
    nome: "Brownie",
    imagem: "/brown-persian-cat.jpg",
    idade: "2 anos",
    sexo: "Macho",
    raca: "Persa",
    temperamento: "Não dócil",
    castrado: "Sim",
    vacinas: [
      { nome: "V4", data: "10/02/2024" },
      { nome: "Antirrábica", data: "15/01/2025" },
    ],
    historicoSaude: ["Saudável"],
    observacoes: "Não gosta de ser pego",
    adotado: false,
  },
  "4": {
    nome: "Caramelo",
    imagem: "/orange-tabby-cat.png",
    idade: "1 ano",
    sexo: "Macho",
    raca: "Amarelo",
    temperamento: "Não dócil",
    castrado: "Sim",
    vacinas: [{ nome: "V4", data: "20/05/2024" }],
    historicoSaude: ["Saudável"],
    observacoes: "Muito ativo",
    adotado: false,
  },
  "5": {
    nome: "Mimo",
    imagem: "/siamese-cat.png",
    idade: "3 anos",
    sexo: "Fêmea",
    raca: "Siamês",
    temperamento: "Dócil",
    castrado: "Sim",
    vacinas: [
      { nome: "V4", data: "15/03/2024" },
      { nome: "Antirrábica", data: "20/01/2025" },
    ],
    historicoSaude: ["Saudável"],
    observacoes: "Muito carinhosa",
    adotado: true,
    adotante: {
      nome: "João Souza",
      telefone: "(16) XXXXX-XXXX",
      dataAdocao: "10/10/2025",
    },
  },
}

export default function GatoPerfilPage({ params }: { params: { id: string } }) {
  const gatoData = gatosData[params.id as keyof typeof gatosData] || gatosData["1"]

  return (
    <>
      <div className="min-h-screen pb-20 bg-background">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <header className="bg-card px-4 py-4 flex items-center justify-between border-b border-border">
            <Link href="/gatos">
              <button className="w-10 h-10 bg-transparent hover:bg-muted rounded-full flex items-center justify-center transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>

            <h1 className="text-xl font-bold">GATOS</h1>

            <Link href="/escalas">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-accent transition-colors">
                <Cat className="w-6 h-6 text-white" />
              </div>
            </Link>
          </header>

          {/* Perfil do gato */}
          <div className="px-4 py-6">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                {/* Foto e nome */}
                <div className="flex flex-col items-center gap-3 mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-2 border-primary">
                    <img
                      src={gatoData.imagem || "/placeholder.svg?height=128&width=128"}
                      alt={gatoData.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{gatoData.nome}</h2>
                    <Link href={`/gatos/${params.id}/editar`}>
                      <button className="text-muted-foreground hover:text-primary transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Informações */}
                <div className="space-y-4">
                  <div className="bg-secondary/50 rounded-2xl p-4">
                    <h3 className="font-bold text-sm mb-3">INFORMAÇÕES</h3>
                    <div className="space-y-1 text-sm">
                      <p>{gatoData.idade}</p>
                      <p>{gatoData.sexo}</p>
                      <p>{gatoData.raca}</p>
                      <p>{gatoData.temperamento}</p>
                      <p>{gatoData.castrado}</p>
                    </div>
                  </div>

                  <div className="bg-secondary/50 rounded-2xl p-4">
                    <h3 className="font-bold text-sm mb-3">VACINAS</h3>
                    {gatoData.vacinas.length > 0 ? (
                      <div className="space-y-2">
                        {gatoData.vacinas.map((vacina, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-foreground">{vacina.nome}</span>
                            <span className="text-foreground/70">{vacina.data}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma vacina registrada</p>
                    )}
                  </div>

                  <div className="bg-secondary/50 rounded-2xl p-4">
                    <h3 className="font-bold text-sm mb-3">HISTÓRICO DE SAÚDE</h3>
                    <div className="space-y-1 text-sm">
                      {gatoData.historicoSaude.map((item, index) => (
                        <p key={index}>{item}</p>
                      ))}
                    </div>
                  </div>

                  <div className="bg-secondary/50 rounded-2xl p-4">
                    <h3 className="font-bold text-sm mb-3">OBSERVAÇÕES</h3>
                    <p className="text-sm">{gatoData.observacoes}</p>
                  </div>

                  <div className="bg-secondary/50 rounded-2xl p-4">
                    <h3 className="font-bold text-sm mb-3">ADOTADO</h3>
                    <p className="text-sm">{gatoData.adotado ? "Sim" : "Não"}</p>
                  </div>

                  {gatoData.adotado && gatoData.adotante && (
                    <div className="bg-secondary/50 rounded-2xl p-4">
                      <h3 className="font-bold text-sm mb-3">INFORMAÇÕES DE ADOTANTE</h3>
                      <div className="space-y-1 text-sm">
                        <p>{gatoData.adotante.nome}</p>
                        <p>{gatoData.adotante.telefone}</p>
                        <p>Adotado em: {gatoData.adotante.dataAdocao}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  )
}
