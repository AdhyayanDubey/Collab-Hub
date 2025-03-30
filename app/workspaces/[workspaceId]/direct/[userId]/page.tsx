"use client"

import { useEffect, useState } from "react"
import { DirectMessageHeader } from "@/components/direct-message-header"
import { DirectMessageContent } from "@/components/direct-message-content"

interface DirectMessagePageProps {
  params: {
    workspaceId: string
    userId: string
  }
}

// Mock data for users
const MOCK_USERS = {
  user1: {
    id: "user1",
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    title: "UI Designer",
  },
  user2: {
    id: "user2",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "idle",
    title: "Product Manager",
  },
  user3: {
    id: "user3",
    name: "Mike Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    title: "Frontend Developer",
  },
  user4: {
    id: "user4",
    name: "Sarah Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "dnd",
    title: "UX Researcher",
  },
}

export default function DirectMessagePage({ params }: DirectMessagePageProps) {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch user data
    setTimeout(() => {
      setUser(MOCK_USERS[params.userId as keyof typeof MOCK_USERS])
      setIsLoading(false)
    }, 500)
  }, [params.userId])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">User not found</h2>
          <p className="text-muted-foreground mt-2">
            The user you're looking for doesn't exist or you don't have access to message them.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <DirectMessageHeader user={user} />
      <DirectMessageContent user={user} />
    </>
  )
}

