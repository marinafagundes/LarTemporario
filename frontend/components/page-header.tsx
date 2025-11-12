import Link from "next/link"
import { Cat } from "lucide-react"
import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  leftButton?: ReactNode
  showLogo?: boolean
}

export function PageHeader({ title, leftButton, showLogo = true }: PageHeaderProps) {
  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          {leftButton || <div className="w-10" />}

          <h1 className="text-xl font-bold">{title}</h1>

          {showLogo ? (
            <Link href="/escalas">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-accent transition-colors">
                <Cat className="w-6 h-6 text-white" />
              </div>
            </Link>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </div>
    </header>
  )
}
