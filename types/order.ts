export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "picked_up"
  | "on_the_way"
  | "delivered"
  | "cancelled"

export interface Order {
  id: number
  restaurantId: number
  restaurantName: string
  restaurantLogo: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  tip: number
  total: number
  status: OrderStatus
  createdAt: string
  estimatedDelivery: string
  deliveryAddress: string
  paymentMethod: string
  courier?: Courier
  timeline: OrderTimelineEntry[]
}

export interface OrderItem {
  name: string
  quantity: number
  price: number
  addons: string[]
}

export interface OrderTimelineEntry {
  status: OrderStatus
  label: string
  time: string | null
  completed: boolean
}

export interface Courier {
  name: string
  phone: string
  avatar: string
  rating: number
  vehicle: string
}
