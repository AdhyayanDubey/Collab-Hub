"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "../auth/actions"
import { getChannelById } from "@/lib/models/channel"
import { getUserById } from "@/lib/models/user"
import {
  createMessage,
  getMessageById,
  updateMessage,
  deleteMessage,
  addReaction,
  removeReaction,
  type Message,
} from "@/lib/models/message"
import { createNotification } from "@/lib/models/notification"

export async function sendMessageAction(
  channelId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string; message?: Message }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to send a message" }
  }

  const content = formData.get("content") as string
  const replyToId = (formData.get("replyToId") as string) || undefined

  if (!content) {
    return { success: false, error: "Message content is required" }
  }

  try {
    const channel = await getChannelById(channelId)

    if (!channel) {
      return { success: false, error: "Channel not found" }
    }

    const message = await createMessage({
      content,
      channelId,
      userId: user.id,
      replyToId,
    })

    // Check for mentions in the message
    const mentionRegex = /@(\w+)/g
    const mentions = content.match(mentionRegex)

    if (mentions) {
      // Process each mention
      for (const mention of mentions) {
        const username = mention.substring(1) // Remove the @ symbol

        // In a real app, you would look up users by username
        // For demo purposes, we'll just assume the username is the user ID
        const mentionedUser = await getUserById(username)

        if (mentionedUser) {
          // Create a notification for the mentioned user
          await createNotification({
            userId: mentionedUser.id,
            type: "mention",
            title: "You were mentioned",
            message: `${user.name} mentioned you in ${channel.name}`,
            sourceId: message.id,
            sourceType: "message",
          })
        }
      }
    }

    revalidatePath(`/workspaces/${channel.workspaceId}/channels/${channelId}`)

    return { success: true, message }
  } catch (error) {
    console.error("Send message error:", error)
    return { success: false, error: "An error occurred while sending the message" }
  }
}

export async function editMessageAction(
  messageId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string; message?: Message }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to edit a message" }
  }

  const content = formData.get("content") as string

  if (!content) {
    return { success: false, error: "Message content is required" }
  }

  try {
    const message = await getMessageById(messageId)

    if (!message) {
      return { success: false, error: "Message not found" }
    }

    if (message.userId !== user.id) {
      return { success: false, error: "You do not have permission to edit this message" }
    }

    const updatedMessage = await updateMessage(messageId, {
      content,
    })

    const channel = await getChannelById(message.channelId)

    if (channel) {
      revalidatePath(`/workspaces/${channel.workspaceId}/channels/${message.channelId}`)
    }

    return { success: true, message: updatedMessage }
  } catch (error) {
    console.error("Edit message error:", error)
    return { success: false, error: "An error occurred while editing the message" }
  }
}

export async function deleteMessageAction(messageId: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to delete a message" }
  }

  try {
    const message = await getMessageById(messageId)

    if (!message) {
      return { success: false, error: "Message not found" }
    }

    if (message.userId !== user.id) {
      return { success: false, error: "You do not have permission to delete this message" }
    }

    await deleteMessage(messageId)

    const channel = await getChannelById(message.channelId)

    if (channel) {
      revalidatePath(`/workspaces/${channel.workspaceId}/channels/${message.channelId}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Delete message error:", error)
    return { success: false, error: "An error occurred while deleting the message" }
  }
}

export async function togglePinMessageAction(
  messageId: string,
): Promise<{ success: boolean; error?: string; message?: Message }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to pin a message" }
  }

  try {
    const message = await getMessageById(messageId)

    if (!message) {
      return { success: false, error: "Message not found" }
    }

    const channel = await getChannelById(message.channelId)

    if (!channel) {
      return { success: false, error: "Channel not found" }
    }

    const updatedMessage = await updateMessage(messageId, {
      isPinned: !message.isPinned,
    })

    revalidatePath(`/workspaces/${channel.workspaceId}/channels/${message.channelId}`)

    return { success: true, message: updatedMessage }
  } catch (error) {
    console.error("Toggle pin message error:", error)
    return { success: false, error: "An error occurred while toggling pin status" }
  }
}

export async function addReactionAction(
  messageId: string,
  emoji: string,
): Promise<{ success: boolean; error?: string; message?: Message }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to react to a message" }
  }

  try {
    const message = await getMessageById(messageId)

    if (!message) {
      return { success: false, error: "Message not found" }
    }

    const updatedMessage = await addReaction(messageId, emoji, user.id)

    const channel = await getChannelById(message.channelId)

    if (channel) {
      revalidatePath(`/workspaces/${channel.workspaceId}/channels/${message.channelId}`)
    }

    // Notify the message author about the reaction if it's not their own message
    if (message.userId !== user.id) {
      await createNotification({
        userId: message.userId,
        type: "reaction",
        title: "New reaction",
        message: `${user.name} reacted with ${emoji} to your message`,
        sourceId: messageId,
        sourceType: "message",
      })
    }

    return { success: true, message: updatedMessage }
  } catch (error) {
    console.error("Add reaction error:", error)
    return { success: false, error: "An error occurred while adding the reaction" }
  }
}

export async function removeReactionAction(
  messageId: string,
  emoji: string,
): Promise<{ success: boolean; error?: string; message?: Message }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to remove a reaction" }
  }

  try {
    const message = await getMessageById(messageId)

    if (!message) {
      return { success: false, error: "Message not found" }
    }

    const updatedMessage = await removeReaction(messageId, emoji, user.id)

    const channel = await getChannelById(message.channelId)

    if (channel) {
      revalidatePath(`/workspaces/${channel.workspaceId}/channels/${message.channelId}`)
    }

    return { success: true, message: updatedMessage }
  } catch (error) {
    console.error("Remove reaction error:", error)
    return { success: false, error: "An error occurred while removing the reaction" }
  }
}

