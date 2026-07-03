import { notFound } from "next/navigation"
import { RestaurantDetailClient } from "@/features/restaurant-detail/restaurant-detail"
import { getRestaurant } from "@/lib/services/restaurant"
import { getMenuByRestaurant } from "@/lib/services/menu"
import { getReviews } from "@/lib/services/review"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const restaurant = await getRestaurant(Number(id))
  if (!restaurant) return { title: "Not Found" }
  return { title: restaurant.name }
}

export default async function RestaurantDetailPage({ params }: Props) {
  const { id } = await params
  const restaurant = await getRestaurant(Number(id))
  if (!restaurant) notFound()

  const [menuItems, reviews] = await Promise.all([
    getMenuByRestaurant(restaurant.id),
    getReviews(restaurant.id),
  ])

  return (
    <RestaurantDetailClient
      restaurant={restaurant}
      menuItems={menuItems}
      reviews={reviews}
    />
  )
}
