"use client"

import type React from "react"

import { useState } from "react"
import { Cat, Plus, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"

// Determina as permissões do usuário no sistema
const currentUser = {
  name: "Isabella Ardo",
  role: "LIDER", // ou "VOLUNTARIA"
}

const registeredCats = [
  { id: "1", name: "Rio" },
  { id: "2", name: "Molta" },
  { id: "3", name: "Brownie" },
  { id: "4", name: "Caramelo" },
]

// Sincronizado com o cadastro em /perfil/editar
const leaderVeterinarians = [
  { id: "1", name: "Clínica Auau Miau", vet: "Simone" },
  { id: "2", name: "Clínica Auau Miau", vet: "Simone" },
]

type TabType = "limpeza" | "socializacao" | "medicacao" | "consultas"

const tabs: { id: TabType; label: string }[] = [
  { id: "limpeza", label: "LIMPEZA" },
  { id: "socializacao", label: "SOCIALIZAÇÃO" },
  { id: "medicacao", label: "MEDICAÇÃO" },
  { id: "consultas", label: "CONSULTAS" },
]

const generateCalendar = (month: number, year: number) => {
  const days = []
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  // Adiciona espaços vazios para alinhar o primeiro dia
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Adiciona os dias do mês
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear()

    days.push({
      day: i,
      date,
      isToday,
      isPast,
    })
  }

  return days
}

