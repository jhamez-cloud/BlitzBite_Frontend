import { menuItems } from "@/mock-data/menu"
import type { MenuItem } from "@/types"

export async function getMenuByRestaurant(
  restaurantId: number
): Promise<MenuItem[]> {
  return menuItems.filter((m) => m.restaurantId === restaurantId)
}

export async function getMenuItem(id: number): Promise<MenuItem | undefined> {
  return menuItems.find((m) => m.id === id)
}

export async function getPopularMenuItems(): Promise<MenuItem[]> {
  return menuItems.filter((m) => m.isPopular)
}

export async function searchMenuItems(query: string): Promise<MenuItem[]> {
  const q = query.toLowerCase()
  return menuItems.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
  )
}
