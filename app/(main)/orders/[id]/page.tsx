import { notFound } from "next/navigation"
import { OrderTrackingClient } from "@/features/order-tracking/order-tracking"
import { getOrder } from "@/lib/services/order"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  return { title: `Order #${id}` }
}

export default async function OrderTrackingPage({ params }: Props) {
  const { id } = await params
  const order = await getOrder(Number(id))
  if (!order) notFound()
  return <OrderTrackingClient order={order} />
}
