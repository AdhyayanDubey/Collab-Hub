"use client"

import { useEffect, useState } from "react"
import { WorkspaceHeader } from "@/components/workspace-header"
import { WorkspaceHome } from "@/components/workspace-home"

interface WorkspacePageProps {
  params: {
    workspaceId: string
  }
}

// Mock data for workspace
const MOCK_WORKSPACE_DATA = {
  ws1: {
    id: "ws1",
    name: "Design Team",
    description: "Collaborative workspace for the design team",
    members: 8,
    avatar: "/placeholder.svg?height=40&width=40",
    color: "#10b981",
    recentActivity: "2 hours ago",
  },
  ws2: {
    id: "ws2",
    name: "Marketing",
    description: "Marketing team workspace",
    members: 12,
    avatar: "/placeholder.svg?height=40&width=40",
    color: "#3b82f6",
    recentActivity: "1 day ago",
  },
  ws3: {
    id: "ws3",
    name: "Product Development",
    description: "Product roadmap and development discussions",
    members: 15,
    avatar: "/placeholder.svg?height=40&width=40",
    color: "#8b5cf6",
    recentActivity: "3 hours ago",
  },
  ws4: {
    id: "ws4",
    name: "Customer Support",
    description: "Support team collaboration",
    members: 6,
    avatar: "/placeholder.svg?height=40&width=40",
    color: "#f59e0b",
    recentActivity: "Just now",
  },
}

export default function WorkspacePage({ params }: WorkspacePageProps) {
  const [workspace, setWorkspace] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch workspace data
    setTimeout(() => {
      setWorkspace(MOCK_WORKSPACE_DATA[params.workspaceId as keyof typeof MOCK_WORKSPACE_DATA])
      setIsLoading(false)
    }, 500)
  }, [params.workspaceId])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Workspace not found</h2>
          <p className="text-muted-foreground mt-2">
            The workspace you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <WorkspaceHeader workspace={workspace} />
      <WorkspaceHome workspace={workspace} />
    </>
  )
}

