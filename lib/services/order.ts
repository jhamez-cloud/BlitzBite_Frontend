import { orders } from "@/mock-data/orders"
import type { Order } from "@/types"

export async function getOrders(): Promise<Order[]> {
  return orders
}

export async function getOrder(id: number): Promise<Order | undefined> {
  return orders.find((o) => o.id === id)
}

export async function getActiveOrders(): Promise<Order[]> {
  return orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  )
}
