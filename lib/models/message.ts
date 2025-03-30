import { redis, generateId } from "../redis"

export interface Message {
  id: string
  content: string
  channelId: string
  userId: string
  replyToId?: string
  attachments?: string[]
  reactions?: Record<string, string[]> // emoji -> userIds
  isPinned?: boolean
  createdAt: number
  updatedAt: number
}

export interface MessageCreate {
  content: string
  channelId: string
  userId: string
  replyToId?: string
  attachments?: string[]
}

const MESSAGE_PREFIX = "message"
const CHANNEL_MESSAGES_PREFIX = "channel:messages"
const PINNED_MESSAGES_PREFIX = "channel:pinned"

export async function createMessage(data: MessageCreate): Promise<Message> {
  const id = generateId(MESSAGE_PREFIX)
  const now = Date.now()

  const message: Message = {
    id,
    content: data.content,
    channelId: data.channelId,
    userId: data.userId,
    replyToId: data.replyToId,
    attachments: data.attachments,
    reactions: {},
    isPinned: false,
    createdAt: now,
    updatedAt: now,
  }

  // Store message data
  await redis.set(`${MESSAGE_PREFIX}:${id}`, JSON.stringify(message))

  // Add message to channel's message list with score as timestamp for sorting
  await redis.zadd(`${CHANNEL_MESSAGES_PREFIX}:${data.channelId}`, now, id)

  return message
}

export async function getMessageById(id: string): Promise<Message | null> {
  const data = await redis.get(`${MESSAGE_PREFIX}:${id}`)
  return data ? JSON.parse(data as string) : null
}

export async function updateMessage(id: string, data: Partial<Message>): Promise<Message | null> {
  const message = await getMessageById(id)
  if (!message) return null

  const updatedMessage: Message = {
    ...message,
    ...data,
    updatedAt: Date.now(),
  }

  await redis.set(`${MESSAGE_PREFIX}:${id}`, JSON.stringify(updatedMessage))

  // Update pinned status if changed
  if (data.isPinned !== undefined && data.isPinned !== message.isPinned) {
    if (data.isPinned) {
      await redis.sadd(`${PINNED_MESSAGES_PREFIX}:${message.channelId}`, id)
    } else {
      await redis.srem(`${PINNED_MESSAGES_PREFIX}:${message.channelId}`, id)
    }
  }

  return updatedMessage
}

export async function deleteMessage(id: string): Promise<boolean> {
  const message = await getMessageById(id)
  if (!message) return false

  // Remove message from channel's message list
  await redis.zrem(`${CHANNEL_MESSAGES_PREFIX}:${message.channelId}`, id)

  // Remove from pinned messages if pinned
  if (message.isPinned) {
    await redis.srem(`${PINNED_MESSAGES_PREFIX}:${message.channelId}`, id)
  }

  // Delete message
  await redis.del(`${MESSAGE_PREFIX}:${id}`)

  return true
}

export async function getChannelMessages(channelId: string, limit = 50, before?: number): Promise<Message[]> {
  const max = before || "+inf"
  const min = "-inf"

  // Get message IDs sorted by timestamp (newest first)
  const messageIds = await redis.zrevrangebyscore(
    `${CHANNEL_MESSAGES_PREFIX}:${channelId}`,
    max,
    min,
    "LIMIT",
    0,
    limit,
  )

  if (messageIds.length === 0) return []

  const messages = await Promise.all(
    messageIds.map(async (id) => {
      return getMessageById(id as string)
    }),
  )

  return messages.filter(Boolean) as Message[]
}

export async function getPinnedMessages(channelId: string): Promise<Message[]> {
  const messageIds = await redis.smembers(`${PINNED_MESSAGES_PREFIX}:${channelId}`)
  if (messageIds.length === 0) return []

  const messages = await Promise.all(
    messageIds.map(async (id) => {
      return getMessageById(id as string)
    }),
  )

  return messages.filter(Boolean) as Message[]
}

export async function addReaction(messageId: string, emoji: string, userId: string): Promise<Message | null> {
  const message = await getMessageById(messageId)
  if (!message) return null

  const reactions = { ...message.reactions } || {}

  // Initialize emoji reactions array if it doesn't exist
  if (!reactions[emoji]) {
    reactions[emoji] = []
  }

  // Add user to reaction if not already added
  if (!reactions[emoji].includes(userId)) {
    reactions[emoji].push(userId)
  }

  return updateMessage(messageId, { reactions })
}

export async function removeReaction(messageId: string, emoji: string, userId: string): Promise<Message | null> {
  const message = await getMessageById(messageId)
  if (!message) return null

  const reactions = { ...message.reactions } || {}

  // Return early if emoji doesn't exist
  if (!reactions[emoji]) {
    return message
  }

  // Remove user from reaction
  reactions[emoji] = reactions[emoji].filter((id) => id !== userId)

  // Remove emoji if no users left
  if (reactions[emoji].length === 0) {
    delete reactions[emoji]
  }

  return updateMessage(messageId, { reactions })
}

