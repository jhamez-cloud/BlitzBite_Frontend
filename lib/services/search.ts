import { restaurants } from "@/mock-data/restaurants"
import { menuItems } from "@/mock-data/menu"
import type { Restaurant, MenuItem } from "@/types"

export interface SearchResults {
  restaurants: Restaurant[]
  menuItems: MenuItem[]
}

export async function search(query: string): Promise<SearchResults> {
  const q = query.toLowerCase()
  return {
    restaurants: restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.categories.some((c) => c.toLowerCase().includes(q))
    ),
    menuItems: menuItems.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
    ),
  }
}

export async function getTrendingSearches(): Promise<string[]> {
  return [
    "Jollof Rice",
    "Burger",
    "Pizza",
    "Shawarma",
    "Fried Rice",
    "Smoothie",
    "Tilapia",
    "Chicken Wings",
  ]
}

export async function getRecentSearches(): Promise<string[]> {
  return ["Burger House", "Jollof Rice", "Pizza Palace"]
}
