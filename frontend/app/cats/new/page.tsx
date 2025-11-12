"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export default function NewCatPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/cats">
            <Button variant="ghost" className="mb-2 -ml-2">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Adicionar Novo Gato</h1>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-4 mt-6">
        <Card className="border-border">
          <CardContent className="pt-6">
            <form className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Foto do Gato</Label>
                <div className="flex flex-col items-center gap-4">
                  {imagePreview ? (
                    <div className="w-32 h-32 rounded-2xl overflow-hidden">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-2xl bg-surface border-2 border-dashed border-border flex items-center justify-center">
                      <Upload className="w-8 h-8 text-text-muted" />
                    </div>
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border-border"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input id="name" placeholder="Ex: Luna" className="border-border" required />
              </div>

              {/* Breed */}
              <div className="space-y-2">
                <Label htmlFor="breed">Raça *</Label>
                <Input id="breed" placeholder="Ex: Siamês" className="border-border" required />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Idade *</Label>
                <Input id="age" placeholder="Ex: 2 anos" className="border-border" required />
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight">Peso</Label>
                <Input id="weight" placeholder="Ex: 3.5 kg" className="border-border" />
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label htmlFor="color">Cor</Label>
                <Input id="color" placeholder="Ex: Laranja com branco" className="border-border" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Conte um pouco sobre a personalidade do gato..."
                  className="border-border min-h-[100px]"
                />
              </div>

              {/* Medical Notes */}
              <div className="space-y-2">
                <Label htmlFor="medical">Observações Médicas</Label>
                <Textarea
                  id="medical"
                  placeholder="Alergias, medicações, condições especiais..."
                  className="border-border min-h-[100px]"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Link href="/cats" className="flex-1">
                  <Button type="button" variant="outline" className="w-full border-border rounded-full bg-transparent">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary-hover text-white rounded-full">
                  Adicionar Gato
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