const generateAutomaticEvents = (type: "limpeza" | "socializacao", selectedDate: Date | null, events: any[]) => {
  if (!selectedDate) return []

  const dateStr = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}`

  // Verifica se há eventos já selecionados para essa data
  const morningEvent = events.find((e) => e.date === dateStr && e.shift === "Manhã")
  const afternoonEvent = events.find((e) => e.date === dateStr && e.shift === "Tarde")

  return [
    {
      id: `${type}-morning-${dateStr}`,
      shift: "Manhã",
      date: dateStr,
      volunteer: morningEvent?.volunteer || null,
      available: !morningEvent?.volunteer,
    },
    {
      id: `${type}-afternoon-${dateStr}`,
      shift: "Tarde",
      date: dateStr,
      volunteer: afternoonEvent?.volunteer || null,
      available: !afternoonEvent?.volunteer,
    },
  ]
}

const monthNames = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
]

export default function EscalasPage() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(today)

  const [activeTab, setActiveTab] = useState<TabType>("limpeza")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const [selectedShifts, setSelectedShifts] = useState<any[]>([])
  const [completedShifts, setCompletedShifts] = useState<any[]>([])
  const [createdEvents, setCreatedEvents] = useState<any[]>([
    {
      id: "1",
      type: "medicacao",
      cat: "Brownie",
      medicine: "Nebulização filhotes",
      time: "8h",
      date: `${today.getDate()}/${today.getMonth() + 1}`,
      volunteer: null,
      available: true,
    },
    {
      id: "2",
      type: "consultas",
      cat: "Rio",
      time: "10h",
      date: `${today.getDate()}/${today.getMonth() + 1}`,
      vet: "Simone",
      clinic: "Clínica Auau Miau",
      volunteer: null,
      available: true,
    },
  ])

  const calendar = generateCalendar(currentMonth, currentYear)

  // Apenas líder pode criar eventos de medicação e consulta
  const canCreateEvents = currentUser.role === "LIDER" && (activeTab === "medicacao" || activeTab === "consultas")

  const isAutomaticShifts = activeTab === "limpeza" || activeTab === "socializacao"

  /**
   * Verifica se há eventos cadastrados em um dia específico
   * Usado para exibir indicador visual (ponto) no calendário
   */
  const hasEventOnDay = (day: number) => {
    const dateStr = `${day}/${currentMonth + 1}`
    return createdEvents.some(
      (e) => e.date === dateStr && (e.type === "medicacao" || e.type === "consultas") && activeTab === e.type,
    )
  }

  /**
   * Navega para o mês anterior
   * Trata a transição de ano automaticamente
   */
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  /**
   * Navega para o próximo mês
   * Trata a transição de ano automaticamente
   */
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  /**
   * Manipula o clique em um dia do calendário
   * Apenas dias futuros podem ser selecionados
   */
  const handleDayClick = (day: any) => {
    if (day && !day.isPast) {
      setSelectedDate(day.date)
    }
  }

  /**
   * Atribui ou remove atribuição de turno ao usuário atual
   *
   * Fluxo:
   * 1. Usuário clica em "Selecionar"
   * 2. Sistema atribui o turno ao usuário logado
   * 3. Checkbox de conclusão é habilitado
   *
   * @param event - Objeto do evento/turno
   */
  const handleSelectVolunteer = (event: any) => {
    const existingIndex = selectedShifts.findIndex((s) => s.id === event.id)

    if (existingIndex >= 0) {
      // Remove seleção
      setSelectedShifts(selectedShifts.filter((s) => s.id !== event.id))
    } else {
      setSelectedShifts([...selectedShifts, { ...event, volunteer: currentUser.name }])
    }
  }

  /**
   * Marca ou desmarca tarefa como concluída
   *
   * Regras importantes:
   * - Só pode marcar como concluído APÓS selecionar o turno
   * - Desmarcar o checkbox remove TANTO a conclusão quanto a seleção
   *
   * @param event - Objeto do evento/turno
   */
  const handleCompleteTask = (event: any) => {
    const isSelected = selectedShifts.some((s) => s.id === event.id)

    if (!isSelected && !event.volunteer) return

    const existingIndex = completedShifts.findIndex((s) => s.id === event.id)

    if (existingIndex >= 0) {
      setCompletedShifts(completedShifts.filter((s) => s.id !== event.id))
      setSelectedShifts(selectedShifts.filter((s) => s.id !== event.id))
    } else {
      // Marca como completo
      setCompletedShifts([...completedShifts, event])
    }
  }

  /**
   * Cria novo evento de medicação ou consulta
   * Apenas líder tem permissão para criar eventos
   *
   * @param eventData - Dados do formulário de criação
   */
  const handleCreateEvent = (eventData: any) => {
    const newEvent = {
      id: `${Date.now()}`,
      type: activeTab,
      ...eventData,
      volunteer: null,
      available: true,
    }
    setCreatedEvents([...createdEvents, newEvent])
    setIsCreateDialogOpen(false)
  }

  /**
   * Deleta um evento existente
   *
   * Restrições de segurança:
   * - Apenas líder pode deletar
   * - Apenas eventos de medicação e consulta podem ser deletados
   * - Turnos automáticos (limpeza/socialização) não podem ser deletados
   *
   * @param eventId - ID do evento a ser deletado
   */
  const handleDeleteEvent = (eventId: string) => {
    if (currentUser.role !== "LIDER") return
    setCreatedEvents(createdEvents.filter((e) => e.id !== eventId))
  }

  /**
   * Retorna os eventos para a data selecionada
   *
   * Para limpeza/socialização: gera turnos automáticos
   * Para medicação/consultas: busca eventos criados
   */
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return []

    const dateStr = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}`

    if (isAutomaticShifts) {
      return generateAutomaticEvents(activeTab as "limpeza" | "socializacao", selectedDate, selectedShifts)
    } else {
      return createdEvents.filter((e) => e.type === activeTab && e.date === dateStr)
    }
  }

  const eventsToDisplay = getEventsForSelectedDate()

  return (
    <>
      <div className="min-h-screen pb-20 bg-background">
        <PageHeader title="ESCALAS" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-2 py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="max-w-5xl mx-auto px-4 py-4 space-y-4">
          <Card className="border border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <button onClick={goToPreviousMonth} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold">{monthNames[currentMonth]}</h2>

                <button onClick={goToNextMonth} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-semibold text-muted-foreground">
                <div>Seg</div>
                <div>Ter</div>
                <div>Qua</div>
                <div>Qui</div>
                <div>Sex</div>
                <div>Sáb</div>
                <div>Dom</div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendar.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day && handleDayClick(day)}
                    disabled={!day || day.isPast}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-colors relative ${
                      !day
                        ? ""
                        : day.isPast
                          ? "text-muted-foreground/30 cursor-not-allowed"
                          : day.isToday
                            ? "bg-primary text-white"
                            : selectedDate && day.date.getTime() === selectedDate.getTime()
                              ? "bg-secondary/50 text-primary ring-2 ring-primary"
                              : "hover:bg-muted"
                    }`}
                  >
                    {day?.day}
                    {day && !isAutomaticShifts && hasEventOnDay(day.day) && (
                      <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary"></div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Events Section */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">EVENTOS</h3>
            {canCreateEvents && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-accent text-white rounded-full">
                    <Plus className="w-5 h-5 mr-1" />
                    CRIAR EVENTO
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>EVENTOS</DialogTitle>
                  </DialogHeader>
                  <CreateEventForm
                    type={activeTab}
                    selectedDate={selectedDate}
                    onSave={handleCreateEvent}
                    onClose={() => setIsCreateDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Lista de Eventos */}
          <div className="space-y-3">
            {eventsToDisplay.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {selectedDate ? "Nenhum evento para este dia" : "Selecione um dia no calendário"}
              </p>
            ) : (
              eventsToDisplay.map((event) => {
                const isSelected = selectedShifts.some((s) => s.id === event.id)
                const isCompleted = completedShifts.some((s) => s.id === event.id)
                const displayVolunteer = isSelected ? currentUser.name : event.volunteer
                const canDelete = currentUser.role === "LIDER" && !isAutomaticShifts
                const canComplete = isSelected || event.volunteer

                return (
                  <Card key={event.id} className="border border-border bg-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/30">
                            <Cat className="w-5 h-5 text-foreground" />
                          </div>
                          <div className="flex-1">
                            {isAutomaticShifts ? (
                              <p className="font-semibold text-sm text-foreground">
                                {event.shift} -{" "}
                                {displayVolunteer ? (
                                  <Badge className="bg-primary text-white border-0">{displayVolunteer}</Badge>
                                ) : (
                                  <button
                                    onClick={() => handleSelectVolunteer(event)}
                                    className="text-foreground/60 font-medium hover:text-primary transition-colors"
                                  >
                                    Selecionar
                                  </button>
                                )}
                              </p>
                            ) : (
                              <>
                                {activeTab === "medicacao" ? (
                                  <>
                                    <p className="font-semibold text-sm text-foreground">
                                      {event.time} - Medicação {event.cat}
                                    </p>
                                    <p className="text-xs text-foreground/70 mt-1">{event.medicine}</p>
                                  </>
                                ) : (
                                  <>
                                    <p className="font-semibold text-sm text-foreground">
                                      {event.time} - Consulta {event.cat}
                                    </p>
                                    <p className="text-xs text-foreground/70 mt-1">Vet. {event.vet}</p>
                                    <p className="text-xs text-foreground/70">{event.clinic}</p>
                                  </>
                                )}
                                <div className="mt-2">
                                  {displayVolunteer ? (
                                    <Badge className="bg-primary text-white border-0">{displayVolunteer}</Badge>
                                  ) : (
                                    <button
                                      onClick={() => handleSelectVolunteer(event)}
                                      className="text-foreground/60 text-sm font-medium hover:text-primary transition-colors"
                                    >
                                      Selecionar
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-2 hover:bg-muted rounded-full transition-colors text-destructive"
                              title="Deletar evento"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <div className="ml-4">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => handleCompleteTask(event)}
                              disabled={!canComplete}
                              className={`w-5 h-5 rounded border-2 border-primary accent-primary ${
                                canComplete ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                              }`}
                              title={canComplete ? "Marcar como concluído" : "Selecione um voluntário primeiro"}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </main>
      </div>

      <BottomNav />
    </>
  )
}

/**
 * Formulário de Criação de Eventos
 *
 * Usado para criar eventos de medicação e consultas veterinárias
 *
 * Campos do formulário:
 * - Medicação: gato, data, hora, medicamento
 * - Consulta: gato, data, hora, veterinário/clínica
 *
 * @param type - Tipo do evento (medicacao ou consultas)
 * @param selectedDate - Data pré-selecionada no calendário
 * @param onSave - Callback executado ao salvar
 * @param onClose - Callback para fechar o dialog
 */
function CreateEventForm({
  type,
  selectedDate,
  onSave,
  onClose,
}: {
  type: "medicacao" | "consultas"
  selectedDate: Date | null
  onSave: (data: any) => void
  onClose: () => void
}) {
  const [selectedCat, setSelectedCat] = useState("")
  const [selectedClinic, setSelectedClinic] = useState("")
  const [medicine, setMedicine] = useState("")
  const [date, setDate] = useState(selectedDate ? selectedDate.toISOString().split("T")[0] : "")
  const [time, setTime] = useState("")

  const selectedClinicData = leaderVeterinarians.find((c) => c.id === selectedClinic)

  /**
   * Processa o envio do formulário
   * Formata os dados e chama o callback onSave
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const eventDate = new Date(date + "T00:00:00")
    const dateStr = `${eventDate.getDate()}/${eventDate.getMonth() + 1}`

    const eventData: any = {
      cat: registeredCats.find((c) => c.id === selectedCat)?.name,
      date: dateStr,
      time,
    }

    if (type === "medicacao") {
      eventData.medicine = medicine
    } else {
      eventData.vet = selectedClinicData?.vet
      eventData.clinic = selectedClinicData?.name
    }

    onSave(eventData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="cat">Gato:</Label>
        <Select value={selectedCat} onValueChange={setSelectedCat} required>
          <SelectTrigger className="bg-secondary/50 border-border">
            <SelectValue placeholder="Selecione o gato" />
          </SelectTrigger>
          <SelectContent>
            {registeredCats.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="date">Data:</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="bg-secondary/50 border-border"
        />
      </div>

      <div>
        <Label htmlFor="time">Horário:</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          placeholder="--:--"
          className="bg-secondary/50 border-border text-foreground placeholder:text-foreground/80 [&::-webkit-datetime-edit-text]:text-foreground/80 [&::-webkit-datetime-edit-hour-field]:text-foreground [&::-webkit-datetime-edit-minute-field]:text-foreground"
        />
      </div>

      {type === "medicacao" ? (
        <div>
          <Label htmlFor="medicine">Medicamento:</Label>
          <Input
            id="medicine"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            placeholder="Digite o medicamento"
            required
            className="bg-secondary/50 border-border"
          />
        </div>
      ) : (
        <>
          <div>
            <Label htmlFor="clinic">Veterinária:</Label>
            <Select value={selectedClinic} onValueChange={setSelectedClinic} required>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Selecione a veterinária" />
              </SelectTrigger>
              <SelectContent>
                {leaderVeterinarians.map((clinic) => (
                  <SelectItem key={clinic.id} value={clinic.id}>
                    {clinic.name} - {clinic.vet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedClinicData && (
            <div>
              <Label>Local:</Label>
              <div className="p-3 rounded-lg text-sm bg-secondary/50 text-foreground">{selectedClinicData.name}</div>
            </div>
          )}
        </>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button type="button" variant="outline" className="flex-1 border-border bg-transparent" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1 bg-primary hover:bg-accent text-white">
          Salvar alterações
        </Button>
      </div>
    </form>
  )
}
