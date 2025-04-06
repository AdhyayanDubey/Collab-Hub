require("dotenv").config()
const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id)

  socket.on("join-workspace", (workspaceId) => {
    socket.join(workspaceId)
    console.log(`User ${socket.id} joined workspace ${workspaceId}`)
  })

  socket.on("leave-workspace", (workspaceId) => {
    socket.leave(workspaceId)
    console.log(`User ${socket.id} left workspace ${workspaceId}`)
  })

  socket.on("send-message", (data) => {
    io.to(data.workspaceId).emit("receive-message", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

