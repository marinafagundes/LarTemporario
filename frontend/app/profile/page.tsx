import Link from "next/link"
import { Edit, LogOut, Mail, Phone, Calendar, Award, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { BottomNav } from "@/components/bottom-nav"

// Mock data
const userData = {
  name: "Maria Silva",
  email: "maria.silva@example.com",
  phone: "(11) 98765-4321",
  joinDate: "Março de 2024",
  image: "/placeholder.svg?key=user1",
  stats: {
    totalDays: 87,
    favoriteCat: "Luna",
    monthsActive: 10,
  },
  preferences: {
    notifications: true,
    emailUpdates: true,
    reminderTime: "1 dia antes",
  },
}

export default function ProfilePage() {
  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="bg-surface border-b border-border">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userData.image || "/placeholder.svg"} alt={userData.name} />
                <AvatarFallback className="text-2xl">
                  {userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">{userData.name}</h1>
                <p className="text-text-muted">Membro desde {userData.joinDate}</p>
              </div>
              <Link href="/profile/edit">
                <Button variant="outline" className="border-border rounded-full bg-transparent">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {/* Stats */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Total de dias de cuidado</p>
                  <p className="text-xl font-bold text-foreground">{userData.stats.totalDays} dias</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Gato favorito</p>
                  <p className="text-xl font-bold text-foreground">{userData.stats.favoriteCat}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Meses ativos</p>
                  <p className="text-xl font-bold text-foreground">{userData.stats.monthsActive} meses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-text-muted" />
                <div>
                  <p className="text-sm text-text-muted">Email</p>
                  <p className="text-foreground">{userData.email}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-text-muted" />
                <div>
                  <p className="text-sm text-text-muted">Telefone</p>
                  <p className="text-foreground">{userData.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Preferências
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Notificações Push</p>
                  <p className="text-sm text-text-muted">Receber alertas no dispositivo</p>
                </div>
                <div
                  className={`w-12 h-6 rounded-full ${userData.preferences.notifications ? "bg-primary" : "bg-border"} relative cursor-pointer transition-colors`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 ${userData.preferences.notifications ? "right-0.5" : "left-0.5"} transition-all`}
                  />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Atualizações por Email</p>
                  <p className="text-sm text-text-muted">Receber novidades por email</p>
                </div>
                <div
                  className={`w-12 h-6 rounded-full ${userData.preferences.emailUpdates ? "bg-primary" : "bg-border"} relative cursor-pointer transition-colors`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 ${userData.preferences.emailUpdates ? "right-0.5" : "left-0.5"} transition-all`}
                  />
                </div>
              </div>
              <Separator />
              <div>
                <p className="font-semibold text-foreground mb-2">Lembrete de Escala</p>
                <p className="text-sm text-text-muted">
                  Enviar lembrete:{" "}
                  <span className="text-foreground font-semibold">{userData.preferences.reminderTime}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/notifications">
              <Button variant="outline" className="w-full border-border rounded-full justify-start bg-transparent">
                Ver Notificações
              </Button>
            </Link>
            <Link href="/profile/settings">
              <Button variant="outline" className="w-full border-border rounded-full justify-start bg-transparent">
                <Settings className="w-5 h-5 mr-2" />
                Configurações
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white rounded-full justify-start bg-transparent"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sair
            </Button>
          </div>
        </main>
      </div>

      <BottomNav />
    </>
  )
}
