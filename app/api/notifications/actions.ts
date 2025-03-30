"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "../auth/actions"
import {
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  type Notification,
} from "@/lib/models/notification"

export async function markNotificationReadAction(
  notificationId: string,
): Promise<{ success: boolean; error?: string; notification?: Notification }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to manage notifications" }
  }

  try {
    const notification = await getNotificationById(notificationId)

    if (!notification) {
      return { success: false, error: "Notification not found" }
    }

    if (notification.userId !== user.id) {
      return { success: false, error: "You do not have permission to manage this notification" }
    }

    const updatedNotification = await markNotificationAsRead(notificationId)

    revalidatePath("/notifications")

    return { success: true, notification: updatedNotification }
  } catch (error) {
    console.error("Mark notification read error:", error)
    return { success: false, error: "An error occurred while marking the notification as read" }
  }
}

export async function markAllNotificationsReadAction(): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to manage notifications" }
  }

  try {
    await markAllNotificationsAsRead(user.id)

    revalidatePath("/notifications")

    return { success: true }
  } catch (error) {
    console.error("Mark all notifications read error:", error)
    return { success: false, error: "An error occurred while marking all notifications as read" }
  }
}

export async function deleteNotificationAction(notificationId: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to manage notifications" }
  }

  try {
    const notification = await getNotificationById(notificationId)

    if (!notification) {
      return { success: false, error: "Notification not found" }
    }

    if (notification.userId !== user.id) {
      return { success: false, error: "You do not have permission to manage this notification" }
    }

    await deleteNotification(notificationId)

    revalidatePath("/notifications")

    return { success: true }
  } catch (error) {
    console.error("Delete notification error:", error)
    return { success: false, error: "An error occurred while deleting the notification" }
  }
}

