"use client"
import Link from "next/link"
import { User, Pencil } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"

// Mock do usuário atual - em produção viria da autenticação
const currentUser = {
  role: "LIDER", // ou "VOLUNTARIA"
  name: "Naira Souza",
  phone: "(16) XXXXX-XXXX",
  birthDate: "DD/MM/AAAA",
  image: null,
}

// Mock de dados - em produção viria do banco
const userData = {
  name: "Naira Souza",
  phone: "(16) XXXXX-XXXX",
  birthDate: "DD/MM/AAAA",
  role: "Líder",
  image: null,
  volunteers: [
    { name: "Isabella", email: "isabella@gmail.com", role: "Voluntária" },
    { name: "Adriane", email: "adriane@gmail.com", role: "Voluntária" },
    { name: "Milena", email: "milena@gmail.com", role: "Voluntária" },
    { name: "Yasmin", email: "yasmin@gmail.com", role: "Voluntária" },
  ],
  cats: ["Rio", "Molta", "Mimo", "Brownie"],
  vets: [
    { name: "Simone", clinic: "Clínica Auau Miau" },
    { name: "Simone", clinic: "Clínica Auau Miau" },
  ],
}

export default function PerfilPage() {
  const isLeader = currentUser.role === "LIDER"

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        <PageHeader title="PERFIL" />

        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full bg-muted border-2 border-primary flex items-center justify-center">
              {userData.image ? (
                <img
                  src={userData.image || "/placeholder.svg"}
                  alt={userData.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{userData.name}</h2>
                <Link href="/perfil/editar">
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <Card className="border-border bg-card">
            <CardContent className="p-6 space-y-3">
              <div className="bg-secondary/50 rounded-lg p-3">
                <h4 className="font-bold text-sm mb-2">INFORMAÇÕES</h4>
                <p className="text-sm text-foreground mb-1">Naira Souza</p>
                <p className="text-sm text-foreground mb-1">{userData.phone}</p>
                <p className="text-sm text-foreground">{userData.birthDate}</p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-3">
                <h4 className="font-bold text-sm mb-1">CARGO</h4>
                <p className="text-sm">{userData.role}</p>
              </div>

              {isLeader && (
                <>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <h4 className="font-bold text-sm mb-2">VOLUNTÁRIOS</h4>
                    <div className="space-y-1">
                      {userData.volunteers.map((vol, index) => (
                        <p key={index} className="text-sm text-foreground">
                          {vol.name}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-3">
                    <h4 className="font-bold text-sm mb-2">GATOS</h4>
                    <div className="space-y-1">
                      {userData.cats.map((cat, index) => (
                        <p key={index} className="text-sm text-foreground">
                          {cat}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-3">
                    <h4 className="font-bold text-sm mb-2">VETERINÁRIOS</h4>
                    <div className="space-y-1">
                      {userData.vets.map((vet, index) => (
                        <p key={index} className="text-sm text-foreground">
                          {vet.name} - {vet.clinic}
                        </p>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav />
    </>
  )
}
