export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  averageRating: number
  ordersChange: number
  revenueChange: number
  customersChange: number
  ratingChange: number
}

export interface ChartDataPoint {
  label: string
  value: number
  previousValue?: number
}

export interface TopItem {
  id: number
  name: string
  image: string
  orders: number
  revenue: number
}

export interface TopCustomer {
  id: number
  name: string
  avatar: string
  orders: number
  totalSpent: number
}
