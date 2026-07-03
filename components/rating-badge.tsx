import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingBadgeProps {
  rating: number
  reviewCount?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export function RatingBadge({
  rating,
  reviewCount,
  size = "md",
  className,
}: RatingBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-green-50 dark:bg-green-950/30",
        size === "sm" && "px-1.5 py-0.5 text-xs",
        size === "md" && "px-2 py-0.5 text-sm",
        size === "lg" && "px-2.5 py-1 text-base",
        className
      )}
    >
      <Star
        className={cn(
          "fill-green-600 text-green-600",
          size === "sm" && "size-3",
          size === "md" && "size-3.5",
          size === "lg" && "size-4"
        )}
      />
      <span className="font-semibold text-green-700 dark:text-green-400">
        {rating}
      </span>
      {reviewCount !== undefined && (
        <span className="text-green-600/70 dark:text-green-400/70">
          ({reviewCount})
        </span>
      )}
    </div>
  )
}
