import { categories } from "@/mock-data/categories"
import type { RestaurantCategory } from "@/types"

export async function getCategories(): Promise<RestaurantCategory[]> {
  return categories
}
