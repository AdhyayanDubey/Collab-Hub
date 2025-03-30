"use server"

import { cookies } from "next/headers"
import { headers } from "next/headers"
import { UAParser } from "ua-parser-js"
import {
  createUser,
  getUserByEmail,
  type UserResponse,
  createSession,
  updateSessionActivity,
  deleteSession,
  logActivity,
  verifyTwoFactorToken,
  getFullUserById,
} from "@/lib/models/user"
import { sendEmail, getVerificationEmailHtml, getLoginNotificationEmailHtml } from "@/lib/email"

// Authentication cookie name
const AUTH_COOKIE = "auth_token"
const SESSION_COOKIE = "session_id"

// Helper to get client info
function getClientInfo() {
  const headersList = headers()
  const userAgent = headersList.get("user-agent") || ""
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"

  // Parse user agent
  const parser = new UAParser(userAgent)
  const browser = parser.getBrowser()
  const os = parser.getOS()
  const device = parser.getDevice()

  const deviceInfo = `${browser.name || "Unknown browser"} on ${os.name || "Unknown OS"}`

  return { userAgent, ip, deviceInfo }
}

// Login action
export async function login(formData: FormData): Promise<{
  success: boolean
  error?: string
  user?: UserResponse
  requiresTwoFactor?: boolean
  userId?: string
}> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const twoFactorCode = formData.get("twoFactorCode") as string
  const userId = formData.get("userId") as string

  if (userId && twoFactorCode) {
    // Handle 2FA verification
    return verifyTwoFactor(userId, twoFactorCode)
  }

  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  try {
    // Get full user to check 2FA status
    const fullUser = await getUserByEmail(email)

    if (!fullUser) {
      return { success: false, error: "Invalid email or password" }
    }

    // Validate credentials
    const isValid = await compare(password, fullUser.hashedPassword)
    if (!isValid) {
      // Log failed login attempt
      await logActivity(
        fullUser.id,
        "login_failed",
        { reason: "invalid_password" },
        getClientInfo().ip,
        getClientInfo().userAgent,
      )
      return { success: false, error: "Invalid email or password" }
    }

    // Check if email is verified
    if (!fullUser.emailVerified) {
      return { success: false, error: "Please verify your email before logging in" }
    }

    // Check if 2FA is enabled
    if (fullUser.twoFactorEnabled) {
      return {
        success: false,
        requiresTwoFactor: true,
        userId: fullUser.id,
        error: "Two-factor authentication required",
      }
    }

    // Create session
    const { userAgent, ip, deviceInfo } = getClientInfo()
    const sessionId = await createSession(fullUser.id, userAgent, ip)

    // Set auth cookies
    cookies().set({
      name: AUTH_COOKIE,
      value: fullUser.id,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "strict",
    })

    cookies().set({
      name: SESSION_COOKIE,
      value: sessionId,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "strict",
    })

    // Log successful login
    await logActivity(fullUser.id, "login_success", { sessionId }, ip, userAgent)

    // Send login notification if enabled
    if (fullUser.securitySettings?.loginNotifications) {
      const now = new Date().toLocaleString()

      sendEmail({
        to: fullUser.email,
        subject: "New login to your CollabHub account",
        html: getLoginNotificationEmailHtml(
          fullUser.name,
          now,
          deviceInfo,
          "Unknown location", // In a real app, you would use IP geolocation
        ),
      }).catch(console.error) // Don't await, send in background
    }

    return {
      success: true,
      user: sanitizeUser(fullUser),
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

// Verify two-factor authentication
async function verifyTwoFactor(
  userId: string,
  code: string,
): Promise<{
  success: boolean
  error?: string
  user?: UserResponse
}> {
  try {
    const fullUser = await getFullUserById(userId)
    if (!fullUser) {
      return { success: false, error: "User not found" }
    }

    const isValid = await verifyTwoFactorToken(userId, code)
    if (!isValid) {
      await logActivity(
        userId,
        "two_factor_failed",
        { reason: "invalid_code" },
        getClientInfo().ip,
        getClientInfo().userAgent,
      )
      return { success: false, error: "Invalid verification code" }
    }

    // Create session
    const { userAgent, ip, deviceInfo } = getClientInfo()
    const sessionId = await createSession(userId, userAgent, ip)

    // Set auth cookies
    cookies().set({
      name: AUTH_COOKIE,
      value: userId,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "strict",
    })

    cookies().set({
      name: SESSION_COOKIE,
      value: sessionId,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "strict",
    })

    // Log successful login
    await logActivity(userId, "login_success", { sessionId, twoFactorUsed: true }, ip, userAgent)

    // Send login notification if enabled
    if (fullUser.securitySettings?.loginNotifications) {
      const now = new Date().toLocaleString()

      sendEmail({
        to: fullUser.email,
        subject: "New login to your CollabHub account",
        html: getLoginNotificationEmailHtml(
          fullUser.name,
          now,
          deviceInfo,
          "Unknown location", // In a real app, you would use IP geolocation
        ),
      }).catch(console.error) // Don't await, send in background
    }

    return {
      success: true,
      user: sanitizeUser(fullUser),
    }
  } catch (error) {
    console.error("Two-factor verification error:", error)
    return { success: false, error: "An error occurred during verification" }
  }
}

// Signup action
export async function signup(formData: FormData): Promise<{ success: boolean; error?: string; user?: UserResponse }> {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  // Validate form data
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return { success: false, error: "All fields are required" }
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" }
  }

  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters long" }
  }

  // Basic password strength validation
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (!hasUppercase || !hasNumber) {
    return {
      success: false,
      error: "Password must contain at least one uppercase letter and one number",
    }
  }

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return { success: false, error: "Email already in use" }
    }

    // Create new user
    const name = `${firstName} ${lastName}`
    const user = await createUser({
      name,
      email,
      password,
      image: `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(name.charAt(0).toUpperCase())}`,
    })

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${user.verificationToken}`

    await sendEmail({
      to: email,
      subject: "Verify your email address",
      html: getVerificationEmailHtml(name, verificationUrl),
    })

    // Log activity
    await logActivity(user.id, "user_registered", { name, email }, getClientInfo().ip, getClientInfo().userAgent)

    return {
      success: true,
      user,
      message: "Account created successfully. Please check your email to verify your account.",
    }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false, error: "An error occurred during signup" }
  }
}

// Logout action
export async function logout(): Promise<{ success: boolean }> {
  try {
    const userId = cookies().get(AUTH_COOKIE)?.value
    const sessionId = cookies().get(SESSION_COOKIE)?.value

    if (userId && sessionId) {
      // Delete the session
      await deleteSession(userId, sessionId)

      // Log activity
      await logActivity(userId, "logout", { sessionId }, getClientInfo().ip, getClientInfo().userAgent)
    }

    // Delete cookies
    cookies().delete(AUTH_COOKIE)
    cookies().delete(SESSION_COOKIE)

    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false }
  }
}

// Get current user
export async function getCurrentUser(): Promise<UserResponse | null> {
  const userId = cookies().get(AUTH_COOKIE)?.value
  const sessionId = cookies().get(SESSION_COOKIE)?.value

  if (!userId || !sessionId) {
    return null
  }

  try {
    // Update session activity
    await updateSessionActivity(userId, sessionId)

    // Get user
    const user = await getUserById(userId)
    return user
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

// Helper function to get user by ID (imported from user model)
async function getUserById(id: string): Promise<UserResponse | null> {
  // Import dynamically to avoid circular dependencies
  const { getUserById } = await import("@/lib/models/user")
  return getUserById(id)
}

// Helper function to sanitize user (imported from user model)
function sanitizeUser(user: any): UserResponse {
  const {
    hashedPassword,
    verificationToken,
    verificationTokenExpiry,
    resetToken,
    resetTokenExpiry,
    twoFactorSecret,
    backupCodes,
    ...userResponse
  } = user

  // Convert OAuth accounts to simplified format
  const oauthAccounts = user.oauthAccounts?.map((account: any) => ({
    provider: account.provider,
  }))

  return { ...userResponse, oauthAccounts }
}

// Helper function to compare passwords (imported from bcrypt)
async function compare(password: string, hashedPassword: string): Promise<boolean> {
  const { compare } = await import("bcrypt")
  return compare(password, hashedPassword)
}

