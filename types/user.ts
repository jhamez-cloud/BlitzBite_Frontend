export interface User {
  id: number
  name: string
  email: string
  phone: string
  avatar: string
  joinedDate: string
  totalOrders: number
  totalSpent: number
  favoriteRestaurants: number[]
  addresses: Address[]
  paymentMethods: PaymentMethod[]
  preferences: UserPreferences
}

export interface Address {
  id: number
  label: string
  address: string
  isDefault: boolean
}

export interface PaymentMethod {
  id: number
  type: "mobile_money" | "card" | "wallet"
  label: string
  details: string
  isDefault: boolean
  icon: string
}

export interface UserPreferences {
  notifications: {
    orders: boolean
    promotions: boolean
    news: boolean
  }
  theme: "light" | "dark" | "system"
}
