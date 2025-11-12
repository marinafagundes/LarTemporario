import Link from "next/link"
import { Calendar, Cat, Bell, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BottomNav } from "@/components/bottom-nav"

// Mock data
const homeData = {
  userName: "Maria Silva",
  todaySchedule: [
    {
      id: "1",
      catName: "Luna",
      catImage: "/placeholder.svg?key=hm2ck",
      time: "Dia todo",
    },
    {
      id: "3",
      catName: "Mel",
      catImage: "/placeholder.svg?key=n3q8x",
      time: "Manhã",
    },
  ],
  notifications: [
    {
      id: "1",
      message: "Thor precisa de medicação às 14h",
      time: "2h atrás",
      read: false,
    },
    {
      id: "2",
      message: "Nova escala disponível para o próximo mês",
      time: "1 dia atrás",
      read: false,
    },
  ],
  stats: {
    totalCats: 8,
    myDaysThisMonth: 12,
    activeCaregivers: 5,
  },
}

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="bg-surface border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Olá, {homeData.userName}!</h1>
                <p className="text-text-muted">Bem-vindo ao Lar Temporário</p>
              </div>
              <Link href="/profile">
                <Avatar className="w-12 h-12 cursor-pointer">
                  <AvatarImage src="/placeholder.svg?key=user1" alt={homeData.userName} />
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <Cat className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">{homeData.stats.totalCats}</p>
                <p className="text-xs text-text-muted">Gatos</p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">{homeData.stats.myDaysThisMonth}</p>
                <p className="text-xs text-text-muted">Meus dias</p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">{homeData.stats.activeCaregivers}</p>
                <p className="text-xs text-text-muted">Cuidadores</p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Minha Escala Hoje</span>
                <Link href="/schedule/my-schedule">
                  <Button variant="ghost" size="sm" className="text-primary">
                    Ver todas
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {homeData.todaySchedule.length > 0 ? (
                homeData.todaySchedule.map((schedule) => (
                  <Link key={schedule.id} href={`/cats/${schedule.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 hover:bg-surface transition-colors cursor-pointer">
                      <Avatar className="w-12 h-12 rounded-xl">
                        <AvatarImage src={schedule.catImage || "/placeholder.svg"} alt={schedule.catName} />
                        <AvatarFallback className="rounded-xl">{schedule.catName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{schedule.catName}</p>
                        <p className="text-sm text-text-muted">{schedule.time}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-text-muted py-4">Nenhum gato agendado para hoje</p>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notificações
                </span>
                <Link href="/notifications">
                  <Button variant="ghost" size="sm" className="text-primary">
                    Ver todas
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {homeData.notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface/50">
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{notification.message}</p>
                    <p className="text-xs text-text-muted mt-1">{notification.time}</p>
                  </div>
                  {!notification.read && <Badge className="bg-primary text-white border-0">Nova</Badge>}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/cats">
              <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Cat className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold text-foreground">Ver Gatos</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/schedule">
              <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold text-foreground">Ver Escalas</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </main>
      </div>

      <BottomNav />
    </>
  )
}
