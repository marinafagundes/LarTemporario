"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Cat, Plus , X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { gatosApi } from "@/lib/api/gatos"
import { useToast } from "@/hooks/use-toast"


/**
 * Página de Cadastro de Novos Gatos
 *
 * Permite o cadastro completo de um novo gato no sistema.
 *
 * Campos obrigatórios:
 * - Nome, idade, sexo, cor, temperamento, status de castração
 *
 * Campos opcionais (com suporte a múltiplas entradas):
 * - Vacinas (nome + data)
 * - Histórico de saúde
 * - Observações
 *
 * Funcionalidades especiais:
 * - Upload de foto do gato
 * - Botão (+) para adicionar múltiplas entradas em listas
 * - Apenas 2 opções de temperamento: Dócil e Não dócil
 *
 * @requires Permissões de líder para acessar
 */

export default function CadastrarGatoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    data_resgate: "",
    data_nascimento: "",
    sexo: "",
    status: "",
    foto: "",
    observacao: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      await gatosApi.create({
        nome: formData.nome,
        data_resgate: formData.data_resgate || null,
        data_nascimento: formData.data_nascimento || null,
        sexo: formData.sexo || null,
        status: formData.status || null,
        foto: formData.foto || null,
        observacao: formData.observacao || null
      })
      
      toast({
        title: "Sucesso!",
        description: "Gato cadastrado com sucesso.",
      })
      
      router.push("/gatos")
    } catch (error) {
      console.error('Erro ao cadastrar gato:', error)
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o gato. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <>
      <div className="min-h-screen pb-20 bg-background">
        <div className="max-w-md mx-auto">
          <PageHeader
            title="CADASTRAR GATO"
            leftButton={
              <Link href="/gatos">
                <button className="w-10 h-10 bg-transparent hover:bg-muted rounded-full flex items-center justify-center transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Link>
            }
          />

          {/* Form */}
          <div className="px-4 py-6 sm:px-6">
            <Card className="border-border bg-card">
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Foto */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary overflow-hidden">
                      {formData.foto ? (
                        <img src={formData.foto} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Cat className="w-16 h-16 text-primary" />
                      )}
                    </div>
                    <div className="w-full">
                      <Label htmlFor="foto">URL da Foto</Label>
                      <Input
                        id="foto"
                        placeholder="Cole a URL da foto"
                        className="bg-secondary/50 border-border"
                        value={formData.foto}
                        onChange={(e) => handleChange('foto', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Nome */}
                  <div>
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      placeholder="Digite o nome do(a) gato(a)"
                      className="bg-secondary/50 border-border"
                      required
                      value={formData.nome}
                      onChange={(e) => handleChange('nome', e.target.value)}
                    />
                  </div>

                  {/* Data de Resgate */}
                  <div>
                    <Label htmlFor="data_resgate">Data de Resgate</Label>
                    <Input
                      id="data_resgate"
                      type="date"
                      className="bg-secondary/50 border-border"
                      value={formData.data_resgate}
                      onChange={(e) => handleChange('data_resgate', e.target.value)}
                    />
                  </div>

                  {/* Data de Nascimento */}
                  <div>
                    <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                    <Input
                      id="data_nascimento"
                      type="date"
                      className="bg-secondary/50 border-border"
                      value={formData.data_nascimento}
                      onChange={(e) => handleChange('data_nascimento', e.target.value)}
                    />
                  </div>

                  {/* Sexo */}
                  <div>
                    <Label htmlFor="sexo">Sexo</Label>
                    <Select value={formData.sexo} onValueChange={(value) => handleChange('sexo', value)}>
                      <SelectTrigger className="bg-secondary/50 border-border">
                        <SelectValue placeholder="Selecione o sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Macho</SelectItem>
                        <SelectItem value="F">Fêmea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                      <SelectTrigger className="bg-secondary/50 border-border">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Disponível">Disponível</SelectItem>
                        <SelectItem value="Adotado">Adotado</SelectItem>
                        <SelectItem value="Em tratamento">Em tratamento</SelectItem>
                        <SelectItem value="Não dócil">Não dócil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Observações */}
                  <div>
                    <Label htmlFor="observacao">Observações</Label>
                    <Textarea
                      id="observacao"
                      placeholder="Digite observações sobre o gato (temperamento, saúde, vacinas, etc.)"
                      className="bg-secondary/50 border-border min-h-[120px]"
                      value={formData.observacao}
                      onChange={(e) => handleChange('observacao', e.target.value)}
                    />
                  </div>

                  {/* Botões */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-border bg-transparent rounded-full"
                      onClick={() => router.push("/gatos")}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-primary hover:bg-accent text-white rounded-full"
                      disabled={loading}
                    >
                      {loading ? "Cadastrando..." : "Cadastrar gato"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  )
}
