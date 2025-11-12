import Link from "next/link"
import { ArrowLeft, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data - em produção virá do banco de dados
const mockSchedule = {
  catName: "Luna",
  currentMonth: "Janeiro 2025",
  weeks: [
    {
      days: [
        { date: 1, dayName: "Qua", caretaker: { name: "Maria Silva", initials: "MS", color: "#d4825a" } },
        { date: 2, dayName: "Qui", caretaker: { name: "João Santos", initials: "JS", color: "#a86d4a" } },
        { date: 3, dayName: "Sex", caretaker: { name: "Maria Silva", initials: "MS", color: "#d4825a" } },
        { date: 4, dayName: "Sáb", caretaker: null },
        { date: 5, dayName: "Dom", caretaker: { name: "Ana Costa", initials: "AC", color: "#8b6f47" } },
      ],
    },
    {
      days: [
        { date: 6, dayName: "Seg", caretaker: { name: "Maria Silva", initials: "MS", color: "#d4825a" } },
        { date: 7, dayName: "Ter", caretaker: { name: "João Santos", initials: "JS", color: "#a86d4a" } },
        { date: 8, dayName: "Qua", caretaker: { name: "Maria Silva", initials: "MS", color: "#d4825a" } },
        { date: 9, dayName: "Qui", caretaker: { name: "Ana Costa", initials: "AC", color: "#8b6f47" } },
        { date: 10, dayName: "Sex", caretaker: { name: "João Santos", initials: "JS", color: "#a86d4a" } },
        { date: 11, dayName: "Sáb", caretaker: null },
        { date: 12, dayName: "Dom", caretaker: { name: "Maria Silva", initials: "MS", color: "#d4825a" } },
      ],
    },
    {
      days: [
        { date: 13, dayName: "Seg", caretaker: { name: "Ana Costa", initials: "AC", color: "#8b6f47" } },
        { date: 14, dayName: "Ter", caretaker: { name: "João Santos", initials: "JS", color: "#a86d4a" } },
        { date: 15, dayName: "Qua", caretaker: { name: "Maria Silva", initials: "MS", color: "#d4825a" } },
        { date: 16, dayName: "Qui", caretaker: null },
        { date: 17, dayName: "Sex", caretaker: { name: "Ana Costa", initials: "AC", color: "#8b6f47" } },
        { date: 18, dayName: "Sáb", caretaker: { name: "João Santos", initials: "JS", color: "#a86d4a" } },
        { date: 19, dayName: "Dom", caretaker: null },
      ],
    },
    {
      days: [
        { date: 20, dayName: "Seg", caretaker: { name: "Maria Silva", initials: "MS", color: "#d4825a" } },
        { date: 21, dayName: "Ter", caretaker: { name: "João Santos", initials: "JS", color: "#a86d4a" } },
        { date: 22, dayName: "Qua", caretaker: { name: "Ana Costa", initials: "AC", color: "#8b6f47" } },
        { date: 23, dayName: "Qui", caretaker: { name: "Maria Silva", initials: "MS", color: "#d4825a" } },
        { date: 24, dayName: "Sex", caretaker: { name: "João Santos", initials: "JS", color: "#a86d4a" } },
        { date: 25, dayName: "Sáb", caretaker: null },
        { date: 26, dayName: "Dom", caretaker: { name: "Ana Costa", initials: "AC", color: "#8b6f47" } },
      ],
    },
    {
      days: [
        { date: 27, dayName: "Seg", caretaker: { name: "Maria Silva", initials: "MS", color: "#d4825a" } },
        { date: 28, dayName: "Ter", caretaker: { name: "João Santos", initials: "JS", color: "#a86d4a" } },
        { date: 29, dayName: "Qua", caretaker: { name: "Ana Costa", initials: "AC", color: "#8b6f47" } },
        { date: 30, dayName: "Qui", caretaker: { name: "Maria Silva", initials: "MS", color: "#d4825a" } },
        { date: 31, dayName: "Sex", caretaker: null },
      ],
    },
  ],
}

export default async function CatSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href={`/cats/${id}`}>
            <Button variant="ghost" className="mb-2 -ml-2">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Escala de Cuidados</h1>
              <p className="text-text-muted">{mockSchedule.catName}</p>
            </div>
            <Button className="bg-primary hover:bg-primary-hover text-white rounded-full">
              <Plus className="w-5 h-5 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-4">
        {/* Month Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">{mockSchedule.currentMonth}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-border bg-transparent">
              Anterior
            </Button>
            <Button variant="outline" size="sm" className="border-border bg-transparent">
              Próximo
            </Button>
          </div>
        </div>

        {/* Calendar */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="space-y-4">
              {mockSchedule.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-2">
                  {week.days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="aspect-square rounded-xl border border-border p-2 flex flex-col items-center justify-between hover:border-primary transition-colors cursor-pointer"
                    >
                      <div className="text-center">
                        <p className="text-xs text-text-muted">{day.dayName}</p>
                        <p className="text-lg font-semibold text-foreground">{day.date}</p>
                      </div>
                      {day.caretaker ? (
                        <Avatar className="w-8 h-8" style={{ backgroundColor: day.caretaker.color }}>
                          <AvatarFallback
                            className="text-xs text-white"
                            style={{ backgroundColor: day.caretaker.color }}
                          >
                            {day.caretaker.initials}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8 rounded-full border-2 border-dashed border-border flex items-center justify-center">
                          <User className="w-4 h-4 text-text-muted" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Cuidadores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10" style={{ backgroundColor: "#d4825a" }}>
                <AvatarFallback className="text-white" style={{ backgroundColor: "#d4825a" }}>
                  MS
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">Maria Silva</p>
                <p className="text-sm text-text-muted">12 dias neste mês</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10" style={{ backgroundColor: "#a86d4a" }}>
                <AvatarFallback className="text-white" style={{ backgroundColor: "#a86d4a" }}>
                  JS
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">João Santos</p>
                <p className="text-sm text-text-muted">9 dias neste mês</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10" style={{ backgroundColor: "#8b6f47" }}>
                <AvatarFallback className="text-white" style={{ backgroundColor: "#8b6f47" }}>
                  AC
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">Ana Costa</p>
                <p className="text-sm text-text-muted">7 dias neste mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
