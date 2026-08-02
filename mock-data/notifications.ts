import type { Notification } from "@/types"

export const notifications: Notification[] = [
  {
    id: 1,
    type: "order",
    title: "Order On The Way",
    message:
      "Your order #1001 from Burger House is on its way! Estimated arrival: 15 mins.",
    time: "5 mins ago",
    isRead: false,
    actionUrl: "/orders/1001",
  },
  {
    id: 2,
    type: "promotion",
    title: "Weekend Special!",
    message:
      "Free delivery on all orders above ₵40 this weekend. Use code FREEDEL.",
    time: "1 hour ago",
    isRead: false,
    actionUrl: "/coupons",
  },
  {
    id: 3,
    type: "order",
    title: "Order Delivered",
    message:
      "Your order #1002 from Mama's Kitchen has been delivered. Enjoy your meal!",
    time: "Yesterday",
    isRead: true,
    actionUrl: "/orders/1002",
  },
  {
    id: 4,
    type: "review",
    title: "Rate Your Experience",
    message:
      "How was your order from Pizza Palace? Leave a review and earn 5 reward points.",
    time: "2 days ago",
    isRead: true,
    actionUrl: "/reviews",
  },
  {
    id: 5,
    type: "system",
    title: "Welcome to BlitzBite!",
    message:
      "Thanks for joining BlitzBite. Use code WELCOME50 for 50% off your first order!",
    time: "1 week ago",
    isRead: true,
  },
  {
    id: 6,
    type: "promotion",
    title: "Burger Week is Here!",
    message:
      "All burgers are 20% off this week. Order now with code BURGERWEEK.",
    time: "3 days ago",
    isRead: false,
    actionUrl: "/restaurants",
  },
  {
    id: 7,
    type: "order",
    title: "Order Cancelled",
    message:
      "Your order #1005 from Banku & Tilapia Spot has been cancelled. Refund processed.",
    time: "5 days ago",
    isRead: true,
    actionUrl: "/orders/1005",
  },
  {
    id: 8,
    type: "system",
    title: "Wallet Top-Up Successful",
    message:
      "₵100 has been added to your BlitzBite wallet. Current balance: ₵120.50.",
    time: "1 week ago",
    isRead: true,
    actionUrl: "/wallet",
  },
]
