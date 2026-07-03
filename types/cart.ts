import type { Addon } from "./menu"

export interface CartItem {
  id: string
  menuItemId: number
  restaurantId: number
  name: string
  price: number
  image: string
  quantity: number
  selectedAddons: Addon[]
  specialInstructions?: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  tip: number
  total: number
}
