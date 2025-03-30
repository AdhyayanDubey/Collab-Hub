"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCurrentUser } from "../auth/actions"
import {
  createWorkspace,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMemberToWorkspace,
  removeMemberFromWorkspace,
  type Workspace,
} from "@/lib/models/workspace"
import { redis } from "@/lib/redis"

export async function createWorkspaceAction(
  formData: FormData,
): Promise<{ success: boolean; error?: string; workspace?: Workspace }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to create a workspace" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string

  if (!name) {
    return { success: false, error: "Workspace name is required" }
  }

  try {
    const workspace = await createWorkspace({
      name,
      description,
      ownerId: user.id,
      image: `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(name.charAt(0).toUpperCase())}`,
    })

    revalidatePath("/workspaces")

    return { success: true, workspace }
  } catch (error) {
    console.error("Create workspace error:", error)
    return { success: false, error: "An error occurred while creating the workspace" }
  }
}

export async function updateWorkspaceAction(
  workspaceId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string; workspace?: Workspace }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to update a workspace" }
  }

  try {
    const workspace = await getWorkspaceById(workspaceId)

    if (!workspace) {
      return { success: false, error: "Workspace not found" }
    }

    if (workspace.ownerId !== user.id) {
      return { success: false, error: "You do not have permission to update this workspace" }
    }

    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (!name) {
      return { success: false, error: "Workspace name is required" }
    }

    const updatedWorkspace = await updateWorkspace(workspaceId, {
      name,
      description,
    })

    revalidatePath(`/workspaces/${workspaceId}`)

    return { success: true, workspace: updatedWorkspace }
  } catch (error) {
    console.error("Update workspace error:", error)
    return { success: false, error: "An error occurred while updating the workspace" }
  }
}

export async function deleteWorkspaceAction(workspaceId: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to delete a workspace" }
  }

  try {
    const workspace = await getWorkspaceById(workspaceId)

    if (!workspace) {
      return { success: false, error: "Workspace not found" }
    }

    if (workspace.ownerId !== user.id) {
      return { success: false, error: "You do not have permission to delete this workspace" }
    }

    await deleteWorkspace(workspaceId)

    revalidatePath("/workspaces")
    redirect("/workspaces")

    return { success: true }
  } catch (error) {
    console.error("Delete workspace error:", error)
    return { success: false, error: "An error occurred while deleting the workspace" }
  }
}

export async function inviteUserToWorkspaceAction(
  workspaceId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to invite users" }
  }

  const email = formData.get("email") as string

  if (!email) {
    return { success: false, error: "Email is required" }
  }

  try {
    const workspace = await getWorkspaceById(workspaceId)

    if (!workspace) {
      return { success: false, error: "Workspace not found" }
    }

    if (workspace.ownerId !== user.id && !workspace.members.includes(user.id)) {
      return { success: false, error: "You do not have permission to invite users to this workspace" }
    }

    // In a real app, you would send an email invitation
    // For demo purposes, we'll just add the user if they exist
    const invitedUser = await getUserByEmail(email)

    if (!invitedUser) {
      return { success: false, error: "User not found" }
    }

    await addMemberToWorkspace(workspaceId, invitedUser.id)

    // Create notification for the invited user
    await createNotification({
      userId: invitedUser.id,
      type: "workspace_invite",
      title: "Workspace Invitation",
      message: `You have been invited to join the workspace "${workspace.name}"`,
      sourceId: workspaceId,
      sourceType: "workspace",
    })

    revalidatePath(`/workspaces/${workspaceId}`)

    return { success: true }
  } catch (error) {
    console.error("Invite user error:", error)
    return { success: false, error: "An error occurred while inviting the user" }
  }
}

export async function removeUserFromWorkspaceAction(
  workspaceId: string,
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { success: false, error: "You must be logged in to remove users" }
  }

  try {
    const workspace = await getWorkspaceById(workspaceId)

    if (!workspace) {
      return { success: false, error: "Workspace not found" }
    }

    // Only the owner can remove users, or users can remove themselves
    if (workspace.ownerId !== currentUser.id && currentUser.id !== userId) {
      return { success: false, error: "You do not have permission to remove this user" }
    }

    // Cannot remove the owner
    if (workspace.ownerId === userId) {
      return { success: false, error: "Cannot remove the workspace owner" }
    }

    await removeMemberFromWorkspace(workspaceId, userId)

    revalidatePath(`/workspaces/${workspaceId}`)

    return { success: true }
  } catch (error) {
    console.error("Remove user error:", error)
    return { success: false, error: "An error occurred while removing the user" }
  }
}

// Helper function to get user by email (imported from user model)
async function getUserByEmail(email: string): Promise<User | null> {
  // This is a duplicate of the function in the user model
  // In a real app, you would import it directly
  const id = await redis.get(`user:email:${email}`)
  if (!id) return null

  return getUserById(id as string)
}

// Helper function to get user by ID (imported from user model)
async function getUserById(id: string): Promise<User | null> {
  // This is a duplicate of the function in the user model
  // In a real app, you would import it directly
  const data = await redis.get(`user:${id}`)
  return data ? JSON.parse(data as string) : null
}

// Helper function to create notification (imported from notification model)
async function createNotification(data: NotificationCreate): Promise<Notification> {
  // This is a duplicate of the function in the notification model
  // In a real app, you would import it directly
  const id = generateId("notification")
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

  await redis.set(`notification:${id}`, JSON.stringify(notification))
  await redis.zadd(`user:notifications:${data.userId}`, now, id)

  return notification
}

// Helper types (imported from models)
interface User {
  id: string
  name: string
  email: string
  image?: string
  status?: "online" | "idle" | "dnd" | "offline"
  createdAt: number
  updatedAt: number
}

interface NotificationCreate {
  userId: string
  type: string
  title: string
  message: string
  sourceId?: string
  sourceType?: string
}

interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  sourceId?: string
  sourceType?: string
  read: boolean
  createdAt: number
}

// Helper function to generate ID (imported from redis.ts)
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

