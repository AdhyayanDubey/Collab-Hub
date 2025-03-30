import { redis, generateId } from "../redis"

export type NotificationType =
  | "friend_request"
  | "message"
  | "mention"
  | "reaction"
  | "document_share"
  | "workspace_invite"

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  sourceId?: string
  sourceType?: string
  read: boolean
  createdAt: number
}

export interface NotificationCreate {
  userId: string
  type: NotificationType
  title: string
  message: string
  sourceId?: string
  sourceType?: string
}

const NOTIFICATION_PREFIX = "notification"
const USER_NOTIFICATIONS_PREFIX = "user:notifications"

export async function createNotification(data: NotificationCreate): Promise<Notification> {
  const id = generateId(NOTIFICATION_PREFIX)
  const now = Date.now()

  const notification: Notification = {
    id,
    userId: data.userId,
    type: data.type,
    title: data.title,
    message: data.message,
    sourceId: data.sourceId,
    sourceType: data.sourceType,
    read: false,
    createdAt: now,
  }

  // Store notification data
  await redis.set(`${NOTIFICATION_PREFIX}:${id}`, JSON.stringify(notification))

  // Add to user's notification list with score as timestamp for sorting
  await redis.zadd(`${USER_NOTIFICATIONS_PREFIX}:${data.userId}`, now, id)

  return notification
}

export async function getNotificationById(id: string): Promise<Notification | null> {
  const data = await redis.get(`${NOTIFICATION_PREFIX}:${id}`)
  return data ? JSON.parse(data as string) : null
}

export async function markNotificationAsRead(id: string): Promise<Notification | null> {
  const notification = await getNotificationById(id)
  if (!notification) return null

  const updatedNotification: Notification = {
    ...notification,
    read: true,
  }

  await redis.set(`${NOTIFICATION_PREFIX}:${id}`, JSON.stringify(updatedNotification))

  return updatedNotification
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  const notificationIds = await redis.zrange(`${USER_NOTIFICATIONS_PREFIX}:${userId}`, 0, -1)
  if (notificationIds.length === 0) return true

  await Promise.all(
    notificationIds.map(async (id) => {
      await markNotificationAsRead(id as string)
    }),
  )

  return true
}

export async function deleteNotification(id: string): Promise<boolean> {
  const notification = await getNotificationById(id)
  if (!notification) return false

  // Remove from user's notification list
  await redis.zrem(`${USER_NOTIFICATIONS_PREFIX}:${notification.userId}`, id)

  // Delete notification
  await redis.del(`${NOTIFICATION_PREFIX}:${id}`)

  return true
}

export async function getUserNotifications(
  userId: string,
  limit = 50,
  offset = 0,
  unreadOnly = false,
): Promise<Notification[]> {
  // Get notification IDs sorted by timestamp (newest first)
  const notificationIds = await redis.zrevrange(`${USER_NOTIFICATIONS_PREFIX}:${userId}`, offset, offset + limit - 1)

  if (notificationIds.length === 0) return []

  const notifications = await Promise.all(
    notificationIds.map(async (id) => {
      return getNotificationById(id as string)
    }),
  )

  const filteredNotifications = notifications.filter(Boolean) as Notification[]

  // Filter for unread notifications if requested
  return unreadOnly ? filteredNotifications.filter((n) => !n.read) : filteredNotifications
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const notifications = await getUserNotifications(userId, 1000, 0, true)
  return notifications.length
}

