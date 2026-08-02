import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { RestaurantCard } from "@/components/restaurant-card"
import type { Restaurant } from "@/types"

interface TrendingRestaurantsProps {
  restaurants: Restaurant[]
}

export function TrendingRestaurants({ restaurants }: TrendingRestaurantsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold sm:text-2xl">Trending Now</h2>
        <Link
          href="/restaurants"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="mt-4 flex scrollbar-none gap-4 overflow-x-auto pb-2">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            className="w-[300px] shrink-0"
          />
        ))}
      </div>
    </section>
  )
}
