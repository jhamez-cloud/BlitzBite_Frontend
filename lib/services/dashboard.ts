import {
  dashboardStats,
  revenueData,
  ordersData,
  topRestaurants,
  topMeals,
  topCustomers,
} from "@/mock-data/dashboard"
import type {
  DashboardStats,
  ChartDataPoint,
  TopItem,
  TopCustomer,
} from "@/types"

export async function getDashboardStats(): Promise<DashboardStats> {
  return dashboardStats
}

export async function getRevenueData(): Promise<ChartDataPoint[]> {
  return revenueData
}

export async function getOrdersData(): Promise<ChartDataPoint[]> {
  return ordersData
}

export async function getTopRestaurants(): Promise<TopItem[]> {
  return topRestaurants
}

export async function getTopMeals(): Promise<TopItem[]> {
  return topMeals
}

export async function getTopCustomers(): Promise<TopCustomer[]> {
  return topCustomers
}
