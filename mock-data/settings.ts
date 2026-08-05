import type { OwnerPreferences, Restaurant } from "@/types"

// The restaurant owned by the demo admin account ("Mensah's Kitchen").
// Editable from /dashboard/settings.
export const ownerRestaurant: Restaurant = {
  id: 99,
  name: "Mensah's Kitchen",
  slug: "mensahs-kitchen",
  logo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=100&h=100&fit=crop",
  banner:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop",
  rating: 4.7,
  reviewCount: 268,
  deliveryTime: "25-35 mins",
  deliveryFee: 5,
  minimumOrder: 25,
  categories: ["Local Dishes", "Jollof Rice"],
  isOpen: true,
  isFeatured: true,
  isTrending: false,
  address: "12 Ring Road Central, Accra",
  description:
    "Authentic Ghanaian home-style cooking with the love and flavors of Kwame's family recipes. Every dish tells a story.",
  openingHours: [
    { day: "Monday", open: "09:00", close: "21:00" },
    { day: "Tuesday", open: "09:00", close: "21:00" },
    { day: "Wednesday", open: "09:00", close: "21:00" },
    { day: "Thursday", open: "09:00", close: "21:00" },
    { day: "Friday", open: "09:00", close: "22:00" },
    { day: "Saturday", open: "10:00", close: "22:00" },
    { day: "Sunday", open: "11:00", close: "20:00" },
  ],
  phone: "+233 24 567 8901",
}

export const ownerPreferences: OwnerPreferences = {
  newOrderNotifications: true,
  lowStockAlerts: true,
  marketingEmails: false,
  autoAcceptOrders: false,
}
