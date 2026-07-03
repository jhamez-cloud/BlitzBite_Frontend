"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock3, Star, Bike } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPriceShort } from "@/constants/site"
import type { Restaurant } from "@/types"

interface RestaurantCardProps {
  restaurant: Restaurant
  className?: string
}

export function RestaurantCard({ restaurant, className }: RestaurantCardProps) {
  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={restaurant.banner}
          alt={restaurant.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {!restaurant.isOpen && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-black">
              Closed
            </span>
          </div>
        )}
        {restaurant.isFeatured && restaurant.isOpen && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
            Featured
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{restaurant.name}</h3>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {restaurant.categories.join(" · ")}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-green-50 px-2 py-0.5 dark:bg-green-950/30">
            <Star className="size-3.5 fill-green-600 text-green-600" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-400">
              {restaurant.rating}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock3 className="size-3.5" />
            {restaurant.deliveryTime}
          </span>
          <span className="flex items-center gap-1">
            <Bike className="size-3.5" />
            {formatPriceShort(restaurant.deliveryFee)}
          </span>
          <span className="text-xs">
            Min. {formatPriceShort(restaurant.minimumOrder)}
          </span>
        </div>
      </div>
    </Link>
  )
}
