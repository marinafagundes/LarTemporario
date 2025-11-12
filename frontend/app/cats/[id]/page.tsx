import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Heart, Syringe, Weight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Mock data - em produção virá do banco de dados
const mockCat = {
  id: "1",
  name: "Luna",
  age: "2 anos",
  breed: "Siamês",
  image: "/siamese-cat.png",
  description: "Gata tranquila e carinhosa que adora brincar com varinhas e dormir em lugares altos.",
  caretaker: {
    name: "Maria Silva",
    email: "maria@example.com",
    phone: "(11) 98765-4321",
  },
  weight: "3.5 kg",
  color: "Creme com pontas escuras",
  vaccinations: [
    { name: "V3", date: "15/03/2024", next: "15/03/2025" },
    { name: "Antirrábica", date: "20/03/2024", next: "20/03/2025" },
  ],
  medicalNotes: "Alergia a frutos do mar. Toma medicação para controle de ansiedade.",
  schedule: [
    { day: "Segunda-feira", caretaker: "Maria Silva" },
    { day: "Terça-feira", caretaker: "João Santos" },
    { day: "Quarta-feira", caretaker: "Maria Silva" },
  ],
}

export default async function CatProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/cats">
            <Button variant="ghost" className="mb-4 -ml-2">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
          </Link>

          {/* Cat Header */}
          <div className="flex gap-4 items-start">
            <Avatar className="w-24 h-24 rounded-2xl">
              <AvatarImage src={mockCat.image || "/placeholder.svg"} alt={mockCat.name} />
              <AvatarFallback className="rounded-2xl text-3xl">{mockCat.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{mockCat.name}</h1>
              <p className="text-text-muted">{mockCat.breed}</p>
              <p className="text-text-muted text-sm">{mockCat.age}</p>

              <div className="mt-3">
                {mockCat.caretaker ? (
                  <Badge className="bg-primary text-white border-0">Cuidador atual: {mockCat.caretaker.name}</Badge>
                ) : (
                  <Badge variant="outline" className="border-border">
                    Sem cuidador
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 mt-6 space-y-4">
        {/* Description */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Sobre</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{mockCat.description}</p>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Weight className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-sm text-text-muted">Peso</p>
                <p className="font-semibold text-foreground">{mockCat.weight}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#e8dcc8" }} />
              <div>
                <p className="text-sm text-text-muted">Cor</p>
                <p className="font-semibold text-foreground">{mockCat.color}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vaccinations */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Syringe className="w-5 h-5 text-primary" />
              Vacinação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCat.vaccinations.map((vaccine, index) => (
              <div key={index}>
                {index > 0 && <Separator className="mb-3" />}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{vaccine.name}</p>
                    <p className="text-sm text-text-muted">Aplicada em: {vaccine.date}</p>
                  </div>
                  <Badge variant="outline" className="border-primary text-primary">
                    Próxima: {vaccine.next}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Medical Notes */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Observações Médicas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{mockCat.medicalNotes}</p>
          </CardContent>
        </Card>

        {/* Schedule Preview */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Escala desta Semana
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockCat.schedule.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-text-muted" />
                  <span className="text-foreground">{item.day}</span>
                </div>
                <span className="text-sm text-primary font-semibold">{item.caretaker}</span>
              </div>
            ))}

            <Link href={`/cats/${id}/schedule`} className="block mt-4">
              <Button variant="outline" className="w-full border-border bg-transparent">
                Ver escala completa
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Contact Caretaker */}
        {mockCat.caretaker && (
          <Card className="border-border bg-surface/50">
            <CardHeader>
              <CardTitle className="text-lg">Contato do Cuidador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-foreground">
                <strong>Nome:</strong> {mockCat.caretaker.name}
              </p>
              <p className="text-foreground">
                <strong>Email:</strong> {mockCat.caretaker.email}
              </p>
              <p className="text-foreground">
                <strong>Telefone:</strong> {mockCat.caretaker.phone}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-primary hover:bg-primary-hover text-white rounded-full">Editar Perfil</Button>
          <Button variant="outline" className="flex-1 border-border rounded-full bg-transparent">
            Gerenciar Escala
          </Button>
        </div>
      </main>
    </div>
  )
}
