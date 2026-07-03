import { restaurants } from "@/mock-data/restaurants"
import type { Restaurant } from "@/types"

export async function getRestaurants(): Promise<Restaurant[]> {
  return restaurants
}

export async function getRestaurant(
  id: number
): Promise<Restaurant | undefined> {
  return restaurants.find((r) => r.id === id)
}

export async function getRestaurantBySlug(
  slug: string
): Promise<Restaurant | undefined> {
  return restaurants.find((r) => r.slug === slug)
}

export async function getFeaturedRestaurants(): Promise<Restaurant[]> {
  return restaurants.filter((r) => r.isFeatured)
}

export async function getTrendingRestaurants(): Promise<Restaurant[]> {
  return restaurants.filter((r) => r.isTrending)
}

export async function searchRestaurants(query: string): Promise<Restaurant[]> {
  const q = query.toLowerCase()
  return restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.categories.some((c) => c.toLowerCase().includes(q))
  )
}
