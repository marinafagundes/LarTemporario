import Link from "next/link"
import { Cat } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-lg">
        <div className="flex flex-col items-center gap-6">
          <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center">
            <Cat className="w-20 h-20 text-white" strokeWidth={2} />
          </div>

          <h1 className="text-2xl font-bold text-center text-balance text-foreground">Projeto Lar Temporário</h1>
          <p className="text-muted-foreground text-center text-balance">
            Gerencie cuidados compartilhados de gatos de forma simples e organizada
          </p>

          <div className="w-full flex flex-col gap-3 mt-4">
            <Link href="/login" className="w-full">
              <Button className="w-full bg-primary hover:bg-accent text-white font-semibold py-6 rounded-full">
                Entrar
              </Button>
            </Link>
            <Link href="/escalas" className="w-full">
              <Button variant="outline" className="w-full border-border font-semibold py-6 rounded-full bg-transparent">
                Ver demonstração
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
