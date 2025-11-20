import { Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function FooterCredits() {
  return (
    <footer className="fixed bottom-16 left-0 right-0 p-2 text-center z-40 pointer-events-none">
      <Dialog>
        <DialogTrigger asChild>
          <button className="pointer-events-auto bg-primary/90 hover:bg-primary text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 mx-auto shadow-md">
            <Info className="w-3.5 h-3.5" />
            <span>Créditos</span>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Créditos do Projeto</DialogTitle>
            <DialogDescription className="sr-only">
              Informações sobre os desenvolvedores e contexto acadêmico do projeto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Integrantes</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>Diogo Melo - 12563522</li>
                <li>Gabriel Costa - 14785489</li>
                <li>Isabella Arão - 9265732</li>
                <li>Leonardo Pereira - 9039361</li>
                <li>Marina Fagundes - 9265405</li>
                <li>Raphael Bonaccorsi - 12563366</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Informações Acadêmicas</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  <span className="font-medium">Disciplina:</span> SSC0536 - Projeto e Desenvolvimento de Sistemas de
                  Informação
                </li>
                <li>
                  <span className="font-medium">Curso:</span> Bacharelado em Sistemas de Informação
                </li>
                <li>
                  <span className="font-medium">Universidade:</span> Universidade de São Paulo (USP)
                </li>
                <li>
                  <span className="font-medium">Ano:</span> 2025
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  )
}
