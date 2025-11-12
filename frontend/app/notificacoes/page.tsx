"use client"

import { Cat, Calendar, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"

const currentUser = {
  name: "Isabella Ardo",
  id: "1",
}

const notifications = [
  {
    id: "1",
    type: "reminder",
    title: "Limpeza - turno da manhã",
    time: "8:30",
    userId: "1", // Assigned to current user
    icon: Calendar,
  },
  {
    id: "2",
    type: "medical",
    title: "Medicação filhotes Brownie - 8h",
    time: "8:30",
    userId: "1", // Assigned to current user
    icon: AlertCircle,
  },
  {
    id: "3",
    type: "appointment",
    title: "Consulta Rio - 10h",
    time: "9:30",
    userId: "1", // Assigned to current user
    icon: Calendar,
  },
]

export default function NotificacoesPage() {
  const userNotifications = notifications.filter((n) => n.userId === currentUser.id)

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="bg-card border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="w-10"></div>

              <h1 className="text-xl font-bold">NOTIFICAÇÕES</h1>

              <Link href="/escalas">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-accent transition-colors">
                  <Cat className="w-6 h-6 text-white" />
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-5xl mx-auto px-4 py-4 space-y-3">
          {userNotifications.length > 0 ? (
            userNotifications.map((notification) => {
              const Icon = notification.icon
              return (
                <Card key={notification.id} className="border-border bg-card">
                  <CardContent className="p-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-xl bg-secondary/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{notification.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Nenhuma notificação</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <BottomNav />
    </>
  )
}
