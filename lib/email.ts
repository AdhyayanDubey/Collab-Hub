import nodemailer from "nodemailer"

// Configure email transport
// For production, use a real email service
// For development, you can use services like Mailtrap or Ethereal
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || "smtp.ethereal.email",
  port: Number.parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const { to, subject, html, from = process.env.EMAIL_FROM || "noreply@collabhub.com" } = options

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    })

    console.log("Email sent:", info.messageId)
    return true
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}

// Email templates
export function getVerificationEmailHtml(name: string, verificationUrl: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify your email address</h2>
      <p>Hello ${name},</p>
      <p>Thank you for signing up for CollabHub. Please verify your email address by clicking the button below:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
      </p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
      <p>This link will expire in 24 hours.</p>
      <p>Best regards,<br>The CollabHub Team</p>
    </div>
  `
}

export function getPasswordResetEmailHtml(name: string, resetUrl: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset your password</h2>
      <p>Hello ${name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
      </p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
      <p>Best regards,<br>The CollabHub Team</p>
    </div>
  `
}

export function getLoginNotificationEmailHtml(name: string, time: string, device: string, location: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Login Detected</h2>
      <p>Hello ${name},</p>
      <p>We detected a new login to your CollabHub account:</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Device:</strong> ${device}</p>
        <p><strong>Location:</strong> ${location}</p>
      </div>
      <p>If this was you, no further action is needed.</p>
      <p>If you don't recognize this activity, please reset your password immediately and contact our support team.</p>
      <p>Best regards,<br>The CollabHub Team</p>
    </div>
  `
}

