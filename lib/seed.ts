import { redis } from "./redis"
import { createUser } from "./models/user"
import { createWorkspace, addMemberToWorkspace } from "./models/workspace"
import { createChannel } from "./models/channel"
import { createMessage } from "./models/message"
import { createDocument } from "./models/document"
import { createFriendRequest, acceptFriendRequest } from "./models/friendship"
import { createNotification } from "./models/notification"

export async function seed() {
  console.log("Seeding database...")

  // Clear existing data
  const keys = await redis.keys("*")
  if (keys.length > 0) {
    await redis.del(keys)
  }

  // Create users
  const alice = await createUser({
    name: "Alice Smith",
    email: "alice@example.com",
    image: "/placeholder.svg?height=200&width=200&text=A",
  })

  const bob = await createUser({
    name: "Bob Johnson",
    email: "bob@example.com",
    image: "/placeholder.svg?height=200&width=200&text=B",
  })

  const charlie = await createUser({
    name: "Charlie Brown",
    email: "charlie@example.com",
    image: "/placeholder.svg?height=200&width=200&text=C",
  })

  // Create workspaces
  const designWorkspace = await createWorkspace({
    name: "Design Team",
    description: "Workspace for the design team",
    ownerId: alice.id,
    image: "/placeholder.svg?height=200&width=200&text=D",
  })

  const devWorkspace = await createWorkspace({
    name: "Development Team",
    description: "Workspace for the development team",
    ownerId: bob.id,
    image: "/placeholder.svg?height=200&width=200&text=D",
  })

  // Add members to workspaces
  await addMemberToWorkspace(designWorkspace.id, bob.id)
  await addMemberToWorkspace(designWorkspace.id, charlie.id)
  await addMemberToWorkspace(devWorkspace.id, alice.id)
  await addMemberToWorkspace(devWorkspace.id, charlie.id)

  // Create channels
  const generalChannel = await createChannel({
    name: "general",
    description: "General discussion",
    workspaceId: designWorkspace.id,
    type: "text",
  })

  const designChannel = await createChannel({
    name: "design-ideas",
    description: "Share design ideas and feedback",
    workspaceId: designWorkspace.id,
    type: "text",
  })

  const voiceChannel = await createChannel({
    name: "voice-chat",
    description: "Voice discussions",
    workspaceId: designWorkspace.id,
    type: "voice",
  })

  const docsChannel = await createChannel({
    name: "documentation",
    description: "Project documentation",
    workspaceId: designWorkspace.id,
    type: "document",
  })

  // Create messages
  await createMessage({
    content: "Welcome to the Design Team workspace!",
    channelId: generalChannel.id,
    userId: alice.id,
  })

  await createMessage({
    content: "Thanks for the invite!",
    channelId: generalChannel.id,
    userId: bob.id,
  })

  await createMessage({
    content: "Excited to collaborate with everyone!",
    channelId: generalChannel.id,
    userId: charlie.id,
  })

  await createMessage({
    content: "I have some new design ideas to share.",
    channelId: designChannel.id,
    userId: alice.id,
  })

  await createMessage({
    content: "Looking forward to seeing them!",
    channelId: designChannel.id,
    userId: bob.id,
  })

  // Create documents
  await createDocument({
    title: "Design System Guidelines",
    content: "# Design System Guidelines\n\nThis document outlines our design system principles and components.",
    channelId: docsChannel.id,
    workspaceId: designWorkspace.id,
    createdBy: alice.id,
  })

  await createDocument({
    title: "Project Roadmap",
    content:
      "# Project Roadmap\n\n## Q1 Goals\n- Finalize design system\n- Implement core components\n\n## Q2 Goals\n- User testing\n- Refinement based on feedback",
    channelId: docsChannel.id,
    workspaceId: designWorkspace.id,
    createdBy: bob.id,
  })

  // Create friendships
  const aliceBobFriendship = await createFriendRequest(alice.id, bob.id)
  await acceptFriendRequest(aliceBobFriendship.id)

  const aliceCharlieFriendship = await createFriendRequest(alice.id, charlie.id)
  await acceptFriendRequest(aliceCharlieFriendship.id)

  const bobCharlieFriendship = await createFriendRequest(bob.id, charlie.id)
  // Leave this one pending

  // Create notifications
  await createNotification({
    userId: charlie.id,
    type: "friend_request",
    title: "Friend Request",
    message: `${bob.name} sent you a friend request`,
    sourceId: bobCharlieFriendship.id,
    sourceType: "friendship",
  })

  await createNotification({
    userId: bob.id,
    type: "message",
    title: "New Message",
    message: `${alice.name} mentioned you in Design Team`,
    sourceId: designChannel.id,
    sourceType: "channel",
  })

  console.log("Database seeded successfully!")
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Seed error:", error)
      process.exit(1)
    })
}

