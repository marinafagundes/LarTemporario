"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Edit, LogOut, Mail, Phone, Award, Settings, User, Shield, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { BottomNav } from "@/components/bottom-nav"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { authApi } from "@/lib/api/auth"
import { usuariosApi } from "@/lib/api/usuarios"
import { Database } from "@/lib/supabase"

type Usuario = Database['public']['Tables']['usuarios']['Row']

export default function ProfilePage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true)
        setError("")
        
        const isAuth = await authApi.isAuthenticated()
        if (!isAuth) {
          router.push("/login")
          return
        }

        const userData = await usuariosApi.getCurrent()
        setUsuario(userData)
      } catch (err: any) {
        console.error("Error loading user data:", err)
        setError("Failed to load your data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleLogout = async () => {
    try {
      await authApi.signOut()
      router.push("/login")
    } catch (err) {
      console.error("Error logging out:", err)
    }
  }

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-background pb-20">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
            <div className="flex flex-col items-center gap-4 mb-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
        <BottomNav />
      </>
    )
  }

  if (error || !usuario) {
    return (
      <>
        <div className="min-h-screen bg-background pb-20">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "Failed to load your data."}
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="bg-surface border-b border-border">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl">
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">{usuario.nome}</h1>
              </div>
              <Link href="/profile/edit">
                <Button variant="outline" className="border-border rounded-full bg-transparent">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {/* Account Info */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Full Name</p>
                  <p className="text-xl font-bold text-foreground">{usuario.nome}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Role</p>
                  <p className="text-xl font-bold text-foreground">{usuario.perfil}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Status</p>
                  <p className="text-xl font-bold text-foreground">
                    {usuario.ativo ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-text-muted" />
                <div>
                  <p className="text-sm text-text-muted">Email</p>
                  <p className="text-foreground">{usuario.email}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-text-muted" />
                <div>
                  <p className="text-sm text-text-muted">Phone</p>
                  <p className="text-foreground">{usuario.telefone || "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/notifications">
              <Button variant="outline" className="w-full border-border rounded-full justify-start bg-transparent">
                View Notifications
              </Button>
            </Link>
            <Link href="/profile/settings">
              <Button variant="outline" className="w-full border-border rounded-full justify-start bg-transparent">
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white rounded-full justify-start bg-transparent"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </main>
      </div>

      <BottomNav />
    </>
  )
}
