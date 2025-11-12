import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CatCard } from "@/components/cat-card"
import { BottomNav } from "@/components/bottom-nav"

// Mock data - em produção, virá de um banco de dados
const mockCats = [
  {
    id: "1",
    name: "Luna",
    age: "2 anos",
    breed: "Siamês",
    image: "/placeholder.svg?key=esk9j",
    description: "Gata tranquila e carinhosa",
    caretaker: "Maria Silva",
  },
  {
    id: "2",
    name: "Thor",
    age: "3 anos",
    breed: "Maine Coon",
    image: "/placeholder.svg?key=dzmyw",
    description: "Gato brincalhão e sociável",
    caretaker: "João Santos",
  },
  {
    id: "3",
    name: "Mel",
    age: "1 ano",
    breed: "Persa",
    image: "/placeholder.svg?key=41vq4",
    description: "Gatinha calma e peluda",
    caretaker: "Ana Costa",
  },
  {
    id: "4",
    name: "Simba",
    age: "4 anos",
    breed: "Sem raça definida",
    image: "/placeholder.svg?key=qumao",
    description: "Gato aventureiro e independente",
    caretaker: null,
  },
]

export default function CatsPage() {
  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="bg-surface border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">Gatos</h1>
              <Link href="/cats/new">
                <Button className="bg-primary hover:bg-primary-hover text-white rounded-full">
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Gato
                </Button>
              </Link>
            </div>

            {/* Search bar */}
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <Input placeholder="Buscar gatos..." className="pl-10 bg-background border-border rounded-full" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-5xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCats.map((cat) => (
              <CatCard key={cat.id} cat={cat} />
            ))}
          </div>
        </main>
      </div>

      <BottomNav />
    </>
  )
}
