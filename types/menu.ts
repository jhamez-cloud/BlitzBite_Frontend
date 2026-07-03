export interface MenuItem {
  id: number
  restaurantId: number
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
  calories: number
  isPopular: boolean
  addons: Addon[]
}

export interface Addon {
  id: number
  name: string
  price: number
}

export interface MenuCategory {
  id: number
  name: string
  slug: string
}
