"use client"

import { useEffect, useState } from "react"
import { ChannelHeader } from "@/components/channel-header"
import { ChannelContent } from "@/components/channel-content"

interface ChannelPageProps {
  params: {
    workspaceId: string
    channelId: string
  }
}

// Mock data for channels
const MOCK_CHANNELS = {
  "general-ws1": {
    id: "general-ws1",
    name: "general",
    description: "General discussions for the Design Team",
    type: "text",
    workspaceId: "ws1",
  },
  "announcements-ws1": {
    id: "announcements-ws1",
    name: "announcements",
    description: "Important announcements for the team",
    type: "text",
    workspaceId: "ws1",
  },
  "resources-ws1": {
    id: "resources-ws1",
    name: "resources",
    description: "Design resources and assets",
    type: "text",
    workspaceId: "ws1",
  },
  "design-reviews-ws1": {
    id: "design-reviews-ws1",
    name: "design-reviews",
    description: "Channel for design review discussions",
    type: "text",
    workspaceId: "ws1",
  },
  "voice-chat-ws1": {
    id: "voice-chat-ws1",
    name: "voice-chat",
    description: "Voice channel for the Design Team",
    type: "voice",
    workspaceId: "ws1",
  },
  "document-1-ws1": {
    id: "document-1-ws1",
    name: "project-proposal",
    description: "Collaborative document for project proposal",
    type: "document",
    workspaceId: "ws1",
  },
}

export default function ChannelPage({ params }: ChannelPageProps) {
  const [channel, setChannel] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch channel data
    setTimeout(() => {
      setChannel(MOCK_CHANNELS[params.channelId as keyof typeof MOCK_CHANNELS])
      setIsLoading(false)
    }, 500)
  }, [params.channelId])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Channel not found</h2>
          <p className="text-muted-foreground mt-2">
            The channel you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <ChannelHeader channel={channel} />
      <ChannelContent channel={channel} />
    </>
  )
}

