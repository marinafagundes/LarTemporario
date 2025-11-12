import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data - em produção virá do banco de dados
const mySchedule = {
  userName: "Maria Silva",
  upcoming: [
    {
      date: "Segunda-feira, 13 de Janeiro",
      cats: [
        {
          id: "1",
          name: "Luna",
          image: "/placeholder.svg?key=a2kdm",
          time: "Manhã e Tarde",
        },
      ],
    },
    {
      date: "Quarta-feira, 15 de Janeiro",
      cats: [
        {
          id: "1",
          name: "Luna",
          image: "/placeholder.svg?key=siq2n",
          time: "Dia todo",
        },
        {
          id: "3",
          name: "Mel",
          image: "/placeholder.svg?key=p5md0",
          time: "Manhã",
        },
      ],
    },
    {
      date: "Sexta-feira, 17 de Janeiro",
      cats: [
        {
          id: "2",
          name: "Thor",
          image: "/placeholder.svg?key=8joxh",
          time: "Tarde",
        },
      ],
    },
    {
      date: "Segunda-feira, 20 de Janeiro",
      cats: [
        {
          id: "1",
          name: "Luna",
          image: "/placeholder.svg?key=9w2k5",
          time: "Dia todo",
        },
      ],
    },
    {
      date: "Quinta-feira, 23 de Janeiro",
      cats: [
        {
          id: "1",
          name: "Luna",
          image: "/placeholder.svg?key=dmp1r",
          time: "Manhã e Tarde",
        },
      ],
    },
  ],
  stats: {
    thisMonth: 12,
    nextMonth: 15,
    total: 87,
  },
}

export default function MySchedulePage() {
  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/schedule">
            <Button variant="ghost" className="mb-2 -ml-2">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Minha Escala</h1>
          <p className="text-text-muted">{mySchedule.userName}</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 mt-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{mySchedule.stats.thisMonth}</p>
              <p className="text-sm text-text-muted">Este mês</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-accent">{mySchedule.stats.nextMonth}</p>
              <p className="text-sm text-text-muted">Próximo mês</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{mySchedule.stats.total}</p>
              <p className="text-sm text-text-muted">Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Days */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">Próximos Dias</h2>
          <div className="space-y-3">
            {mySchedule.upcoming.map((day, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground mb-2">{day.date}</p>
                      <div className="space-y-2">
                        {day.cats.map((cat) => (
                          <div key={cat.id} className="flex items-center gap-3 p-2 rounded-lg bg-surface/50">
                            <Avatar className="w-10 h-10 rounded-xl">
                              <AvatarImage src={cat.image || "/placeholder.svg"} alt={cat.name} />
                              <AvatarFallback className="rounded-xl">{cat.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{cat.name}</p>
                              <p className="text-sm text-text-muted">{cat.time}</p>
                            </div>
                            <Link href={`/cats/${cat.id}`}>
                              <Button variant="ghost" size="sm">
                                Ver
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
