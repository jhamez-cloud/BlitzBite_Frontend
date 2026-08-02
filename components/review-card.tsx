import Image from "next/image"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Review } from "@/types"

interface ReviewCardProps {
  review: Review
  className?: string
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <div
      className={cn("rounded-2xl border border-border bg-card p-4", className)}
    >
      <div className="flex items-start gap-3">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
          <Image
            src={review.userAvatar}
            alt={review.userName}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">{review.userName}</h4>
            <span className="text-xs text-muted-foreground">{review.date}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3.5",
                  i < review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-muted text-muted"
                )}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
        </div>
      </div>
    </div>
  )
}
