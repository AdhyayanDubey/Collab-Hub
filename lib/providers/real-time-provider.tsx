"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useSocket } from "../hooks/use-socket"

interface RealTimeContextType {
  isConnected: boolean
  joinChannel: (channelId: string) => void
  leaveChannel: (channelId: string) => void
  joinDocument: (documentId: string) => void
  leaveDocument: (documentId: string) => void
  sendDocumentUpdate: (documentId: string, content: string, userId: string) => void
  startTyping: (channelId: string, userId: string) => void
  stopTyping: (channelId: string, userId: string) => void
  setUserStatus: (status: "online" | "idle" | "dnd" | "offline") => void
  typingUsers: Record<string, string[]> // channelId -> userIds
  onDocumentUpdate: (callback: (data: any) => void) => void
  onUserStatusChange: (callback: (data: any) => void) => void
}

const RealTimeContext = createContext<RealTimeContextType | null>(null)

export function RealTimeProvider({
  children,
  userId,
}: {
  children: ReactNode
  userId?: string
}) {
  const { socket, isConnected } = useSocket(userId)
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (!socket) return

    // Handle typing indicators
    socket.on("typing:start", (data: { channelId: string; userId: string }) => {
      setTypingUsers((prev) => {
        const channelTypers = prev[data.channelId] || []
        if (!channelTypers.includes(data.userId)) {
          return {
            ...prev,
            [data.channelId]: [...channelTypers, data.userId],
          }
        }
        return prev
      })
    })

    socket.on("typing:stop", (data: { channelId: string; userId: string }) => {
      setTypingUsers((prev) => {
        const channelTypers = prev[data.channelId] || []
        return {
          ...prev,
          [data.channelId]: channelTypers.filter((id) => id !== data.userId),
        }
      })
    })

    return () => {
      socket.off("typing:start")
      socket.off("typing:stop")
    }
  }, [socket])

  const joinChannel = (channelId: string) => {
    if (socket && isConnected) {
      socket.emit("channel:join", channelId)
    }
  }

  const leaveChannel = (channelId: string) => {
    if (socket && isConnected) {
      socket.emit("channel:leave", channelId)
    }
  }

  const joinDocument = (documentId: string) => {
    if (socket && isConnected) {
      socket.emit("document:join", documentId)
    }
  }

  const leaveDocument = (documentId: string) => {
    if (socket && isConnected) {
      socket.emit("document:leave", documentId)
    }
  }

  const sendDocumentUpdate = (documentId: string, content: string, userId: string) => {
    if (socket && isConnected) {
      socket.emit("document:update", { documentId, content, userId })
    }
  }

  const startTyping = (channelId: string, userId: string) => {
    if (socket && isConnected) {
      socket.emit("typing:start", { channelId, userId })
    }
  }

  const stopTyping = (channelId: string, userId: string) => {
    if (socket && isConnected) {
      socket.emit("typing:stop", { channelId, userId })
    }
  }

  const setUserStatus = (status: "online" | "idle" | "dnd" | "offline") => {
    if (socket && isConnected) {
      socket.emit("user:status", { status })
    }
  }

  const onDocumentUpdate = (callback: (data: any) => void) => {
    if (socket) {
      socket.on("document:update", callback)
      return () => {
        socket.off("document:update", callback)
      }
    }
    return () => {}
  }

  const onUserStatusChange = (callback: (data: any) => void) => {
    if (socket) {
      socket.on("user:status", callback)
      return () => {
        socket.off("user:status", callback)
      }
    }
    return () => {}
  }

  return (
    <RealTimeContext.Provider
      value={{
        isConnected,
        joinChannel,
        leaveChannel,
        joinDocument,
        leaveDocument,
        sendDocumentUpdate,
        startTyping,
        stopTyping,
        setUserStatus,
        typingUsers,
        onDocumentUpdate,
        onUserStatusChange,
      }}
    >
      {children}
    </RealTimeContext.Provider>
  )
}

export function useRealTime() {
  const context = useContext(RealTimeContext)

  if (!context) {
    throw new Error("useRealTime must be used within a RealTimeProvider")
  }

  return context
}

