export type NotificationType = "order" | "promotion" | "system" | "review"

export interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  time: string
  isRead: boolean
  actionUrl?: string
  icon?: string
}
