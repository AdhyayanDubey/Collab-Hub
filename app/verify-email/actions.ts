"use server"

import { verifyEmail as verifyUserEmail } from "@/lib/models/user"

export async function verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await verifyUserEmail(token)

    if (!user) {
      return {
        success: false,
        error: "Invalid or expired verification token",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Email verification error:", error)
    return {
      success: false,
      error: "An error occurred during verification",
    }
  }
}

