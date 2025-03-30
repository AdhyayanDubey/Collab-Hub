import { NextResponse } from "next/server"
import { createUser } from "@/lib/models/user"

export async function GET() {
  try {
    // Create demo users
    const users = await Promise.all([
      createUser({
        name: "Demo User",
        email: "demo@example.com",
        password: "password123",
        image: "/placeholder.svg?height=200&width=200&text=D",
      }),
      createUser({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        image: "/placeholder.svg?height=200&width=200&text=J",
      }),
      createUser({
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        image: "/placeholder.svg?height=200&width=200&text=J",
      }),
    ])

    return NextResponse.json({
      success: true,
      message: "Seed data created successfully",
      data: {
        users: users.map((user) => ({ id: user.id, name: user.name, email: user.email })),
      },
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create seed data",
      },
      { status: 500 },
    )
  }
}

