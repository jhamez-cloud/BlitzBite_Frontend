"use client"

import Image from "next/image"
import { Heart, Plus, Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { formatPriceShort } from "@/constants/site"
import type { MenuItem } from "@/types"

interface FoodCardProps {
  item: MenuItem
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  onAddToCart?: () => void
  onCardClick?: () => void
  className?: string
}

export function FoodCard({
  item,
  isFavorite = false,
  onFavoriteToggle,
  onAddToCart,
  onCardClick,
  className,
}: FoodCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        !item.available && "opacity-60",
        className
      )}
    >
      <button
        onClick={onCardClick}
        className="w-full text-left"
        disabled={!item.available}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {!item.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black">
                Unavailable
              </span>
            </div>
          )}
          {item.isPopular && item.available && (
            <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-semibold text-white">
              <Flame className="size-3" />
              Popular
            </span>
          )}
        </div>

        <div className="p-3">
          <h3 className="truncate text-sm font-semibold">{item.name}</h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
            {item.description}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-semibold text-primary">
              {formatPriceShort(item.price)}
            </span>
            {item.calories > 0 && (
              <span className="text-xs text-muted-foreground">
                {item.calories} cal
              </span>
            )}
          </div>
        </div>
      </button>

      {onFavoriteToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onFavoriteToggle()
          }}
          className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-transform hover:scale-110 dark:bg-black/50"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-600 dark:text-gray-300"
            )}
          />
        </button>
      )}

      {onAddToCart && item.available && (
        <div className="absolute right-2 bottom-16">
          <Button
            size="icon-sm"
            variant="default"
            className="rounded-full shadow-lg"
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart()
            }}
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
