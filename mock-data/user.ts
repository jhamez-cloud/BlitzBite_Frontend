import type { User } from "@/types"

export const currentUser: User = {
  id: 1,
  name: "Ama Serwaa",
  email: "ama.serwaa@email.com",
  phone: "+233 24 123 4567",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  joinedDate: "2025-03-15",
  totalOrders: 47,
  totalSpent: 3850,
  favoriteRestaurants: [1, 2, 5, 9],
  addresses: [
    {
      id: 1,
      label: "Home",
      address: "23 Independence Ave, Accra",
      isDefault: true,
    },
    {
      id: 2,
      label: "Office",
      address: "45 Cantonments Rd, Accra",
      isDefault: false,
    },
    {
      id: 3,
      label: "Gym",
      address: "12 Osu Badu St, Accra",
      isDefault: false,
    },
  ],
  paymentMethods: [
    {
      id: 1,
      type: "mobile_money",
      label: "MTN Mobile Money",
      details: "024 *** 4567",
      isDefault: true,
      icon: "phone",
    },
    {
      id: 2,
      type: "card",
      label: "Visa ending 4242",
      details: "**** **** **** 4242",
      isDefault: false,
      icon: "credit-card",
    },
    {
      id: 3,
      type: "wallet",
      label: "BlitzBite Wallet",
      details: "₵120.50 balance",
      isDefault: false,
      icon: "wallet",
    },
  ],
  preferences: {
    notifications: {
      orders: true,
      promotions: true,
      news: false,
    },
    theme: "system",
  },
}
