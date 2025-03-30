"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCurrentUser } from "../auth/actions"
import { getWorkspaceById } from "@/lib/models/workspace"
import {
  createChannel,
  getChannelById,
  updateChannel,
  deleteChannel,
  type Channel,
  type ChannelType,
} from "@/lib/models/channel"

export async function createChannelAction(
  workspaceId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string; channel?: Channel }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to create a channel" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const type = (formData.get("type") as ChannelType) || "text"

  if (!name) {
    return { success: false, error: "Channel name is required" }
  }

  try {
    const workspace = await getWorkspaceById(workspaceId)

    if (!workspace) {
      return { success: false, error: "Workspace not found" }
    }

    if (!workspace.members.includes(user.id)) {
      return { success: false, error: "You do not have permission to create channels in this workspace" }
    }

    const channel = await createChannel({
      name,
      description,
      workspaceId,
      type,
    })

    revalidatePath(`/workspaces/${workspaceId}`)

    return { success: true, channel }
  } catch (error) {
    console.error("Create channel error:", error)
    return { success: false, error: "An error occurred while creating the channel" }
  }
}

export async function updateChannelAction(
  channelId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string; channel?: Channel }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to update a channel" }
  }

  try {
    const channel = await getChannelById(channelId)

    if (!channel) {
      return { success: false, error: "Channel not found" }
    }

    const workspace = await getWorkspaceById(channel.workspaceId)

    if (!workspace) {
      return { success: false, error: "Workspace not found" }
    }

    if (workspace.ownerId !== user.id) {
      return { success: false, error: "You do not have permission to update this channel" }
    }

    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (!name) {
      return { success: false, error: "Channel name is required" }
    }

    const updatedChannel = await updateChannel(channelId, {
      name,
      description,
    })

    revalidatePath(`/workspaces/${channel.workspaceId}/channels/${channelId}`)

    return { success: true, channel: updatedChannel }
  } catch (error) {
    console.error("Update channel error:", error)
    return { success: false, error: "An error occurred while updating the channel" }
  }
}

export async function deleteChannelAction(channelId: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to delete a channel" }
  }

  try {
    const channel = await getChannelById(channelId)

    if (!channel) {
      return { success: false, error: "Channel not found" }
    }

    const workspace = await getWorkspaceById(channel.workspaceId)

    if (!workspace) {
      return { success: false, error: "Workspace not found" }
    }

    if (workspace.ownerId !== user.id) {
      return { success: false, error: "You do not have permission to delete this channel" }
    }

    await deleteChannel(channelId)

    revalidatePath(`/workspaces/${channel.workspaceId}`)
    redirect(`/workspaces/${channel.workspaceId}`)

    return { success: true }
  } catch (error) {
    console.error("Delete channel error:", error)
    return { success: false, error: "An error occurred while deleting the channel" }
  }
}

