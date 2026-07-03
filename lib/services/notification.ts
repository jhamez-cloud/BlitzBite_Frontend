import { notifications } from "@/mock-data/notifications"
import type { Notification } from "@/types"

export async function getNotifications(): Promise<Notification[]> {
  return notifications
}

export async function getUnreadCount(): Promise<number> {
  return notifications.filter((n) => !n.isRead).length
}
