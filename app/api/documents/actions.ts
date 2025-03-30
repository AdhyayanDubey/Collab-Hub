"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCurrentUser } from "../auth/actions"
import { getWorkspaceById } from "@/lib/models/workspace"
import { getChannelById } from "@/lib/models/channel"
import {
  createDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
  addCollaborator,
  removeCollaborator,
  type Document,
} from "@/lib/models/document"
import { createNotification } from "@/lib/models/notification"
import { redis } from "@/lib/redis"

export async function createDocumentAction(
  workspaceId: string,
  channelId: string | undefined,
  formData: FormData,
): Promise<{ success: boolean; error?: string; document?: Document }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to create a document" }
  }

  const title = formData.get("title") as string
  const content = (formData.get("content") as string) || ""

  if (!title) {
    return { success: false, error: "Document title is required" }
  }

  try {
    const workspace = await getWorkspaceById(workspaceId)

    if (!workspace) {
      return { success: false, error: "Workspace not found" }
    }

    if (!workspace.members.includes(user.id)) {
      return { success: false, error: "You do not have permission to create documents in this workspace" }
    }

    // If channelId is provided, verify it exists and belongs to the workspace
    if (channelId) {
      const channel = await getChannelById(channelId)

      if (!channel || channel.workspaceId !== workspaceId) {
        return { success: false, error: "Invalid channel" }
      }
    }

    const document = await createDocument({
      title,
      content,
      channelId,
      workspaceId,
      createdBy: user.id,
    })

    if (channelId) {
      revalidatePath(`/workspaces/${workspaceId}/channels/${channelId}`)
    } else {
      revalidatePath(`/workspaces/${workspaceId}`)
    }

    return { success: true, document }
  } catch (error) {
    console.error("Create document error:", error)
    return { success: false, error: "An error occurred while creating the document" }
  }
}

export async function updateDocumentAction(
  documentId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string; document?: Document }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to update a document" }
  }

  try {
    const document = await getDocumentById(documentId)

    if (!document) {
      return { success: false, error: "Document not found" }
    }

    if (!document.collaborators.includes(user.id)) {
      return { success: false, error: "You do not have permission to edit this document" }
    }

    const title = formData.get("title") as string
    const content = formData.get("content") as string

    if (!title) {
      return { success: false, error: "Document title is required" }
    }

    const updatedDocument = await updateDocument(documentId, {
      title,
      content,
    })

    if (document.channelId) {
      revalidatePath(`/workspaces/${document.workspaceId}/channels/${document.channelId}`)
    }
    revalidatePath(`/documents/${documentId}`)

    return { success: true, document: updatedDocument }
  } catch (error) {
    console.error("Update document error:", error)
    return { success: false, error: "An error occurred while updating the document" }
  }
}

export async function deleteDocumentAction(documentId: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to delete a document" }
  }

  try {
    const document = await getDocumentById(documentId)

    if (!document) {
      return { success: false, error: "Document not found" }
    }

    if (document.createdBy !== user.id) {
      return { success: false, error: "You do not have permission to delete this document" }
    }

    await deleteDocument(documentId)

    if (document.channelId) {
      revalidatePath(`/workspaces/${document.workspaceId}/channels/${document.channelId}`)
      redirect(`/workspaces/${document.workspaceId}/channels/${document.channelId}`)
    } else {
      revalidatePath(`/workspaces/${document.workspaceId}`)
      redirect(`/workspaces/${document.workspaceId}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Delete document error:", error)
    return { success: false, error: "An error occurred while deleting the document" }
  }
}

export async function addCollaboratorAction(
  documentId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to add collaborators" }
  }

  const email = formData.get("email") as string

  if (!email) {
    return { success: false, error: "Email is required" }
  }

  try {
    const document = await getDocumentById(documentId)

    if (!document) {
      return { success: false, error: "Document not found" }
    }

    if (document.createdBy !== user.id) {
      return { success: false, error: "You do not have permission to add collaborators to this document" }
    }

    // In a real app, you would send an email invitation
    // For demo purposes, we'll just add the user if they exist
    const collaborator = await getUserByEmail(email)

    if (!collaborator) {
      return { success: false, error: "User not found" }
    }

    await addCollaborator(documentId, collaborator.id)

    // Create notification for the collaborator
    await createNotification({
      userId: collaborator.id,
      type: "document_share",
      title: "Document Shared",
      message: `${user.name} has shared the document "${document.title}" with you`,
      sourceId: documentId,
      sourceType: "document",
    })

    revalidatePath(`/documents/${documentId}`)

    return { success: true }
  } catch (error) {
    console.error("Add collaborator error:", error)
    return { success: false, error: "An error occurred while adding the collaborator" }
  }
}

export async function removeCollaboratorAction(
  documentId: string,
  collaboratorId: string,
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to remove collaborators" }
  }

  try {
    const document = await getDocumentById(documentId)

    if (!document) {
      return { success: false, error: "Document not found" }
    }

    if (document.createdBy !== user.id) {
      return { success: false, error: "You do not have permission to remove collaborators from this document" }
    }

    await removeCollaborator(documentId, collaboratorId)

    revalidatePath(`/documents/${documentId}`)

    return { success: true }
  } catch (error) {
    console.error("Remove collaborator error:", error)
    return { success: false, error: "An error occurred while removing the collaborator" }
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

