import { RestaurantListingClient } from "@/features/restaurants/restaurant-listing"
import { getRestaurants } from "@/lib/services/restaurant"
import { getCategories } from "@/lib/services/category"

export const metadata = {
  title: "Restaurants",
}

export default async function RestaurantsPage() {
  const [restaurants, categories] = await Promise.all([
    getRestaurants(),
    getCategories(),
  ])

  return (
    <RestaurantListingClient
      restaurants={restaurants}
      categories={categories}
    />
  )
}
