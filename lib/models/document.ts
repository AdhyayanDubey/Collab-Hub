import { redis, generateId } from "../redis"

export interface Document {
  id: string
  title: string
  content: string
  channelId?: string
  workspaceId: string
  createdBy: string
  collaborators: string[] // User IDs
  createdAt: number
  updatedAt: number
}

export interface DocumentCreate {
  title: string
  content: string
  channelId?: string
  workspaceId: string
  createdBy: string
}

const DOCUMENT_PREFIX = "document"
const WORKSPACE_DOCUMENTS_PREFIX = "workspace:documents"
const CHANNEL_DOCUMENTS_PREFIX = "channel:documents"
const USER_DOCUMENTS_PREFIX = "user:documents"

export async function createDocument(data: DocumentCreate): Promise<Document> {
  const id = generateId(DOCUMENT_PREFIX)
  const now = Date.now()

  const document: Document = {
    id,
    title: data.title,
    content: data.content,
    channelId: data.channelId,
    workspaceId: data.workspaceId,
    createdBy: data.createdBy,
    collaborators: [data.createdBy], // Creator is automatically a collaborator
    createdAt: now,
    updatedAt: now,
  }

  // Store document data
  await redis.set(`${DOCUMENT_PREFIX}:${id}`, JSON.stringify(document))

  // Add document to workspace's document list
  await redis.sadd(`${WORKSPACE_DOCUMENTS_PREFIX}:${data.workspaceId}`, id)

  // Add document to channel's document list if channel provided
  if (data.channelId) {
    await redis.sadd(`${CHANNEL_DOCUMENTS_PREFIX}:${data.channelId}`, id)
  }

  // Add document to creator's document list
  await redis.sadd(`${USER_DOCUMENTS_PREFIX}:${data.createdBy}`, id)

  return document
}

export async function getDocumentById(id: string): Promise<Document | null> {
  const data = await redis.get(`${DOCUMENT_PREFIX}:${id}`)
  return data ? JSON.parse(data as string) : null
}

export async function updateDocument(id: string, data: Partial<Document>): Promise<Document | null> {
  const document = await getDocumentById(id)
  if (!document) return null

  const updatedDocument: Document = {
    ...document,
    ...data,
    updatedAt: Date.now(),
  }

  await redis.set(`${DOCUMENT_PREFIX}:${id}`, JSON.stringify(updatedDocument))

  return updatedDocument
}

export async function deleteDocument(id: string): Promise<boolean> {
  const document = await getDocumentById(id)
  if (!document) return false

  // Remove document from workspace's document list
  await redis.srem(`${WORKSPACE_DOCUMENTS_PREFIX}:${document.workspaceId}`, id)

  // Remove document from channel's document list if associated with a channel
  if (document.channelId) {
    await redis.srem(`${CHANNEL_DOCUMENTS_PREFIX}:${document.channelId}`, id)
  }

  // Remove document from all collaborators' document lists
  await Promise.all(
    document.collaborators.map(async (userId) => {
      await redis.srem(`${USER_DOCUMENTS_PREFIX}:${userId}`, id)
    }),
  )

  // Delete document
  await redis.del(`${DOCUMENT_PREFIX}:${id}`)

  return true
}

export async function getWorkspaceDocuments(workspaceId: string): Promise<Document[]> {
  const documentIds = await redis.smembers(`${WORKSPACE_DOCUMENTS_PREFIX}:${workspaceId}`)
  if (documentIds.length === 0) return []

  const documents = await Promise.all(
    documentIds.map(async (id) => {
      return getDocumentById(id as string)
    }),
  )

  return documents.filter(Boolean) as Document[]
}

export async function getChannelDocuments(channelId: string): Promise<Document[]> {
  const documentIds = await redis.smembers(`${CHANNEL_DOCUMENTS_PREFIX}:${channelId}`)
  if (documentIds.length === 0) return []

  const documents = await Promise.all(
    documentIds.map(async (id) => {
      return getDocumentById(id as string)
    }),
  )

  return documents.filter(Boolean) as Document[]
}

export async function getUserDocuments(userId: string): Promise<Document[]> {
  const documentIds = await redis.smembers(`${USER_DOCUMENTS_PREFIX}:${userId}`)
  if (documentIds.length === 0) return []

  const documents = await Promise.all(
    documentIds.map(async (id) => {
      return getDocumentById(id as string)
    }),
  )

  return documents.filter(Boolean) as Document[]
}

export async function addCollaborator(documentId: string, userId: string): Promise<Document | null> {
  const document = await getDocumentById(documentId)
  if (!document) return null

  // Check if user is already a collaborator
  if (document.collaborators.includes(userId)) {
    return document
  }

  // Add user to document collaborators
  const updatedDocument = await updateDocument(documentId, {
    collaborators: [...document.collaborators, userId],
  })

  // Add document to user's document list
  await redis.sadd(`${USER_DOCUMENTS_PREFIX}:${userId}`, documentId)

  return updatedDocument
}

export async function removeCollaborator(documentId: string, userId: string): Promise<Document | null> {
  const document = await getDocumentById(documentId)
  if (!document) return null

  // Cannot remove the creator
  if (document.createdBy === userId) {
    return document
  }

  // Remove user from document collaborators
  const updatedDocument = await updateDocument(documentId, {
    collaborators: document.collaborators.filter((id) => id !== userId),
  })

  // Remove document from user's document list
  await redis.srem(`${USER_DOCUMENTS_PREFIX}:${userId}`, documentId)

  return updatedDocument
}

