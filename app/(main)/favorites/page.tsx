"use client"

import { Heart, Store } from "lucide-react"
import { RestaurantCard } from "@/components/restaurant-card"
import { EmptyState } from "@/components/empty-state"
import { useFavorites } from "@/hooks/use-favorites"
import { restaurants } from "@/mock-data/restaurants"
import { favoriteRestaurantIds } from "@/mock-data/favorites"

export default function FavoritesPage() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites(
    favoriteRestaurantIds
  )

  const favoriteRestaurants = restaurants.filter((r) =>
    favorites.includes(r.id)
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Favorites</h1>

      {favoriteRestaurants.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Save your favorite restaurants to find them quickly."
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  )
}
