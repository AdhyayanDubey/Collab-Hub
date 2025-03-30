import { redis, generateId } from "../redis"

export interface Workspace {
  id: string
  name: string
  description?: string
  ownerId: string
  members: string[] // User IDs
  image?: string
  createdAt: number
  updatedAt: number
}

export interface WorkspaceCreate {
  name: string
  description?: string
  ownerId: string
  image?: string
}

const WORKSPACE_PREFIX = "workspace"
const USER_WORKSPACES_PREFIX = "user:workspaces"

export async function createWorkspace(data: WorkspaceCreate): Promise<Workspace> {
  const id = generateId(WORKSPACE_PREFIX)
  const now = Date.now()

  const workspace: Workspace = {
    id,
    name: data.name,
    description: data.description,
    ownerId: data.ownerId,
    members: [data.ownerId], // Owner is automatically a member
    image: data.image,
    createdAt: now,
    updatedAt: now,
  }

  // Store workspace data
  await redis.set(`${WORKSPACE_PREFIX}:${id}`, JSON.stringify(workspace))

  // Add workspace to owner's workspace list
  await redis.sadd(`${USER_WORKSPACES_PREFIX}:${data.ownerId}`, id)

  return workspace
}

export async function getWorkspaceById(id: string): Promise<Workspace | null> {
  const data = await redis.get(`${WORKSPACE_PREFIX}:${id}`)
  return data ? JSON.parse(data as string) : null
}

export async function updateWorkspace(id: string, data: Partial<Workspace>): Promise<Workspace | null> {
  const workspace = await getWorkspaceById(id)
  if (!workspace) return null

  const updatedWorkspace: Workspace = {
    ...workspace,
    ...data,
    updatedAt: Date.now(),
  }

  await redis.set(`${WORKSPACE_PREFIX}:${id}`, JSON.stringify(updatedWorkspace))

  return updatedWorkspace
}

export async function deleteWorkspace(id: string): Promise<boolean> {
  const workspace = await getWorkspaceById(id)
  if (!workspace) return false

  // Remove workspace from all members' workspace lists
  await Promise.all(
    workspace.members.map(async (userId) => {
      await redis.srem(`${USER_WORKSPACES_PREFIX}:${userId}`, id)
    }),
  )

  // Delete workspace
  await redis.del(`${WORKSPACE_PREFIX}:${id}`)

  return true
}

export async function getUserWorkspaces(userId: string): Promise<Workspace[]> {
  const workspaceIds = await redis.smembers(`${USER_WORKSPACES_PREFIX}:${userId}`)
  if (workspaceIds.length === 0) return []

  const workspaces = await Promise.all(
    workspaceIds.map(async (id) => {
      return getWorkspaceById(id as string)
    }),
  )

  return workspaces.filter(Boolean) as Workspace[]
}

export async function addMemberToWorkspace(workspaceId: string, userId: string): Promise<Workspace | null> {
  const workspace = await getWorkspaceById(workspaceId)
  if (!workspace) return null

  // Check if user is already a member
  if (workspace.members.includes(userId)) {
    return workspace
  }

  // Add user to workspace members
  const updatedWorkspace = await updateWorkspace(workspaceId, {
    members: [...workspace.members, userId],
  })

  // Add workspace to user's workspace list
  await redis.sadd(`${USER_WORKSPACES_PREFIX}:${userId}`, workspaceId)

  return updatedWorkspace
}

export async function removeMemberFromWorkspace(workspaceId: string, userId: string): Promise<Workspace | null> {
  const workspace = await getWorkspaceById(workspaceId)
  if (!workspace) return null

  // Cannot remove the owner
  if (workspace.ownerId === userId) {
    return workspace
  }

  // Remove user from workspace members
  const updatedWorkspace = await updateWorkspace(workspaceId, {
    members: workspace.members.filter((id) => id !== userId),
  })

  // Remove workspace from user's workspace list
  await redis.srem(`${USER_WORKSPACES_PREFIX}:${userId}`, workspaceId)

  return updatedWorkspace
}

