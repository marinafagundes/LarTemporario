"use client"

import React, { useState, useMemo, useEffect } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Cat, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"

// helper de data
const formatDateDM = (d: string | Date | null) => {
  if (!d) return null
  const dt = typeof d === "string" ? new Date(d) : d
  return `${dt.getDate()}/${dt.getMonth() + 1}`
}

// Supabase client
const supabase = createClient()

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

// clinics estático (ou substitua por fetch do DB)
const veterinaryClinics: { id: string; name: string; vet: string }[] = [
  { id: "1", name: "Clínica Auau Miau", vet: "Simone" },
  { id: "2", name: "Vet Pet Centro", vet: "Carlos" },
]
// lista mínima para veterinários líderes (restaure da fonte correta se houver)
const leaderVeterinarians: { id: string; name: string; vet: string }[] = veterinaryClinics

type TabType = "limpeza" | "socializacao" | "medicacao" | "consultas"

const tabs: { id: TabType; label: string }[] = [
  { id: "limpeza", label: "LIMPEZA" },
  { id: "socializacao", label: "SOCIALIZAÇÃO" },
  { id: "medicacao", label: "MEDICAÇÃO" },
  { id: "consultas", label: "CONSULTAS" },
]

const generateCalendar = (month: number, year: number) => {
  const days = []
  // getDay(): 0 = Sunday ... 6 = Saturday
  // ajusta para iniciar a semana na segunda (0 = Segunda)
  const firstDay = new Date(year, month, 1).getDay()
  const firstDayMonday = (firstDay + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  // Adiciona espaços vazios para alinhar o primeiro dia
  for (let i = 0; i < firstDayMonday; i++) {
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

export default function EscalasPage() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(today)

  const [activeTab, setActiveTab] = useState<TabType>("limpeza")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const [selectedShifts, setSelectedShifts] = useState<any[]>([])
  const [createdEvents, setCreatedEvents] = useState<any[]>([])
  const [registeredCats, setRegisteredCats] = useState<{ id: string; name: string }[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)

  // popup / detalhes do dia
  const [dayPopupEvents, setDayPopupEvents] = useState<any[] | null>(null)
  const [isDayPopupOpen, setIsDayPopupOpen] = useState(false)
  
  // popup de edição de evento
  const [editingEvent, setEditingEvent] = useState<any | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // carrega sessão, gatos e eventos do Supabase
  useEffect(() => {
    let mounted = true

    const load = async () => {
      // sessão
      const { data: sessionData } = await supabase.auth.getSession()
      const session = sessionData?.session
      if (!mounted) return

      if (session?.user) {
        // busca usuário na tabela usuarios para obter nome/perfil (se existir)
        const { data: userRow, error: userRowError } = await supabase
          .from("usuarios")
          .select("id,nome,perfil")
          .eq("id", session.user.id)
          .single()
        if (!mounted) return

        setCurrentUser({
          id: session.user.id,
          name: (userRow as any)?.nome || (session.user.user_metadata as any)?.name || session.user.email,
          role: ((userRow as any)?.perfil || (session.user.user_metadata as any)?.role || "Voluntario") as string,
        })
      }

      // gatos (map para id string para uso no Select)
      const { data: gatosData, error: gatosError } = await supabase.from("gatos").select("id,nome")
      if (!mounted) return
      const gatosArray: any[] = gatosError ? [] : (gatosData ?? [])
      setRegisteredCats(gatosArray.map((g: any) => ({ id: String(g.id), name: g.nome })))

      // eventos (tabela "eventos" que você adicionou)
      const { data: eventosData, error: eventosError } = await supabase
        .from("eventos")
        .select("id,tipo,turno,data_hora,gato_id,medicamento,clinica,disponivel,voluntario_id,escala_id")
      if (!mounted) return
      const eventos: any[] = eventosError ? [] : (eventosData ?? [])

      // buscar gatos e usuarios referenciados para montar nomes
      const gatoIds = Array.from(new Set(eventos.map((e) => e.gato_id).filter(Boolean)))
      const voluntarioIds = Array.from(new Set(eventos.map((e) => e.voluntario_id).filter(Boolean)))

      const gatosMap: Record<number, any> = {}
      if (gatoIds.length) {
        const { data: gatosRef } = await supabase.from("gatos").select("id,nome").in("id", gatoIds)
        ;(gatosRef ?? []).forEach((g: any) => (gatosMap[g.id] = g))
      }

      const usuariosMap: Record<string, any> = {}
      if (voluntarioIds.length) {
        const { data: usuariosRef } = await supabase.from("usuarios").select("id,nome").in("id", voluntarioIds)
        ;(usuariosRef ?? []).forEach((u: any) => (usuariosMap[u.id] = u))
      }

      // normaliza eventos para UI (shape parecido ao antigo "events")
      const normalized: any[] = eventos.map((ev: any) => {
        const dt = ev.data_hora ? new Date(ev.data_hora) : null
        const tipoLower =
          ev.tipo === "Medicação" ? "medicacao" : ev.tipo === "Consulta" ? "consultas" : ev.tipo === "Limpeza" ? "limpeza" : "socializacao"
        return {
          id: `evento-${ev.id}`,
          db_id: ev.id,
          type: tipoLower,
          shift: ev.turno || null,
          cat: ev.gato_id ? gatosMap[ev.gato_id]?.nome : null,
          gato_id: ev.gato_id ?? null,
          medicine: ev.medicamento || null,
          time: dt ? dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
          date: formatDateDM(dt),
          vet: ev.veterinario_responsavel || null,
          clinic: ev.clinica || ev.clinic || null,
          volunteer: ev.voluntario_id ? usuariosMap[ev.voluntario_id]?.nome || ev.voluntario_id : null,
          volunteer_id: ev.voluntario_id || null,
          available: ev.disponivel ?? true,
        }
      })

      if (!mounted) return
      setCreatedEvents(normalized)
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  // memoiza o calendário para não recalcular em cada render
  const calendar = useMemo(() => generateCalendar(currentMonth, currentYear), [currentMonth, currentYear])

  // indexa eventos por data ("D/M") para renderizar no calendário
  const eventsByDate = useMemo(() => {
    const map: Record<string, any[]> = {}
    for (const ev of createdEvents) {
      if (!ev?.date) continue
      map[ev.date] = map[ev.date] || []
      map[ev.date].push(ev)
    }
    return map
  }, [createdEvents])

  const canCreateEvents = true

  /**
   * Verifica se há eventos cadastrados em um dia específico
   * Usado para exibir indicador visual (ponto) no calendário
   */
  const hasEventOnDay = (day: number) => {
    const dateStr = `${day}/${currentMonth + 1}`
    return createdEvents.some(
      (e) => e.date === dateStr && activeTab === e.type,
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

  // Seleciona voluntário para um evento
  const handleSelectVolunteer = async (event: any) => {
    if (!currentUser) {
      console.warn("Usuário não autenticado — operação cancelada")
      return
    }
    try {
      // Atualiza DB se houver registro persistente
      if (event.db_id) {
        const { error } = await supabase.from("eventos").update({ voluntario_id: currentUser.id, disponivel: false }).eq("id", event.db_id)
        if (error) throw error
      }
      // Atualiza localmente
      setCreatedEvents((prev) => prev.map((ev) => (ev.id === event.id ? { ...ev, volunteer: currentUser.name, volunteer_id: currentUser.id, available: false } : ev)))
      setSelectedShifts((s) => [...s, { ...event, volunteer: currentUser.name, volunteer_id: currentUser.id }])
    } catch (err) {
      console.error("Erro ao selecionar voluntário:", err)
    }
  }

  // Marca tarefa/evento como concluído (localmente). Ajuste para persistir no DB se necessário.
  const handleCompleteTask = async (event: any) => {
    if (!currentUser) return
    try {
      // Apenas atualiza localmente; adapte se tiver campo 'concluido' no backend
      setCreatedEvents((prev) => prev.map((ev) => (ev.id === event.id ? { ...ev, completed: true } : ev)))
    } catch (err) {
      console.error("Erro ao marcar como concluído:", err)
    }
  }

  const handleCreateEvent = async (eventData: any) => {
    try {
      // eventData expected: { gato_id?: number, date: "d/m", time: "HH:MM", shift?: string, medicine?, vet?, clinic? }
      const [dayStr, monthStr] = eventData.date.split("/")
      const year = new Date().getFullYear()
      const [hour = "00", minute = "00"] = (eventData.time || "").split(":")
      const dataHora = new Date(Number(year), Number(monthStr) - 1, Number(dayStr), Number(hour), Number(minute)).toISOString()

      const payload: any = {
        tipo: activeTab === "medicacao" ? "Medicação" : 
              activeTab === "consultas" ? "Consulta" : 
              activeTab === "limpeza" ? "Limpeza" : "Socialização",
        data_hora: dataHora,
        gato_id: eventData.gato_id ?? null,
        disponivel: true,
        voluntario_id: null,
      }
      
      // Adiciona turno para limpeza e socialização
      if (activeTab === "limpeza" || activeTab === "socializacao") {
        payload.turno = eventData.shift
      }
      
      if (activeTab === "medicacao") {
        payload.medicamento = eventData.medicine
      } else if (activeTab === "consultas") {
        payload.veterinario_responsavel = eventData.vet
        payload.clinica = eventData.clinic
      }

      const { data, error } = await supabase.from("eventos").insert([payload]).select().single()
      if (error) throw error

      // normaliza para UI
      const inserted = data
      const normalized = {
        id: `evento-${inserted.id}`,
        db_id: inserted.id,
        type: activeTab,
        shift: inserted.turno || null,
        cat: inserted.gato_id ? registeredCats.find((c) => String(c.id) === String(inserted.gato_id))?.name : null,
        gato_id: inserted.gato_id ?? null,
        medicine: inserted.medicamento || null,
        time: new Date(inserted.data_hora).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: (() => {
          const d = new Date(inserted.data_hora)
          return `${d.getDate()}/${d.getMonth() + 1}`
        })(),
        vet: inserted.veterinario_responsavel || null,
        clinic: inserted.clinica || null,
        volunteer: null,
        volunteer_id: null,
        available: inserted.disponivel ?? true,
      }
      setCreatedEvents((prev) => [...prev, normalized])
      setIsCreateDialogOpen(false)
    } catch (err) {
      console.error("Erro ao criar evento", err)
    }
  }

  /**
   * Atualiza um evento existente
   */
  const handleUpdateEvent = async (eventData: any) => {
    try {
      if (!editingEvent?.db_id) return
      
      const [dayStr, monthStr] = eventData.date.split("/")
      const year = new Date().getFullYear()
      const [hour = "00", minute = "00"] = (eventData.time || "").split(":")
      const dataHora = new Date(Number(year), Number(monthStr) - 1, Number(dayStr), Number(hour), Number(minute)).toISOString()

      const payload: any = {
        data_hora: dataHora,
        gato_id: eventData.gato_id ?? null,
      }
      
      if (editingEvent.type === "limpeza" || editingEvent.type === "socializacao") {
        payload.turno = eventData.shift
      } else if (editingEvent.type === "medicacao") {
        payload.medicamento = eventData.medicine
      } else if (editingEvent.type === "consultas") {
        payload.veterinario_responsavel = eventData.vet
        payload.clinica = eventData.clinic
      }

      const { error } = await supabase.from("eventos").update(payload).eq("id", editingEvent.db_id)
      if (error) throw error

      // Atualiza localmente
      setCreatedEvents((prev) => prev.map((ev) => {
        if (ev.db_id === editingEvent.db_id) {
          return {
            ...ev,
            cat: eventData.gato_id ? registeredCats.find((c) => String(c.id) === String(eventData.gato_id))?.name : null,
            gato_id: eventData.gato_id ?? null,
            shift: payload.turno || ev.shift,
            medicine: payload.medicamento || null,
            time: new Date(dataHora).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            date: eventData.date,
            vet: payload.veterinario_responsavel || null,
            clinic: payload.clinica || null,
          }
        }
        return ev
      }))
      
      setIsEditDialogOpen(false)
      setEditingEvent(null)
    } catch (err) {
      console.error("Erro ao atualizar evento:", err)
    }
  }

  /**
   * Deleta um evento existente
   *
   * Restrições de segurança:
   * - Todos podem deletar eventos que criaram
   * - Líderes podem deletar qualquer evento
   *
   * @param eventId - ID do evento a ser deletado
   * @param dbId - ID do evento no banco de dados
   * @param eventVolunteerId - ID do voluntário associado ao evento
   */
  const handleDeleteEvent = async (eventId: string, dbId?: number, eventVolunteerId?: string) => {
    // Verifica permissões: líder pode deletar tudo, outros só podem deletar seus próprios eventos
    const isEventOwner = eventVolunteerId === currentUser?.id
    const isLeader = currentUser?.role === "LIDER"
    
    if (!isLeader && !isEventOwner && eventVolunteerId) {
      alert("Você não tem permissão para deletar este evento. Apenas o voluntário responsável ou líderes podem deletar.")
      return
    }
    
    try {
      // Remove do banco se tiver db_id
      if (dbId) {
        const { error } = await supabase.from("eventos").delete().eq("id", dbId)
        if (error) throw error
      }
      
      // Remove localmente
      setCreatedEvents(createdEvents.filter((e) => e.id !== eventId))
      setSelectedShifts((s) => s.filter((i) => i.id !== eventId))
    } catch (err) {
      console.error("Erro ao deletar evento:", err)
      alert("Erro ao deletar evento. Tente novamente.")
    }
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
    return createdEvents.filter((e) => e.type === activeTab && e.date === dateStr)
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
                    onClick={(e) => {
                      if (day && !day.isPast) {
                        const dateKey = `${day.day}/${currentMonth + 1}`
                        const evs = eventsByDate[dateKey] || []
                        if (evs.length > 0) {
                          setDayPopupEvents(evs)
                          setIsDayPopupOpen(true)
                        }
                        handleDayClick(day)
                      }
                    }}
                    disabled={!day || day.isPast}
                    className={`aspect-square flex flex-col items-start justify-start rounded-lg text-sm font-medium transition-colors relative px-2 py-2 ${
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
                    {/* número do dia fixo no canto superior esquerdo (sem z-index alto para não sobrepor o header) */}
                    {day && (
                      <div className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full bg-card/50 text-xs font-semibold pointer-events-none">
                        <span className="select-none">{day.day}</span>
                      </div>
                    )}
                    {/* linhas de eventos no dia (máx 3 exibidas, indicando tipo/hora) */}
                    {day && (() => {
                       const dateKey = `${day.day}/${currentMonth + 1}`
                       const evs = eventsByDate[dateKey] || []
                       if (evs.length === 0) return null
                       return (
                        // container ancorado em bottom, sem z alto para não sobrepor header/badges
                        <div className="absolute left-2 right-2 bottom-2 flex flex-col gap-0.5 max-h-20 overflow-auto z-0">
                           {evs.slice(0, 3).map((ev: any) => (
                             <div
                               key={ev.db_id ?? ev.id}
                               title={`${ev.type.toUpperCase()} ${ev.time || ev.shift || ""} — ${ev.cat || ev.medicine || ev.vet || ""}`}
                               className="flex items-center gap-1 text-[11px] leading-4 rounded px-1 py-0.5 text-white overflow-hidden whitespace-nowrap text-ellipsis"
                               style={{
                                 background:
                                   ev.type === "medicacao" ? "#fb7185" /* rose */ :
                                   ev.type === "consultas" ? "#f59e0b" /* amber */ :
                                   ev.type === "limpeza" ? "#38bdf8" /* sky */ : "#34d399" /* green */,
                               }}
                            >
                               <span className="font-semibold text-[10px]">{ev.time || (ev.shift ? ev.shift[0] : "")}</span>
                               <span className="text-[10px] opacity-90 truncate">{ev.type === "medicacao" ? (ev.cat || ev.medicine) : ev.type === "consultas" ? (ev.cat || ev.vet) : (ev.shift ? `${ev.shift}` : (ev.cat || "Evento"))}</span>
                             </div>
                           ))}
                          {/* se houver mais eventos, mostra contador clicável para abrir detalhes (não é <button> para evitar botão aninhado) */}
                          {evs.length > 3 && (
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation()
                                setDayPopupEvents(evs)
                                setIsDayPopupOpen(true)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.stopPropagation()
                                  setDayPopupEvents(evs)
                                  setIsDayPopupOpen(true)
                                }
                              }}
                              className="text-[10px] text-muted-foreground/80 text-center underline cursor-pointer"
                            >
                              +{evs.length - 3}
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dialog para listar TODOS os eventos do dia (quando muitos) */}
          <Dialog open={isDayPopupOpen} onOpenChange={setIsDayPopupOpen}>
            <DialogContent className="bg-card bg-opacity-95 border-border max-w-md">
              <DialogHeader>
                <DialogTitle>Eventos do dia</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 max-h-80 overflow-auto py-2">
                {(dayPopupEvents ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum evento</p>
                ) : (
                  (dayPopupEvents ?? []).map((ev: any) => (
                    <div key={ev.db_id ?? ev.id} className="p-2 rounded-lg bg-secondary/50 flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-sm">
                            {ev.time || ev.shift || "—"} — {ev.type === "medicacao" ? "Medicação" : ev.type === "consultas" ? "Consulta" : ev.type === "limpeza" ? "Limpeza" : "Socialização"}
                          </div>
                          <div className="text-xs text-muted-foreground">{ev.available ? "Disponível" : "Alocado"}</div>
                        </div>
                        <div className="text-xs text-foreground/80 mt-1">
                          {ev.cat ? `${ev.cat}` : ev.medicine ? `${ev.medicine}` : ev.vet ? `Vet: ${ev.vet}` : "Sem detalhe"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right text-xs">
                          {ev.volunteer ? <div className="text-foreground font-semibold">{ev.volunteer}</div> : <div className="text-muted-foreground">—</div>}
                        </div>
                        {/* Botão de deletar sempre visível, permissão verificada na função handleDeleteEvent */}
                        <button
                          onClick={() => {
                            handleDeleteEvent(ev.id, ev.db_id, ev.volunteer_id)
                            // Atualiza o popup removendo o evento deletado
                            setDayPopupEvents((prev) => (prev ?? []).filter((e) => e.id !== ev.id))
                          }}
                          className="p-1.5 hover:bg-muted rounded-full transition-colors text-destructive"
                          title="Deletar evento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

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
                    registeredCats={registeredCats}
                    onSave={handleCreateEvent}
                    onClose={() => setIsCreateDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Dialog de Edição de Evento */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>EDITAR EVENTO</DialogTitle>
              </DialogHeader>
              {editingEvent && (
                <EditEventForm
                  type={editingEvent.type}
                  event={editingEvent}
                  registeredCats={registeredCats}
                  onSave={handleUpdateEvent}
                  onClose={() => {
                    setIsEditDialogOpen(false)
                    setEditingEvent(null)
                  }}
                />
              )}
            </DialogContent>
          </Dialog>

          {/* Lista de Eventos */}
          <div className="space-y-3">
            {eventsToDisplay.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {selectedDate ? "Nenhum evento para este dia" : "Selecione um dia no calendário"}
              </p>
            ) : (
              eventsToDisplay.map((event) => {
                const isSelected = selectedShifts.some((s) => s.id === event.id)
                const displayVolunteer = isSelected ? currentUser?.name : event.volunteer
                // permissões/estado por evento
                const isEventOwner = event.volunteer_id === currentUser?.id
                const isLeader = currentUser?.role === "LIDER"
                const canDelete = isLeader || isEventOwner // TODO: Adicionar filtro para líderes removerem qualquer evento
                const canComplete = Boolean(event.volunteer || isSelected)
                const isCompleted = !!(event as any).completed

                return (
                  <Card key={event.id} className="border border-border bg-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/30">
                            <Cat className="w-5 h-5 text-foreground" />
                          </div>
                          <div className="flex-1">
                            {(activeTab === "limpeza" || activeTab === "socializacao") ? (
                              <>
                                <p className="font-semibold text-sm text-foreground">
                                  {event.time} - {event.shift} {event.cat && `- ${event.cat}`}
                                </p>
                                {event.cat && (
                                  <p className="text-xs text-foreground/70 mt-1">Gato: {event.cat}</p>
                                )}
                              </>
                            ) : activeTab === "medicacao" ? (
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
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingEvent(event)
                              setIsEditDialogOpen(true)
                            }}
                            className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-md transition-colors text-sm font-medium"
                            title="Editar evento"
                          >
                            Editar
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteEvent(event.id, event.db_id, event.volunteer_id)}
                              className="p-2 hover:bg-muted rounded-full transition-colors text-destructive"
                              title="Deletar evento"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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
 * Usado para criar eventos de todos os tipos (limpeza, socialização, medicação e consultas)
 *
 * Campos do formulário:
 * - Limpeza/Socialização: gato (opcional), data, hora, turno
 * - Medicação: gato, data, hora, medicamento
 * - Consulta: gato, data, hora, veterinário/clínica
 *
 * @param type - Tipo do evento (limpeza, socializacao, medicacao ou consultas)
 * @param selectedDate - Data pré-selecionada no calendário
 * @param onSave - Callback executado ao salvar
 * @param onClose - Callback para fechar o dialog
 */
function CreateEventForm({
  type,
  selectedDate,
  registeredCats,
  onSave,
  onClose,
}: {
  type: TabType
  selectedDate: Date | null
  registeredCats: { id: string; name: string }[]
  onSave: (data: any) => void
  onClose: () => void
}) {
  const [selectedCat, setSelectedCat] = useState("")
  const [selectedClinic, setSelectedClinic] = useState("")
  const [medicine, setMedicine] = useState("")
  const [shift, setShift] = useState("Manhã")
  const [date, setDate] = useState(selectedDate ? selectedDate.toISOString().split("T")[0] : "")
  const [time, setTime] = useState("")

  const selectedClinicData = veterinaryClinics.find((c) => c.id === selectedClinic)

  /**
   * Processa o envio do formulário
   * Formata os dados e chama o callback onSave
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const eventDate = new Date(date + "T00:00:00")
    const dateStr = `${eventDate.getDate()}/${eventDate.getMonth() + 1}`

    const eventData: any = {
      gato_id: selectedCat ? Number(selectedCat) : null,
      date: dateStr,
      time,
    }

    if (type === "limpeza" || type === "socializacao") {
      eventData.shift = shift
    } else if (type === "medicacao") {
      eventData.medicine = medicine
    } else if (type === "consultas") {
      eventData.vet = selectedClinicData?.vet
      eventData.clinic = selectedClinicData?.name
    }

    onSave(eventData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campo Gato - obrigatório apenas para medicação e consultas */}
      {(type === "medicacao" || type === "consultas") && (
        <div>
          <Label htmlFor="cat">Gato:</Label>
          <Select value={selectedCat} onValueChange={setSelectedCat} required>
            <SelectTrigger className="bg-secondary/50 border-border">
              <SelectValue placeholder="Selecione o gato" />
            </SelectTrigger>
            <SelectContent>
              {registeredCats.map((cat: { id: string; name: string }) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Campo Gato - opcional para limpeza e socialização */}
      {(type === "limpeza" || type === "socializacao") && (
        <div>
          <Label htmlFor="cat">Gato (opcional):</Label>
          <Select value={selectedCat} onValueChange={setSelectedCat}>
            <SelectTrigger className="bg-secondary/50 border-border">
              <SelectValue placeholder="Selecione o gato (opcional)" />
            </SelectTrigger>
            <SelectContent>
              {registeredCats.map((cat: { id: string; name: string }) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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

      {/* Turno para limpeza e socialização */}
      {(type === "limpeza" || type === "socializacao") && (
        <div>
          <Label htmlFor="shift">Turno:</Label>
          <Select value={shift} onValueChange={setShift} required>
            <SelectTrigger className="bg-secondary/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Manhã">Manhã</SelectItem>
              <SelectItem value="Tarde">Tarde</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

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
      ) : type === "consultas" ? (
        <>
          <div>
            <Label htmlFor="clinic">Veterinária:</Label>
            <Select value={selectedClinic} onValueChange={setSelectedClinic} required>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Selecione a veterinária" />
              </SelectTrigger>
              <SelectContent>
                {veterinaryClinics.map((clinic: { id: string; name: string; vet: string }) => (
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
      ) : null}

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

/**
 * Formulário de Edição de Eventos
 *
 * Usado para editar eventos de medicação e consultas veterinárias
 */
function EditEventForm({
  type,
  event,
  registeredCats,
  onSave,
  onClose,
}: {
  type: TabType
  event: any
  registeredCats: { id: string; name: string }[]
  onSave: (data: any) => void
  onClose: () => void
}) {
  const [selectedCat, setSelectedCat] = useState(String(event.gato_id || ""))
  const [selectedClinic, setSelectedClinic] = useState("")
  const [medicine, setMedicine] = useState(event.medicine || "")
  const [shift, setShift] = useState(event.shift || "Manhã")
  
  // Converte a data do formato "D/M" para "YYYY-MM-DD"
  const [dayStr, monthStr] = (event.date || "").split("/")
  const currentYear = new Date().getFullYear()
  const dateObj = new Date(currentYear, Number(monthStr) - 1, Number(dayStr))
  const [date, setDate] = useState(dateObj.toISOString().split("T")[0])
  const [time, setTime] = useState(event.time || "")

  // Encontra a clínica pelo nome do veterinário
  React.useEffect(() => {
    if (type === "consultas" && event.vet) {
      const clinic = leaderVeterinarians.find((c) => c.vet === event.vet)
      if (clinic) setSelectedClinic(clinic.id)
    }
  }, [type, event.vet])

  const selectedClinicData = leaderVeterinarians.find((c) => c.id === selectedClinic)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const eventDate = new Date(date + "T00:00:00")
    const dateStr = `${eventDate.getDate()}/${eventDate.getMonth() + 1}`

    const eventData: any = {
      gato_id: selectedCat ? Number(selectedCat) : null,
      date: dateStr,
      time,
    }

    if (type === "limpeza" || type === "socializacao") {
      eventData.shift = shift
    } else if (type === "medicacao") {
      eventData.medicine = medicine
    } else if (type === "consultas") {
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
            {registeredCats.map((cat: { id: string; name: string }) => (
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

      {/* Turno para limpeza e socialização */}
      {(type === "limpeza" || type === "socializacao") && (
        <div>
          <Label htmlFor="shift">Turno:</Label>
          <Select value={shift} onValueChange={setShift} required>
            <SelectTrigger className="bg-secondary/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Manhã">Manhã</SelectItem>
              <SelectItem value="Tarde">Tarde</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

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
      ) : type === "consultas" ? (
        <>
          <div>
            <Label htmlFor="clinic">Veterinária:</Label>
            <Select value={selectedClinic} onValueChange={setSelectedClinic} required>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Selecione a veterinária" />
              </SelectTrigger>
              <SelectContent>
                {veterinaryClinics.map((clinic: { id: string; name: string; vet: string }) => (
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
      ) : null}

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
