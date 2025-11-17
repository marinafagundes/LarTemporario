'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Cat } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redireciona automaticamente para a página de login
    router.push('/login')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-lg">
        <div className="flex flex-col items-center gap-6">
          <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center">
            <Cat className="w-20 h-20 text-white" strokeWidth={2} />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  )
}
