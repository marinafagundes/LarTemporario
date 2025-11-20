"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Cat, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"

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
  const [vacinas, setVacinas] = useState([{ nome: "", data: "" }])
  const [historicoSaude, setHistoricoSaude] = useState([""])
  const [observacoes, setObservacoes] = useState([""])

  const adicionarVacina = () => {
    setVacinas([...vacinas, { nome: "", data: "" }])
  }

  const adicionarHistorico = () => {
    setHistoricoSaude([...historicoSaude, ""])
  }

  const adicionarObservacao = () => {
    setObservacoes([...observacoes, ""])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui salvaria no banco de dados
    router.push("/perfil/editar")
  }

  return (
    <>
      <div className="min-h-screen pb-20 bg-background">
        <PageHeader title="CADASTRAR GATO" icon={<Cat className="w-6 h-6" />} />

        <div className="max-w-md mx-auto">
          <div className="px-4 py-6">
            <div className="bg-[#CC5804]/20 rounded-3xl p-6 relative">
              <button
                onClick={() => router.push("/perfil/editar")}
                className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center hover:bg-black/10 rounded transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>

              <form onSubmit={handleSubmit} className="space-y-4 mt-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 rounded-full bg-background flex items-center justify-center border-4 border-primary">
                    <Cat className="w-16 h-16 text-primary" />
                  </div>
                  <Button type="button" className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 text-sm">
                    Adicionar foto
                  </Button>
                </div>

                <div>
                  <Label htmlFor="nome" className="text-foreground font-semibold">
                    Nome
                  </Label>
                  <Input
                    id="nome"
                    placeholder="Digite o nome do(a) gato(a)"
                    className="bg-[#CC5804]/30 border-none text-foreground placeholder:text-foreground/60"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="idade" className="text-foreground font-semibold">
                    Idade
                  </Label>
                  <Input
                    id="idade"
                    placeholder="Digite a idade do(a) gato(a)"
                    className="bg-[#CC5804]/30 border-none text-foreground placeholder:text-foreground/60"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sexo" className="text-foreground font-semibold">
                    Sexo
                  </Label>
                  <Select required>
                    <SelectTrigger className="bg-[#CC5804]/30 border-none text-foreground">
                      <SelectValue placeholder="Selecione o sexo do(a) gato(a)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="macho">Macho</SelectItem>
                      <SelectItem value="femea">Fêmea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cor" className="text-foreground font-semibold">
                    Cor
                  </Label>
                  <Input
                    id="cor"
                    placeholder="Digite a cor do(a) gato(a)"
                    className="bg-[#CC5804]/30 border-none text-foreground placeholder:text-foreground/60"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="temperamento" className="text-foreground font-semibold">
                    Temperamento
                  </Label>
                  <Select required>
                    <SelectTrigger className="bg-[#CC5804]/30 border-none text-foreground">
                      <SelectValue placeholder="Selecione o temperamento do(a) gato(a)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="docil">Dócil</SelectItem>
                      <SelectItem value="nao-docil">Não dócil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="castrado" className="text-foreground font-semibold">
                    Castrado
                  </Label>
                  <Select required>
                    <SelectTrigger className="bg-[#CC5804]/30 border-none text-foreground">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-foreground font-semibold">Vacinas</Label>
                  </div>
                  {vacinas.map((vacina, index) => (
                    <div key={index} className="relative mb-2">
                      <Input
                        placeholder="Ex.: V5 - 15/03/2024"
                        className="bg-[#CC5804]/30 border-none text-foreground placeholder:text-foreground/60 pr-10"
                        value={vacina.nome}
                        onChange={(e) => {
                          const novasVacinas = [...vacinas]
                          novasVacinas[index].nome = e.target.value
                          setVacinas(novasVacinas)
                        }}
                      />
                      <button
                        type="button"
                        onClick={adicionarVacina}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-foreground font-semibold">Histórico de saúde</Label>
                  </div>
                  {historicoSaude.map((item, index) => (
                    <div key={index} className="relative mb-2">
                      <Input
                        placeholder="Digite aqui"
                        className="bg-[#CC5804]/30 border-none text-foreground placeholder:text-foreground/60 pr-10"
                        value={item}
                        onChange={(e) => {
                          const novoHistorico = [...historicoSaude]
                          novoHistorico[index] = e.target.value
                          setHistoricoSaude(novoHistorico)
                        }}
                      />
                      <button
                        type="button"
                        onClick={adicionarHistorico}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-foreground font-semibold">Observações</Label>
                  </div>
                  {observacoes.map((obs, index) => (
                    <div key={index} className="relative mb-2">
                      <Input
                        placeholder="Digite aqui"
                        className="bg-[#CC5804]/30 border-none text-foreground placeholder:text-foreground/60 pr-10"
                        value={obs}
                        onChange={(e) => {
                          const novasObs = [...observacoes]
                          novasObs[index] = e.target.value
                          setObservacoes(novasObs)
                        }}
                      />
                      <button
                        type="button"
                        onClick={adicionarObservacao}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <Label htmlFor="adotado" className="text-foreground font-semibold">
                    Adotado
                  </Label>
                  <Input
                    id="adotado"
                    placeholder="Não"
                    className="bg-[#CC5804]/30 border-none text-foreground placeholder:text-foreground/60"
                    disabled
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    className="flex-1 bg-[#CC5804]/60 hover:bg-[#CC5804]/70 text-white rounded-full border-none"
                    onClick={() => router.push("/perfil/editar")}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-full">
                    Cadastrar gato
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  )
}
