import Link from "next/link"
import { CalendarIcon, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BottomNav } from "@/components/bottom-nav"

// Mock data - em produção virá do banco de dados
const mockScheduleOverview = [
  {
    id: "1",
    catName: "Luna",
    catImage: "/placeholder.svg?key=w6hbu",
    today: {
      caretaker: "Maria Silva",
      initials: "MS",
      color: "#d4825a",
    },
    tomorrow: {
      caretaker: "João Santos",
      initials: "JS",
      color: "#a86d4a",
    },
  },
  {
    id: "2",
    catName: "Thor",
    catImage: "/placeholder.svg?key=3ijtv",
    today: {
      caretaker: "Ana Costa",
      initials: "AC",
      color: "#8b6f47",
    },
    tomorrow: null,
  },
  {
    id: "3",
    catName: "Mel",
    catImage: "/placeholder.svg?key=nh4gq",
    today: null,
    tomorrow: {
      caretaker: "Maria Silva",
      initials: "MS",
      color: "#d4825a",
    },
  },
]

export default function ScheduleOverviewPage() {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="bg-surface border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-foreground">Escalas</h1>
            <p className="text-text-muted capitalize">{today}</p>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {mockScheduleOverview.map((schedule) => (
            <Link key={schedule.id} href={`/cats/${schedule.id}/schedule`}>
              <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Cat Info */}
                    <Avatar className="w-16 h-16 rounded-2xl">
                      <AvatarImage src={schedule.catImage || "/placeholder.svg"} alt={schedule.catName} />
                      <AvatarFallback className="rounded-2xl text-xl">{schedule.catName[0]}</AvatarFallback>
                    </Avatar>

                    {/* Schedule Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-2">{schedule.catName}</h3>

                      <div className="space-y-1">
                        {/* Today */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-text-muted w-16">Hoje:</span>
                          {schedule.today ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6" style={{ backgroundColor: schedule.today.color }}>
                                <AvatarFallback
                                  className="text-xs text-white"
                                  style={{ backgroundColor: schedule.today.color }}
                                >
                                  {schedule.today.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-semibold text-foreground">{schedule.today.caretaker}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-text-muted italic">Sem cuidador</span>
                          )}
                        </div>

                        {/* Tomorrow */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-text-muted w-16">Amanhã:</span>
                          {schedule.tomorrow ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6" style={{ backgroundColor: schedule.tomorrow.color }}>
                                <AvatarFallback
                                  className="text-xs text-white"
                                  style={{ backgroundColor: schedule.tomorrow.color }}
                                >
                                  {schedule.tomorrow.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-semibold text-foreground">
                                {schedule.tomorrow.caretaker}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-text-muted italic">Sem cuidador</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-text-muted" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* My Schedule */}
          <Card className="border-border bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Minha Escala</h3>
                    <p className="text-sm text-text-muted">Ver todos os meus dias de cuidado</p>
                  </div>
                </div>
                <Link href="/schedule/my-schedule">
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                  >
                    Ver
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <BottomNav />
    </>
  )
}
