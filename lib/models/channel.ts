import { redis, generateId } from "../redis"

export type ChannelType = "text" | "voice" | "document"

export interface Channel {
  id: string
  name: string
  description?: string
  workspaceId: string
  type: ChannelType
  createdAt: number
  updatedAt: number
}

export interface ChannelCreate {
  name: string
  description?: string
  workspaceId: string
  type: ChannelType
}

const CHANNEL_PREFIX = "channel"
const WORKSPACE_CHANNELS_PREFIX = "workspace:channels"

export async function createChannel(data: ChannelCreate): Promise<Channel> {
  const id = generateId(CHANNEL_PREFIX)
  const now = Date.now()

  const channel: Channel = {
    id,
    name: data.name,
    description: data.description,
    workspaceId: data.workspaceId,
    type: data.type,
    createdAt: now,
    updatedAt: now,
  }

  // Store channel data
  await redis.set(`${CHANNEL_PREFIX}:${id}`, JSON.stringify(channel))

  // Add channel to workspace's channel list
  await redis.sadd(`${WORKSPACE_CHANNELS_PREFIX}:${data.workspaceId}`, id)

  return channel
}

export async function getChannelById(id: string): Promise<Channel | null> {
  const data = await redis.get(`${CHANNEL_PREFIX}:${id}`)
  return data ? JSON.parse(data as string) : null
}

export async function updateChannel(id: string, data: Partial<Channel>): Promise<Channel | null> {
  const channel = await getChannelById(id)
  if (!channel) return null

  const updatedChannel: Channel = {
    ...channel,
    ...data,
    updatedAt: Date.now(),
  }

  await redis.set(`${CHANNEL_PREFIX}:${id}`, JSON.stringify(updatedChannel))

  return updatedChannel
}

export async function deleteChannel(id: string): Promise<boolean> {
  const channel = await getChannelById(id)
  if (!channel) return false

  // Remove channel from workspace's channel list
  await redis.srem(`${WORKSPACE_CHANNELS_PREFIX}:${channel.workspaceId}`, id)

  // Delete channel
  await redis.del(`${CHANNEL_PREFIX}:${id}`)

  return true
}

export async function getWorkspaceChannels(workspaceId: string): Promise<Channel[]> {
  const channelIds = await redis.smembers(`${WORKSPACE_CHANNELS_PREFIX}:${workspaceId}`)
  if (channelIds.length === 0) return []

  const channels = await Promise.all(
    channelIds.map(async (id) => {
      return getChannelById(id as string)
    }),
  )

  return channels.filter(Boolean) as Channel[]
}

