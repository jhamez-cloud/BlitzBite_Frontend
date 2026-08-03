import {
  House,
  Search,
  ShoppingCart,
  ClipboardList,
  User,
  Store,
  Heart,
  Bell,
  Wallet,
  TicketPercent,
  LayoutDashboard,
  Package,
  Users,
  Star,
  BarChart3,
  Settings,
} from "lucide-react"

export const mainNavLinks = [
  { label: "Home", href: "/", icon: House },
  { label: "Restaurants", href: "/restaurants", icon: Store },
  { label: "Orders", href: "/orders", icon: ClipboardList },
  { label: "Favorites", href: "/favorites", icon: Heart },
]

export const mobileNavLinks = [
  { label: "Home", href: "/", icon: House },
  { label: "Search", href: "/search", icon: Search },
  { label: "Cart", href: "#cart", icon: ShoppingCart },
  { label: "Orders", href: "/orders", icon: ClipboardList },
  { label: "Profile", href: "/profile", icon: User },
]

export const profileMenuLinks = [
  { id:"profile", label: "My Profile", href: "/profile", icon: User },
  { id: "orders", label: "My Orders", href: "/orders", icon: ClipboardList },
  { id: "favorites", label: "Favorites", href: "/favorites", icon: Heart },
  { id: "notifications", label: "Notifications", href: "/notifications", icon: Bell },
  { id: "wallet", label: "Wallet", href: "/profile", icon: Wallet },
  { id: "coupons", label: "Coupons", href: "/coupons", icon: TicketPercent },
]

export const dashboardNavLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/orders", icon: Package },
  { label: "Restaurants", href: "/dashboard/restaurants", icon: Store },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Reviews", href: "/dashboard/reviews", icon: Star },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]
