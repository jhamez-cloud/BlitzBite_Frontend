import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { RestaurantCard } from "@/components/restaurant-card"
import type { Restaurant } from "@/types"

interface FeaturedRestaurantsProps {
  restaurants: Restaurant[]
}

export function FeaturedRestaurants({
  restaurants,
}: FeaturedRestaurantsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold sm:text-2xl">
          Featured Restaurants
        </h2>
        <Link
          href="/restaurants"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </section>
  )
}
