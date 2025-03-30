import { redis, generateId } from "../redis"

export type FriendshipStatus = "pending" | "accepted" | "rejected" | "blocked"

export interface Friendship {
  id: string
  userId: string
  friendId: string
  status: FriendshipStatus
  createdAt: number
  updatedAt: number
}

const FRIENDSHIP_PREFIX = "friendship"
const USER_FRIENDS_PREFIX = "user:friends"
const USER_PENDING_PREFIX = "user:pending"
const USER_BLOCKED_PREFIX = "user:blocked"

export async function createFriendRequest(userId: string, friendId: string): Promise<Friendship> {
  // Check if friendship already exists
  const existing = await getFriendship(userId, friendId)
  if (existing) {
    throw new Error("Friendship already exists")
  }

  const id = generateId(FRIENDSHIP_PREFIX)
  const now = Date.now()

  const friendship: Friendship = {
    id,
    userId,
    friendId,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  }

  // Store friendship data
  await redis.set(`${FRIENDSHIP_PREFIX}:${id}`, JSON.stringify(friendship))

  // Add to pending requests for the friend
  await redis.sadd(`${USER_PENDING_PREFIX}:${friendId}`, id)

  return friendship
}

export async function getFriendship(userId: string, friendId: string): Promise<Friendship | null> {
  // Check both directions
  const userFriends = await redis.smembers(`${USER_FRIENDS_PREFIX}:${userId}`)
  const friendFriends = await redis.smembers(`${USER_FRIENDS_PREFIX}:${friendId}`)
  const userPending = await redis.smembers(`${USER_PENDING_PREFIX}:${userId}`)
  const friendPending = await redis.smembers(`${USER_PENDING_PREFIX}:${friendId}`)
  const userBlocked = await redis.smembers(`${USER_BLOCKED_PREFIX}:${userId}`)
  const friendBlocked = await redis.smembers(`${USER_BLOCKED_PREFIX}:${friendId}`)

  const allIds = [...userFriends, ...friendFriends, ...userPending, ...friendPending, ...userBlocked, ...friendBlocked]

  if (allIds.length === 0) return null

  const friendships = await Promise.all(
    allIds.map(async (id) => {
      const data = await redis.get(`${FRIENDSHIP_PREFIX}:${id}`)
      return data ? (JSON.parse(data as string) as Friendship) : null
    }),
  )

  // Find friendship between these users
  return (
    friendships.find(
      (f) =>
        f && ((f.userId === userId && f.friendId === friendId) || (f.userId === friendId && f.friendId === userId)),
    ) || null
  )
}

export async function updateFriendshipStatus(id: string, status: FriendshipStatus): Promise<Friendship | null> {
  const data = await redis.get(`${FRIENDSHIP_PREFIX}:${id}`)
  if (!data) return null

  const friendship = JSON.parse(data as string) as Friendship
  const oldStatus = friendship.status

  const updatedFriendship: Friendship = {
    ...friendship,
    status,
    updatedAt: Date.now(),
  }

  // Update friendship data
  await redis.set(`${FRIENDSHIP_PREFIX}:${id}`, JSON.stringify(updatedFriendship))

  // Update indexes based on status change
  if (oldStatus !== status) {
    // Remove from old status lists
    if (oldStatus === "pending") {
      await redis.srem(`${USER_PENDING_PREFIX}:${friendship.friendId}`, id)
    } else if (oldStatus === "accepted") {
      await redis.srem(`${USER_FRIENDS_PREFIX}:${friendship.userId}`, id)
      await redis.srem(`${USER_FRIENDS_PREFIX}:${friendship.friendId}`, id)
    } else if (oldStatus === "blocked") {
      await redis.srem(`${USER_BLOCKED_PREFIX}:${friendship.userId}`, id)
    }

    // Add to new status lists
    if (status === "accepted") {
      await redis.sadd(`${USER_FRIENDS_PREFIX}:${friendship.userId}`, id)
      await redis.sadd(`${USER_FRIENDS_PREFIX}:${friendship.friendId}`, id)
    } else if (status === "blocked") {
      await redis.sadd(`${USER_BLOCKED_PREFIX}:${friendship.userId}`, id)
    }
  }

  return updatedFriendship
}

export async function acceptFriendRequest(id: string): Promise<Friendship | null> {
  return updateFriendshipStatus(id, "accepted")
}

export async function rejectFriendRequest(id: string): Promise<Friendship | null> {
  return updateFriendshipStatus(id, "rejected")
}

export async function blockUser(userId: string, blockedId: string): Promise<Friendship | null> {
  // Check if friendship exists
  let friendship = await getFriendship(userId, blockedId)

  if (friendship) {
    // Update existing friendship to blocked
    return updateFriendshipStatus(friendship.id, "blocked")
  } else {
    // Create new blocked friendship
    const id = generateId(FRIENDSHIP_PREFIX)
    const now = Date.now()

    friendship = {
      id,
      userId,
      friendId: blockedId,
      status: "blocked",
      createdAt: now,
      updatedAt: now,
    }

    // Store friendship data
    await redis.set(`${FRIENDSHIP_PREFIX}:${id}`, JSON.stringify(friendship))

    // Add to blocked list
    await redis.sadd(`${USER_BLOCKED_PREFIX}:${userId}`, id)

    return friendship
  }
}

export async function unblockUser(userId: string, blockedId: string): Promise<boolean> {
  const friendship = await getFriendship(userId, blockedId)

  if (!friendship || friendship.status !== "blocked") {
    return false
  }

  // Delete the friendship
  await redis.del(`${FRIENDSHIP_PREFIX}:${friendship.id}`)
  await redis.srem(`${USER_BLOCKED_PREFIX}:${userId}`, friendship.id)

  return true
}

export async function getUserFriends(userId: string): Promise<Friendship[]> {
  const friendshipIds = await redis.smembers(`${USER_FRIENDS_PREFIX}:${userId}`)
  if (friendshipIds.length === 0) return []

  const friendships = await Promise.all(
    friendshipIds.map(async (id) => {
      const data = await redis.get(`${FRIENDSHIP_PREFIX}:${id}`)
      return data ? (JSON.parse(data as string) as Friendship) : null
    }),
  )

  return friendships.filter(Boolean) as Friendship[]
}

export async function getPendingFriendRequests(userId: string): Promise<Friendship[]> {
  const friendshipIds = await redis.smembers(`${USER_PENDING_PREFIX}:${userId}`)
  if (friendshipIds.length === 0) return []

  const friendships = await Promise.all(
    friendshipIds.map(async (id) => {
      const data = await redis.get(`${FRIENDSHIP_PREFIX}:${id}`)
      return data ? (JSON.parse(data as string) as Friendship) : null
    }),
  )

  return friendships.filter(Boolean) as Friendship[]
}

export async function getBlockedUsers(userId: string): Promise<Friendship[]> {
  const friendshipIds = await redis.smembers(`${USER_BLOCKED_PREFIX}:${userId}`)
  if (friendshipIds.length === 0) return []

  const friendships = await Promise.all(
    friendshipIds.map(async (id) => {
      const data = await redis.get(`${FRIENDSHIP_PREFIX}:${id}`)
      return data ? (JSON.parse(data as string) as Friendship) : null
    }),
  )

  return friendships.filter(Boolean) as Friendship[]
}

