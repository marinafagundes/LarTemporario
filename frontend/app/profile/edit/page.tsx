"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function EditProfilePage() {
  const [imagePreview, setImagePreview] = useState<string>("/placeholder.svg?key=user1")

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
          <Link href="/profile">
            <Button variant="ghost" className="mb-2 -ml-2">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Editar Perfil</h1>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-4 mt-6">
        <Card className="border-border">
          <CardContent className="pt-6">
            <form className="space-y-6">
              {/* Profile Image */}
              <div className="space-y-2">
                <Label htmlFor="image">Foto de Perfil</Label>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
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
                <Label htmlFor="name">Nome Completo *</Label>
                <Input id="name" defaultValue="Maria Silva" className="border-border" required />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="maria.silva@example.com"
                  className="border-border"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" type="tel" defaultValue="(11) 98765-4321" className="border-border" />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Link href="/profile" className="flex-1">
                  <Button type="button" variant="outline" className="w-full border-border rounded-full bg-transparent">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary-hover text-white rounded-full">
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
