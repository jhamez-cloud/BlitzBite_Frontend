import type { Promotion } from "@/types"

export const promotions: Promotion[] = [
  {
    id: 1,
    title: "50% Off Your First Order",
    description:
      "New to BlitzBite? Get 50% off your first order up to ₵30. Use code WELCOME50.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=300&fit=crop",
    code: "WELCOME50",
    discount: "50% off",
    validUntil: "2026-08-31",
    backgroundColor: "from-orange-500 to-red-500",
    textColor: "text-white",
  },
  {
    id: 2,
    title: "Free Delivery Weekend",
    description:
      "Enjoy free delivery on all orders above ₵40 this weekend only!",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=300&fit=crop",
    code: "FREEDEL",
    discount: "Free delivery",
    validUntil: "2026-07-06",
    backgroundColor: "from-blue-500 to-purple-500",
    textColor: "text-white",
  },
  {
    id: 3,
    title: "Burger Week Special",
    description:
      "All burgers are 20% off this week. Satisfy your burger cravings!",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=300&fit=crop",
    code: "BURGERWEEK",
    discount: "20% off",
    validUntil: "2026-07-10",
    backgroundColor: "from-amber-500 to-orange-500",
    textColor: "text-white",
  },
  {
    id: 4,
    title: "Refer & Earn ₵15",
    description:
      "Share BlitzBite with friends. You both get ₵15 off your next order.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=300&fit=crop",
    discount: "₵15 each",
    validUntil: "2026-12-31",
    backgroundColor: "from-green-500 to-emerald-500",
    textColor: "text-white",
  },
]
