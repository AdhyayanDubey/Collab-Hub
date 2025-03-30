"use server"

import { getUserByResetToken, resetPassword as resetUserPassword } from "@/lib/models/user"

export async function validateResetToken(token: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const user = await getUserByResetToken(token)

    if (!user) {
      return {
        valid: false,
        error: "Invalid or expired reset token",
      }
    }

    return { valid: true }
  } catch (error) {
    console.error("Reset token validation error:", error)
    return {
      valid: false,
      error: "An error occurred while validating the token",
    }
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await resetUserPassword(token, newPassword)

    if (!user) {
      return {
        success: false,
        error: "Invalid or expired reset token",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Password reset error:", error)
    return {
      success: false,
      error: "An error occurred while resetting your password",
    }
  }
}

