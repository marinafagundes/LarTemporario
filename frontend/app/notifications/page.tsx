import Link from "next/link"
import { ArrowLeft, Bell, Calendar, Heart, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data
const notifications = [
  {
    id: "1",
    type: "reminder",
    title: "Lembrete de Escala",
    message: "Você tem cuidados agendados com Luna amanhã (dia todo)",
    time: "2h atrás",
    read: false,
    icon: Calendar,
    color: "text-primary",
  },
  {
    id: "2",
    type: "medical",
    title: "Medicação Pendente",
    message: "Thor precisa de medicação às 14h hoje",
    time: "3h atrás",
    read: false,
    icon: AlertCircle,
    color: "text-destructive",
  },
  {
    id: "3",
    type: "schedule",
    title: "Nova Escala Disponível",
    message: "A escala do próximo mês já está disponível para visualização",
    time: "1 dia atrás",
    read: false,
    icon: Calendar,
    color: "text-primary",
  },
  {
    id: "4",
    type: "info",
    title: "Atualização de Perfil",
    message: "As informações de Luna foram atualizadas. Verifique as novas observações médicas.",
    time: "2 dias atrás",
    read: true,
    icon: Bell,
    color: "text-text-muted",
  },
  {
    id: "5",
    type: "achievement",
    title: "Parabéns!",
    message: "Você completou 50 dias de cuidados! Continue assim.",
    time: "3 dias atrás",
    read: true,
    icon: Heart,
    color: "text-primary",
  },
  {
    id: "6",
    type: "reminder",
    title: "Vacinação Próxima",
    message: "A vacina V3 de Mel vence em 15 dias",
    time: "5 dias atrás",
    read: true,
    icon: AlertCircle,
    color: "text-accent",
  },
]

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/home">
            <Button variant="ghost" className="mb-2 -ml-2">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Notificações</h1>
              {unreadCount > 0 && (
                <p className="text-text-muted">
                  {unreadCount} não lida{unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" className="border-primary text-primary bg-transparent">
                <Check className="w-4 h-4 mr-2" />
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 mt-6 space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const Icon = notification.icon
            return (
              <Card
                key={notification.id}
                className={`border-border cursor-pointer hover:shadow-lg transition-shadow ${
                  !notification.read ? "bg-primary/5" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div
                      className={`w-10 h-10 rounded-full ${!notification.read ? "bg-primary/10" : "bg-surface"} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-5 h-5 ${notification.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{notification.title}</h3>
                        {!notification.read && <Badge className="bg-primary text-white border-0 text-xs">Nova</Badge>}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed mb-2">{notification.message}</p>
                      <p className="text-xs text-text-muted">{notification.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card className="border-border">
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-text-muted" />
              <p className="text-text-muted">Nenhuma notificação</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
