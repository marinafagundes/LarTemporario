"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Cat, ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { gatosApi } from "@/lib/api/gatos"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Gato {
  id: number
  nome: string | null
  data_resgate: string | null
  data_nascimento: string | null
  sexo: string | null
  status: string | null
  foto: string | null
  observacao: string | null
}

export default function GatoPerfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [gato, setGato] = useState<Gato | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadGato()
  }, [id])

  const loadGato = async () => {
    try {
      setLoading(true)
      const data = await gatosApi.getById(Number(id))
      setGato(data)
    } catch (error) {
      console.error('Erro ao carregar gato:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do gato.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await gatosApi.delete(Number(id))
      toast({
        title: "Sucesso!",
        description: "Gato removido com sucesso.",
      })
      router.push('/gatos')
    } catch (error) {
      console.error('Erro ao deletar gato:', error)
      toast({
        title: "Erro",
        description: "Não foi possível remover o gato. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setDeleting(false)
    }
  }

  const calcularIdade = (dataNascimento: string | null) => {
    if (!dataNascimento) return "Idade desconhecida"
    const hoje = new Date()
    const nascimento = new Date(dataNascimento)
    const diff = hoje.getTime() - nascimento.getTime()
    const anos = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
    const meses = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
    
    if (anos === 0) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`
    return `${anos} ${anos === 1 ? 'ano' : 'anos'}`
  }

  const formatarData = (data: string | null) => {
    if (!data) return "Não informado"
    const d = new Date(data)
    return d.toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <>
        <div className="min-h-screen pb-20 bg-background">
          <div className="max-w-md mx-auto">
            <header className="bg-card px-4 py-4 flex items-center justify-between border-b border-border">
              <div className="w-10 h-10" />
              <h1 className="text-xl font-bold">GATOS</h1>
              <div className="w-10 h-10" />
            </header>
            <div className="flex items-center justify-center py-20">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </div>
        </div>
        <BottomNav />
      </>
    )
  }

  if (!gato) {
    return (
      <>
        <div className="min-h-screen pb-20 bg-background">
          <div className="max-w-md mx-auto">
            <header className="bg-card px-4 py-4 flex items-center justify-between border-b border-border">
              <Link href="/gatos">
                <button className="w-10 h-10 bg-transparent hover:bg-muted rounded-full flex items-center justify-center transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <h1 className="text-xl font-bold">GATOS</h1>
              <div className="w-10 h-10" />
            </header>
            <div className="flex items-center justify-center py-20">
              <p className="text-muted-foreground">Gato não encontrado</p>
            </div>
          </div>
        </div>
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen pb-20 bg-background">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <header className="bg-card px-4 py-4 flex items-center justify-between border-b border-border">
            <Link href="/gatos">
              <button className="w-10 h-10 bg-transparent hover:bg-muted rounded-full flex items-center justify-center transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>

            <h1 className="text-xl font-bold">GATOS</h1>

            <Link href="/escalas">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-accent transition-colors">
                <Cat className="w-6 h-6 text-white" />
              </div>
            </Link>
          </header>

          {/* Perfil do gato */}
          <div className="px-4 py-6">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                {/* Foto e nome */}
                <div className="flex flex-col items-center gap-3 mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-2 border-primary">
                    <img
                      src={gato.foto || "/placeholder.svg?height=128&width=128"}
                      alt={gato.nome || "Gato"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{gato.nome || "Sem nome"}</h2>
                    <Link href={`/gatos/${id}/editar`}>
                      <button className="text-muted-foreground hover:text-primary transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Informações */}
                <div className="space-y-4">
                  <div className="bg-secondary/50 rounded-2xl p-4">
                    <h3 className="font-bold text-sm mb-3">INFORMAÇÕES</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Idade:</strong> {calcularIdade(gato.data_nascimento)}</p>
                      <p><strong>Sexo:</strong> {gato.sexo === 'M' ? 'Macho' : gato.sexo === 'F' ? 'Fêmea' : 'Não informado'}</p>
                      <p><strong>Data de Resgate:</strong> {formatarData(gato.data_resgate)}</p>
                      <p><strong>Data de Nascimento:</strong> {formatarData(gato.data_nascimento)}</p>
                      <p><strong>Status:</strong> {gato.status || 'Não informado'}</p>
                    </div>
                  </div>

                  {gato.observacao && (
                    <div className="bg-secondary/50 rounded-2xl p-4">
                      <h3 className="font-bold text-sm mb-3">OBSERVAÇÕES</h3>
                      <p className="text-sm whitespace-pre-wrap">{gato.observacao}</p>
                    </div>
                  )}

                  {/* Botão de deletar */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="w-full rounded-full flex items-center gap-2"
                        disabled={deleting}
                      >
                        <Trash2 className="w-4 h-4" />
                        Remover Gato
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso irá remover permanentemente o gato {gato.nome} do sistema.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete} 
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          {deleting ? "Removendo..." : "Confirmar"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  )
}
