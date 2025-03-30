"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

export function useSocket(userId?: string) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io("http://localhost:3001")

    socketInstance.on("connect", () => {
      console.log("Socket connected")
      setIsConnected(true)

      // Authenticate with user ID if available
      if (userId) {
        socketInstance.emit("authenticate", userId)
      }
    })

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected")
      setIsConnected(false)
    })

    setSocket(socketInstance)

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [userId])

  return { socket, isConnected }
}

