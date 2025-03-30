"use server"

import { createPasswordResetToken, getUserByEmail } from "@/lib/models/user"
import { sendEmail, getPasswordResetEmailHtml } from "@/lib/email"

export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user exists
    const user = await getUserByEmail(email)

    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      // Instead, pretend we sent the email
      return { success: true }
    }

    // Create reset token
    const resetToken = await createPasswordResetToken(email)

    if (!resetToken) {
      return {
        success: false,
        error: "Failed to create reset token",
      }
    }

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: getPasswordResetEmailHtml(user.name, resetUrl),
    })

    return { success: true }
  } catch (error) {
    console.error("Password reset request error:", error)
    return {
      success: false,
      error: "An error occurred while processing your request",
    }
  }
}

