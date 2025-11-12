"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [reminderTime, setReminderTime] = useState("1-day")

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/profile">
            <Button variant="ghost" className="mb-2 -ml-2">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 mt-6 space-y-4">
        {/* Notifications */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="push-notifications" className="text-base font-semibold text-foreground cursor-pointer">
                  Notificações Push
                </Label>
                <p className="text-sm text-text-muted">Receber alertas no dispositivo</p>
              </div>
              <button
                id="push-notifications"
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full ${notifications ? "bg-primary" : "bg-border"} relative cursor-pointer transition-colors`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 ${notifications ? "right-0.5" : "left-0.5"} transition-all`}
                />
              </button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="email-updates" className="text-base font-semibold text-foreground cursor-pointer">
                  Atualizações por Email
                </Label>
                <p className="text-sm text-text-muted">Receber novidades e lembretes por email</p>
              </div>
              <button
                id="email-updates"
                onClick={() => setEmailUpdates(!emailUpdates)}
                className={`w-12 h-6 rounded-full ${emailUpdates ? "bg-primary" : "bg-border"} relative cursor-pointer transition-colors`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 ${emailUpdates ? "right-0.5" : "left-0.5"} transition-all`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Reminders */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Lembretes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="reminder-time" className="text-base font-semibold text-foreground mb-2 block">
                Lembrete de Escala
              </Label>
              <p className="text-sm text-text-muted mb-3">
                Quando você quer ser lembrado sobre seus próximos dias de cuidado?
              </p>
              <Select value={reminderTime} onValueChange={setReminderTime}>
                <SelectTrigger id="reminder-time" className="border-border">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="same-day">No mesmo dia</SelectItem>
                  <SelectItem value="1-day">1 dia antes</SelectItem>
                  <SelectItem value="2-days">2 dias antes</SelectItem>
                  <SelectItem value="3-days">3 dias antes</SelectItem>
                  <SelectItem value="1-week">1 semana antes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full border-border rounded-full justify-start bg-transparent">
              Alterar Senha
            </Button>
            <Button
              variant="outline"
              className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white rounded-full justify-start bg-transparent"
            >
              Excluir Conta
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button className="w-full bg-primary hover:bg-primary-hover text-white rounded-full">
          Salvar Configurações
        </Button>
      </main>
    </div>
  )
}
