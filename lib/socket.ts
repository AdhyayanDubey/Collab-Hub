import { Server } from "socket.io"
import { createServer } from "http"
import type { NextApiRequest, NextApiResponse } from "next"
import { getUserById, updateUserStatus } from "./models/user"

// This is a simplified version of a WebSocket server for Next.js
// In a production app, you would use a more robust solution

let io: Server | null = null

export function getSocketIO() {
  if (!io) {
    const httpServer = createServer()
    io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    })

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id)

      // User authentication
      socket.on("authenticate", async (userId: string) => {
        try {
          const user = await getUserById(userId)

          if (user) {
            // Associate socket with user
            socket.data.userId = userId

            // Join user's room for private messages
            socket.join(`user:${userId}`)

            // Update user status to online
            await updateUserStatus(userId, "online")

            // Broadcast user's online status
            io?.emit("user:status", { userId, status: "online" })

            console.log(`User ${userId} authenticated`)
          }
        } catch (error) {
          console.error("Authentication error:", error)
        }
      })

      // Join a channel room
      socket.on("channel:join", (channelId: string) => {
        socket.join(`channel:${channelId}`)
        console.log(`Socket ${socket.id} joined channel ${channelId}`)
      })

      // Leave a channel room
      socket.on("channel:leave", (channelId: string) => {
        socket.leave(`channel:${channelId}`)
        console.log(`Socket ${socket.id} left channel ${channelId}`)
      })

      // Join a document room for collaborative editing
      socket.on("document:join", (documentId: string) => {
        socket.join(`document:${documentId}`)
        console.log(`Socket ${socket.id} joined document ${documentId}`)
      })

      // Leave a document room
      socket.on("document:leave", (documentId: string) => {
        socket.leave(`document:${documentId}`)
        console.log(`Socket ${socket.id} left document ${documentId}`)
      })

      // Handle document updates
      socket.on("document:update", (data: { documentId: string; content: string; userId: string }) => {
        // Broadcast to all clients in the document room except the sender
        socket.to(`document:${data.documentId}`).emit("document:update", data)
      })

      // Handle typing indicators
      socket.on("typing:start", (data: { channelId: string; userId: string }) => {
        socket.to(`channel:${data.channelId}`).emit("typing:start", data)
      })

      socket.on("typing:stop", (data: { channelId: string; userId: string }) => {
        socket.to(`channel:${data.channelId}`).emit("typing:stop", data)
      })

      // Handle user status changes
      socket.on("user:status", async (data: { status: "online" | "idle" | "dnd" | "offline" }) => {
        const userId = socket.data.userId

        if (userId) {
          await updateUserStatus(userId, data.status)
          io?.emit("user:status", { userId, status: data.status })
        }
      })

      // Handle disconnection
      socket.on("disconnect", async () => {
        const userId = socket.data.userId

        if (userId) {
          // Update user status to offline
          await updateUserStatus(userId, "offline")

          // Broadcast user's offline status
          io?.emit("user:status", { userId, status: "offline" })
        }

        console.log("Client disconnected:", socket.id)
      })
    })

    httpServer.listen(3001, () => {
      console.log("Socket.IO server running on port 3001")
    })
  }

  return io
}

// Next.js API route handler for WebSocket
export default function socketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (res.socket?.server.io) {
    res.end()
    return
  }

  const io = getSocketIO()
  res.socket.server.io = io

  res.end()
}

