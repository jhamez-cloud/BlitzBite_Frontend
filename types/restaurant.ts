export interface Restaurant {
  id: number
  name: string
  slug: string
  logo: string
  banner: string
  rating: number
  reviewCount: number
  deliveryTime: string
  deliveryFee: number
  minimumOrder: number
  categories: string[]
  isOpen: boolean
  isFeatured: boolean
  isTrending: boolean
  address: string
  description: string
  openingHours: OpeningHours[]
  phone: string
}

export interface OpeningHours {
  day: string
  open: string
  close: string
}

export interface RestaurantCategory {
  id: number
  name: string
  slug: string
  icon: string
  image: string
  count: number
}
