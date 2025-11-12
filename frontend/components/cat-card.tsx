import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"

interface CatCardProps {
  cat: {
    id: string
    name: string
    age: string
    breed: string
    image: string
    description: string
    caretaker: string | null
  }
}

export function CatCard({ cat }: CatCardProps) {
  return (
    <Link href={`/cats/${cat.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-border">
        <CardContent className="p-0">
          <div className="flex gap-4 p-4">
            {/* Cat Image */}
            <Avatar className="w-24 h-24 rounded-2xl">
              <AvatarImage src={cat.image || "/placeholder.svg"} alt={cat.name} />
              <AvatarFallback className="rounded-2xl bg-surface text-2xl">{cat.name[0]}</AvatarFallback>
            </Avatar>

            {/* Cat Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">{cat.name}</h3>
                <p className="text-sm text-text-muted">{cat.breed}</p>
                <p className="text-sm text-text-muted">{cat.age}</p>
              </div>

              {/* Caretaker Status */}
              <div className="mt-2">
                {cat.caretaker ? (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                    <User className="w-3 h-3 mr-1" />
                    {cat.caretaker}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-border text-text-muted">
                    Sem cuidador
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-4 pb-4">
            <p className="text-sm text-foreground">{cat.description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
