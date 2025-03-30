"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "../auth/actions"
import { getUserByEmail } from "@/lib/models/user"
import {
  createFriendRequest,
  getFriendship,
  acceptFriendRequest,
  rejectFriendRequest,
  blockUser,
  unblockUser,
  type Friendship,
} from "@/lib/models/friendship"
import { createNotification } from "@/lib/models/notification"

export async function sendFriendRequestAction(
  formData: FormData,
): Promise<{ success: boolean; error?: string; friendship?: Friendship }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to send friend requests" }
  }

  const email = formData.get("email") as string

  if (!email) {
    return { success: false, error: "Email is required" }
  }

  try {
    // Cannot send friend request to yourself
    if (email === user.email) {
      return { success: false, error: "You cannot send a friend request to yourself" }
    }

    const friend = await getUserByEmail(email)

    if (!friend) {
      return { success: false, error: "User not found" }
    }

    // Check if friendship already exists
    const existingFriendship = await getFriendship(user.id, friend.id)

    if (existingFriendship) {
      if (existingFriendship.status === "accepted") {
        return { success: false, error: "You are already friends with this user" }
      } else if (existingFriendship.status === "pending") {
        return { success: false, error: "Friend request already sent" }
      } else if (existingFriendship.status === "blocked") {
        return { success: false, error: "You cannot send a friend request to this user" }
      }
    }

    const friendship = await createFriendRequest(user.id, friend.id)

    // Create notification for the friend
    await createNotification({
      userId: friend.id,
      type: "friend_request",
      title: "Friend Request",
      message: `${user.name} sent you a friend request`,
      sourceId: friendship.id,
      sourceType: "friendship",
    })

    revalidatePath("/friends")

    return { success: true, friendship }
  } catch (error) {
    console.error("Send friend request error:", error)
    return { success: false, error: "An error occurred while sending the friend request" }
  }
}

export async function acceptFriendRequestAction(
  friendshipId: string,
): Promise<{ success: boolean; error?: string; friendship?: Friendship }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to accept friend requests" }
  }

  try {
    const friendship = await acceptFriendRequest(friendshipId)

    if (!friendship) {
      return { success: false, error: "Friend request not found" }
    }

    // Create notification for the requester
    await createNotification({
      userId: friendship.userId,
      type: "friend_request",
      title: "Friend Request Accepted",
      message: `${user.name} accepted your friend request`,
      sourceId: friendship.id,
      sourceType: "friendship",
    })

    revalidatePath("/friends")

    return { success: true, friendship }
  } catch (error) {
    console.error("Accept friend request error:", error)
    return { success: false, error: "An error occurred while accepting the friend request" }
  }
}

export async function rejectFriendRequestAction(friendshipId: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to reject friend requests" }
  }

  try {
    await rejectFriendRequest(friendshipId)

    revalidatePath("/friends")

    return { success: true }
  } catch (error) {
    console.error("Reject friend request error:", error)
    return { success: false, error: "An error occurred while rejecting the friend request" }
  }
}

export async function blockUserAction(
  userId: string,
): Promise<{ success: boolean; error?: string; friendship?: Friendship }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to block users" }
  }

  try {
    const friendship = await blockUser(user.id, userId)

    revalidatePath("/friends")

    return { success: true, friendship }
  } catch (error) {
    console.error("Block user error:", error)
    return { success: false, error: "An error occurred while blocking the user" }
  }
}

export async function unblockUserAction(userId: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to unblock users" }
  }

  try {
    await unblockUser(user.id, userId)

    revalidatePath("/friends")

    return { success: true }
  } catch (error) {
    console.error("Unblock user error:", error)
    return { success: false, error: "An error occurred while unblocking the user" }
  }
}

