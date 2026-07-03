import type {
  DashboardStats,
  ChartDataPoint,
  TopItem,
  TopCustomer,
} from "@/types"

export const dashboardStats: DashboardStats = {
  totalOrders: 1247,
  totalRevenue: 89420,
  totalCustomers: 834,
  averageRating: 4.6,
  ordersChange: 12.5,
  revenueChange: 8.3,
  customersChange: 15.2,
  ratingChange: 0.2,
}

export const revenueData: ChartDataPoint[] = [
  { label: "Mon", value: 12400, previousValue: 11200 },
  { label: "Tue", value: 11800, previousValue: 10900 },
  { label: "Wed", value: 13200, previousValue: 12100 },
  { label: "Thu", value: 14500, previousValue: 13000 },
  { label: "Fri", value: 16800, previousValue: 15200 },
  { label: "Sat", value: 18900, previousValue: 17100 },
  { label: "Sun", value: 15600, previousValue: 14800 },
]

export const ordersData: ChartDataPoint[] = [
  { label: "Mon", value: 142, previousValue: 128 },
  { label: "Tue", value: 135, previousValue: 122 },
  { label: "Wed", value: 158, previousValue: 140 },
  { label: "Thu", value: 167, previousValue: 155 },
  { label: "Fri", value: 198, previousValue: 178 },
  { label: "Sat", value: 225, previousValue: 210 },
  { label: "Sun", value: 188, previousValue: 172 },
]

export const topRestaurants: TopItem[] = [
  {
    id: 9,
    name: "Banku & Tilapia Spot",
    image:
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=100&h=100&fit=crop",
    orders: 245,
    revenue: 18200,
  },
  {
    id: 1,
    name: "Burger House",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=100&h=100&fit=crop",
    orders: 198,
    revenue: 15800,
  },
  {
    id: 2,
    name: "Mama's Kitchen",
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=100&h=100&fit=crop",
    orders: 187,
    revenue: 12400,
  },
  {
    id: 5,
    name: "Shawarma King",
    image:
      "https://images.unsplash.com/photo-1561651188-d207bbec4ec3?w=100&h=100&fit=crop",
    orders: 176,
    revenue: 11200,
  },
  {
    id: 3,
    name: "Pizza Palace",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop",
    orders: 156,
    revenue: 14500,
  },
]

export const topMeals: TopItem[] = [
  {
    id: 6,
    name: "Jollof Rice & Chicken",
    image:
      "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=100&h=100&fit=crop",
    orders: 312,
    revenue: 18720,
  },
  {
    id: 1,
    name: "Double Beef Burger",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop",
    orders: 287,
    revenue: 21525,
  },
  {
    id: 22,
    name: "Banku & Grilled Tilapia",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&h=100&fit=crop",
    orders: 245,
    revenue: 17150,
  },
  {
    id: 14,
    name: "Chicken Shawarma Wrap",
    image:
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=100&h=100&fit=crop",
    orders: 198,
    revenue: 8910,
  },
  {
    id: 10,
    name: "Margherita Pizza",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&h=100&fit=crop",
    orders: 156,
    revenue: 13260,
  },
]

export const topCustomers: TopCustomer[] = [
  {
    id: 1,
    name: "Ama Serwaa",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    orders: 47,
    totalSpent: 3850,
  },
  {
    id: 2,
    name: "Kofi Asante",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    orders: 38,
    totalSpent: 3200,
  },
  {
    id: 3,
    name: "Efua Mensah",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    orders: 35,
    totalSpent: 2900,
  },
  {
    id: 4,
    name: "Kwaku Boateng",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    orders: 29,
    totalSpent: 2450,
  },
  {
    id: 5,
    name: "Akosua Darko",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    orders: 25,
    totalSpent: 2100,
  },
]
