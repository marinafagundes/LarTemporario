"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Cat, User, X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"

// Mock do usuário atual
const currentUser = {
  role: "LIDER", // ou "VOLUNTARIA"
}

export default function EditarPerfilPage() {
  const router = useRouter()
  const isLeader = currentUser.role === "LIDER"

  const [volunteers, setVolunteers] = useState([
    { name: "Isabella", email: "isabella@gmail.com", role: "Voluntária" },
    { name: "Adriane", email: "adriane@gmail.com", role: "Voluntária" },
    { name: "Milena", email: "milena@gmail.com", role: "Voluntária" },
    { name: "Yasmin", email: "yasmin@gmail.com", role: "Voluntária" },
  ])

  const [cats, setCats] = useState(["Rio", "Molta", "Mimo", "Brownie"])
  const [vets, setVets] = useState([
    { name: "Simone", clinic: "Clínica Auau Miau" },
    { name: "Simone", clinic: "Clínica Auau Miau" },
  ])

  const [newVolunteer, setNewVolunteer] = useState({ email: "", role: "" })
  const [newVet, setNewVet] = useState({ name: "", clinic: "" })

  const [showNewVolunteerForm, setShowNewVolunteerForm] = useState(false)
  const [showNewVetForm, setShowNewVetForm] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/perfil")
  }

  const removeVolunteer = (index: number) => {
    setVolunteers(volunteers.filter((_, i) => i !== index))
  }

  const removeVet = (index: number) => {
    setVets(vets.filter((_, i) => i !== index))
  }

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        <PageHeader
          title="PERFIL"
          leftButton={
            <Link href="/perfil">
              <button className="w-10 h-10 bg-transparent hover:bg-muted rounded-full flex items-center justify-center transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Link>
          }
          rightButton={
            <Link href="/escalas">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-accent transition-colors">
                <Cat className="w-6 h-6 text-white" />
              </div>
            </Link>
          }
        />

        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full bg-muted border-2 border-primary flex items-center justify-center">
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
            <Button className="bg-primary hover:bg-accent text-white rounded-full px-6 text-sm">Modificar foto</Button>
          </div>

          <Card className="border-border bg-card">
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" defaultValue="Naira Souza" className="bg-secondary/50 border-border" required />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" defaultValue="(16) XXXXX-XXXX" className="bg-secondary/50 border-border" required />
                </div>

                <div>
                  <Label htmlFor="birthDate">Data de nascimento</Label>
                  <Input id="birthDate" defaultValue="DD/MM/AAAA" className="bg-secondary/50 border-border" required />
                </div>

                <div>
                  <Label>Cargo</Label>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-sm text-foreground">{isLeader ? "Líder" : "Voluntária"}</p>
                    <p className="text-xs text-foreground/70 mt-1">O cargo não pode ser alterado</p>
                  </div>
                </div>

                {isLeader && (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Voluntários</Label>
                        <Plus
                          className="w-5 h-5 text-primary cursor-pointer"
                          onClick={() => setShowNewVolunteerForm(!showNewVolunteerForm)}
                        />
                      </div>
                      {volunteers.map((vol, index) => (
                        <div key={index} className="flex items-start gap-2 mb-3 bg-secondary/50 rounded-lg p-3">
                          <div className="flex-1 space-y-2">
                            <p className="text-sm font-semibold text-foreground">{vol.name}</p>
                            <p className="text-xs text-foreground/70">{vol.email}</p>
                            <Select defaultValue={vol.role.toLowerCase()}>
                              <SelectTrigger className="bg-card border-border h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="voluntária">Voluntária</SelectItem>
                                <SelectItem value="líder">Líder</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => removeVolunteer(index)}
                            className="bg-transparent hover:bg-muted text-primary p-2 h-auto"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}

                      {showNewVolunteerForm && (
                        <div className="space-y-2 p-3 bg-secondary/30 rounded-lg">
                          <h4 className="text-sm font-semibold">Novo(a) voluntário(a)</h4>
                          <Input
                            placeholder="Digite o e-mail do(a) novo(a) voluntário(a)"
                            className="bg-card border-border text-sm"
                            value={newVolunteer.email}
                            onChange={(e) => setNewVolunteer({ ...newVolunteer, email: e.target.value })}
                          />
                          <Select
                            value={newVolunteer.role}
                            onValueChange={(value) => setNewVolunteer({ ...newVolunteer, role: value })}
                          >
                            <SelectTrigger className="bg-card border-border h-8 text-xs">
                              <SelectValue placeholder="Selecione o cargo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="voluntária">Voluntária</SelectItem>
                              <SelectItem value="líder">Líder</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Gatos</Label>
                        <Link href="/gatos/novo">
                          <Plus className="w-5 h-5 text-primary cursor-pointer" />
                        </Link>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-3 space-y-1">
                        {cats.map((cat, index) => (
                          <p key={index} className="text-sm">
                            {cat}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Veterinários</Label>
                        <Plus
                          className="w-5 h-5 text-primary cursor-pointer"
                          onClick={() => setShowNewVetForm(!showNewVetForm)}
                        />
                      </div>
                      {vets.map((vet, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2 mb-2 bg-secondary/50 rounded-lg p-3"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">{vet.name}</p>
                            <p className="text-xs text-foreground/70">{vet.clinic}</p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => removeVet(index)}
                            className="bg-transparent hover:bg-muted text-primary p-2 h-auto"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}

                      {showNewVetForm && (
                        <div className="space-y-2 p-3 bg-secondary/30 rounded-lg">
                          <h4 className="text-sm font-semibold">Novo(a) veterinário(a)</h4>
                          <Input
                            placeholder="Digite o nome do(a) veterinário(a)"
                            className="bg-card border-border text-sm"
                            value={newVet.name}
                            onChange={(e) => setNewVet({ ...newVet, name: e.target.value })}
                          />
                          <Input
                            placeholder="Digite o nome da clínica"
                            className="bg-card border-border text-sm"
                            value={newVet.clinic}
                            onChange={(e) => setNewVet({ ...newVet, clinic: e.target.value })}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-border bg-transparent rounded-full"
                    onClick={() => router.push("/perfil")}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-accent text-white rounded-full">
                    Salvar alterações
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav />
    </>
  )
}
