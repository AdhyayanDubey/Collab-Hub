import { redis, generateId } from "../redis"
import { hash, compare } from "bcrypt"
import crypto from "crypto"
import { authenticator } from "otplib"

export interface User {
  id: string
  name: string
  email: string
  hashedPassword: string
  image?: string
  status?: "online" | "idle" | "dnd" | "offline"
  emailVerified?: boolean
  verificationToken?: string
  verificationTokenExpiry?: number
  resetToken?: string
  resetTokenExpiry?: number
  twoFactorEnabled?: boolean
  twoFactorSecret?: string
  backupCodes?: string[]
  sessions?: UserSession[]
  oauthAccounts?: OAuthAccount[]
  securitySettings?: SecuritySettings
  createdAt: number
  updatedAt: number
}

export interface UserSession {
  id: string
  userAgent: string
  ip: string
  location?: string
  lastActive: number
  createdAt: number
}

export interface OAuthAccount {
  provider: "google" | "github"
  providerAccountId: string
  accessToken: string
  refreshToken?: string
  expiresAt?: number
}

export interface SecuritySettings {
  loginNotifications: boolean
  passwordMinLength: number
  passwordRequireUppercase: boolean
  passwordRequireNumbers: boolean
  passwordRequireSymbols: boolean
}

export interface UserCreate {
  name: string
  email: string
  password: string
  image?: string
}

export interface UserResponse {
  id: string
  name: string
  email: string
  image?: string
  status?: "online" | "idle" | "dnd" | "offline"
  emailVerified?: boolean
  twoFactorEnabled?: boolean
  sessions?: UserSession[]
  oauthAccounts?: { provider: string }[]
  securitySettings?: SecuritySettings
  createdAt: number
  updatedAt: number
}

const USER_PREFIX = "user"
const USER_EMAIL_INDEX = "user:email"
const VERIFICATION_TOKEN_INDEX = "verification:token"
const RESET_TOKEN_INDEX = "reset:token"
const SALT_ROUNDS = 10

// Convert User to UserResponse (remove sensitive data)
function sanitizeUser(user: User): UserResponse {
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
  const oauthAccounts = user.oauthAccounts?.map((account) => ({
    provider: account.provider,
  }))

  return { ...userResponse, oauthAccounts }
}

export async function createUser(data: UserCreate): Promise<UserResponse> {
  const id = generateId(USER_PREFIX)
  const now = Date.now()

  // Hash the password
  const hashedPassword = await hash(data.password, SALT_ROUNDS)

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString("hex")
  const verificationTokenExpiry = now + 24 * 60 * 60 * 1000 // 24 hours

  const user: User = {
    id,
    name: data.name,
    email: data.email,
    hashedPassword,
    image: data.image,
    status: "online",
    emailVerified: false,
    verificationToken,
    verificationTokenExpiry,
    securitySettings: {
      loginNotifications: true,
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireNumbers: true,
      passwordRequireSymbols: false,
    },
    createdAt: now,
    updatedAt: now,
  }

  // Store user data
  await redis.set(`${USER_PREFIX}:${id}`, JSON.stringify(user))

  // Create email index for lookup
  await redis.set(`${USER_EMAIL_INDEX}:${data.email}`, id)

  // Create verification token index
  await redis.set(`${VERIFICATION_TOKEN_INDEX}:${verificationToken}`, id)

  return sanitizeUser(user)
}

export async function getUserById(id: string): Promise<UserResponse | null> {
  const data = await redis.get(`${USER_PREFIX}:${id}`)
  if (!data) return null

  const user = JSON.parse(data as string) as User
  return sanitizeUser(user)
}

export async function getFullUserById(id: string): Promise<User | null> {
  const data = await redis.get(`${USER_PREFIX}:${id}`)
  return data ? (JSON.parse(data as string) as User) : null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const id = await redis.get(`${USER_EMAIL_INDEX}:${email}`)
  if (!id) return null

  const data = await redis.get(`${USER_PREFIX}:${id}`)
  return data ? (JSON.parse(data as string) as User) : null
}

export async function getUserByVerificationToken(token: string): Promise<User | null> {
  const id = await redis.get(`${VERIFICATION_TOKEN_INDEX}:${token}`)
  if (!id) return null

  const data = await redis.get(`${USER_PREFIX}:${id}`)
  if (!data) return null

  const user = JSON.parse(data as string) as User

  // Check if token is expired
  if (!user.verificationTokenExpiry || user.verificationTokenExpiry < Date.now()) {
    return null
  }

  return user
}

export async function getUserByResetToken(token: string): Promise<User | null> {
  const id = await redis.get(`${RESET_TOKEN_INDEX}:${token}`)
  if (!id) return null

  const data = await redis.get(`${USER_PREFIX}:${id}`)
  if (!data) return null

  const user = JSON.parse(data as string) as User

  // Check if token is expired
  if (!user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
    return null
  }

  return user
}

export async function validateUserCredentials(email: string, password: string): Promise<UserResponse | null> {
  const user = await getUserByEmail(email)
  if (!user) return null

  const isValid = await compare(password, user.hashedPassword)
  if (!isValid) return null

  return sanitizeUser(user)
}

export async function verifyEmail(token: string): Promise<UserResponse | null> {
  const user = await getUserByVerificationToken(token)
  if (!user) return null

  // Update user
  const updatedUser: User = {
    ...user,
    emailVerified: true,
    verificationToken: undefined,
    verificationTokenExpiry: undefined,
    updatedAt: Date.now(),
  }

  await redis.set(`${USER_PREFIX}:${user.id}`, JSON.stringify(updatedUser))

  // Remove verification token index
  await redis.del(`${VERIFICATION_TOKEN_INDEX}:${token}`)

  return sanitizeUser(updatedUser)
}

export async function createPasswordResetToken(email: string): Promise<string | null> {
  const user = await getUserByEmail(email)
  if (!user) return null

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex")
  const resetTokenExpiry = Date.now() + 60 * 60 * 1000 // 1 hour

  // Update user
  const updatedUser: User = {
    ...user,
    resetToken,
    resetTokenExpiry,
    updatedAt: Date.now(),
  }

  await redis.set(`${USER_PREFIX}:${user.id}`, JSON.stringify(updatedUser))

  // Create reset token index
  await redis.set(`${RESET_TOKEN_INDEX}:${resetToken}`, user.id)

  return resetToken
}

export async function resetPassword(token: string, newPassword: string): Promise<UserResponse | null> {
  const user = await getUserByResetToken(token)
  if (!user) return null

  // Hash the new password
  const hashedPassword = await hash(newPassword, SALT_ROUNDS)

  // Update user
  const updatedUser: User = {
    ...user,
    hashedPassword,
    resetToken: undefined,
    resetTokenExpiry: undefined,
    updatedAt: Date.now(),
  }

  await redis.set(`${USER_PREFIX}:${user.id}`, JSON.stringify(updatedUser))

  // Remove reset token index
  await redis.del(`${RESET_TOKEN_INDEX}:${token}`)

  return sanitizeUser(updatedUser)
}

export async function updateUser(
  id: string,
  data: Partial<Omit<User, "id" | "hashedPassword">>,
): Promise<UserResponse | null> {
  const userData = await redis.get(`${USER_PREFIX}:${id}`)
  if (!userData) return null

  const user = JSON.parse(userData as string) as User

  const updatedUser: User = {
    ...user,
    ...data,
    updatedAt: Date.now(),
  }

  await redis.set(`${USER_PREFIX}:${id}`, JSON.stringify(updatedUser))

  // Update email index if email changed
  if (data.email && data.email !== user.email) {
    await redis.del(`${USER_EMAIL_INDEX}:${user.email}`)
    await redis.set(`${USER_EMAIL_INDEX}:${data.email}`, id)
  }

  return sanitizeUser(updatedUser)
}

export async function updateUserPassword(
  id: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  const userData = await redis.get(`${USER_PREFIX}:${id}`)
  if (!userData) return { success: false, error: "User not found" }

  const user = JSON.parse(userData as string) as User

  // Verify current password
  const isValid = await compare(currentPassword, user.hashedPassword)
  if (!isValid) return { success: false, error: "Current password is incorrect" }

  // Hash the new password
  const hashedPassword = await hash(newPassword, SALT_ROUNDS)

  // Update user
  const updatedUser: User = {
    ...user,
    hashedPassword,
    updatedAt: Date.now(),
  }

  await redis.set(`${USER_PREFIX}:${id}`, JSON.stringify(updatedUser))

  return { success: true }
}

export async function deleteUser(id: string): Promise<boolean> {
  const userData = await redis.get(`${USER_PREFIX}:${id}`)
  if (!userData) return false

  const user = JSON.parse(userData as string) as User

  // Delete user data
  await redis.del(`${USER_PREFIX}:${id}`)

  // Delete email index
  await redis.del(`${USER_EMAIL_INDEX}:${user.email}`)

  // Delete verification token index if exists
  if (user.verificationToken) {
    await redis.del(`${VERIFICATION_TOKEN_INDEX}:${user.verificationToken}`)
  }

  // Delete reset token index if exists
  if (user.resetToken) {
    await redis.del(`${RESET_TOKEN_INDEX}:${user.resetToken}`)
  }

  return true
}

export async function getAllUsers(): Promise<UserResponse[]> {
  const keys = await redis.keys(`${USER_PREFIX}:*`)
  if (keys.length === 0) return []

  const users = await Promise.all(
    keys.map(async (key) => {
      const data = await redis.get(key)
      return data ? (JSON.parse(data as string) as User) : null
    }),
  )

  return users.filter(Boolean).map(sanitizeUser)
}

export async function updateUserStatus(id: string, status: User["status"]): Promise<UserResponse | null> {
  return updateUser(id, { status })
}

// Two-factor authentication
export async function setupTwoFactor(userId: string): Promise<{ secret: string; qrCode: string } | null> {
  const user = await getFullUserById(userId)
  if (!user) return null

  // Generate secret
  const secret = authenticator.generateSecret()

  // Generate QR code URL
  const otpauth = authenticator.keyuri(user.email, "CollabHub", secret)

  // Update user with secret (not enabled yet)
  const updatedUser: User = {
    ...user,
    twoFactorSecret: secret,
    updatedAt: Date.now(),
  }

  await redis.set(`${USER_PREFIX}:${userId}`, JSON.stringify(updatedUser))

  return {
    secret,
    qrCode: otpauth,
  }
}

export async function verifyAndEnableTwoFactor(userId: string, token: string): Promise<boolean> {
  const user = await getFullUserById(userId)
  if (!user || !user.twoFactorSecret) return false

  // Verify token
  const isValid = authenticator.verify({
    token,
    secret: user.twoFactorSecret,
  })

  if (!isValid) return false

  // Generate backup codes
  const backupCodes = Array.from({ length: 10 }, () => crypto.randomBytes(4).toString("hex"))

  // Update user
  const updatedUser: User = {
    ...user,
    twoFactorEnabled: true,
    backupCodes,
    updatedAt: Date.now(),
  }

  await redis.set(`${USER_PREFIX}:${userId}`, JSON.stringify(updatedUser))

  return true
}

export async function verifyTwoFactorToken(userId: string, token: string): Promise<boolean> {
  const user = await getFullUserById(userId)
  if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) return false

  // Check if token is a backup code
  if (user.backupCodes?.includes(token)) {
    // Remove used backup code
    const updatedUser: User = {
      ...user,
      backupCodes: user.backupCodes.filter((code) => code !== token),
      updatedAt: Date.now(),
    }

    await redis.set(`${USER_PREFIX}:${userId}`, JSON.stringify(updatedUser))

    return true
  }

  // Verify TOTP token
  return authenticator.verify({
    token,
    secret: user.twoFactorSecret,
  })
}

export async function disableTwoFactor(userId: string, password: string): Promise<boolean> {
  const user = await getFullUserById(userId)
  if (!user) return false

  // Verify password
  const isValid = await compare(password, user.hashedPassword)
  if (!isValid) return false

  // Update user
  const updatedUser: User = {
    ...user,
    twoFactorEnabled: false,
    twoFactorSecret: undefined,
    backupCodes: undefined,
    updatedAt: Date.now(),
  }

  await redis.set(`${USER_PREFIX}:${userId}`, JSON.stringify(updatedUser))

  return true
}

// Session management
export async function createSession(userId: string, userAgent: string, ip: string, location?: string): Promise<string> {
  const user = await getFullUserById(userId)
  if (!user) throw new Error("User not found")

  const sessionId = crypto.randomBytes(16).toString("hex")
  const now = Date.now()

  const session: UserSession = {
    id: sessionId,
    userAgent,
    ip,
    location,
    lastActive: now,
    createdAt: now,
  }

  // Update user with new session
  const sessions = user.sessions || []
  const updatedUser: User = {
    ...user,
    sessions: [...sessions, session],
    updatedAt: now,
  }

  await redis.set(`${USER_PREFIX}:${userId}`, JSON.stringify(updatedUser))

  return sessionId
}

export async function updateSessionActivity(userId: string, sessionId: string): Promise<boolean> {
  const user = await getFullUserById(userId)
  if (!user || !user.sessions) return false

  const sessionIndex = user.sessions.findIndex((s) => s.id === sessionId)
  if (sessionIndex === -1) return false

  // Update session last active time
  const updatedSessions = [...user.sessions]
  updatedSessions[sessionIndex] = {
    ...updatedSessions[sessionIndex],
    lastActive: Date.now(),
  }

  // Update user
  const updatedUser: User = {
    ...user,
    sessions: updatedSessions,
    updatedAt: Date.now(),
  }

  await redis.set(`${USER_PREFIX}:${userId}`, JSON.stringify(updatedUser))

  return true
}

export async function deleteSession(userId: string, sessionId: string): Promise<boolean> {
  const user = await getFullUserById(userId)
  if (!user || !user.sessions) return false

  // Filter out the session to delete
  const updatedSessions = user.sessions.filter((s) => s.id !== sessionId)

  // Update user
  const updatedUser: User = {
    ...user,
    sessions: updatedSessions,
    updatedAt: Date.now(),
  }

  await redis.set(`${USER_PREFIX}:${userId}`, JSON.stringify(updatedUser))

  return true
}

export async function deleteAllSessionsExcept(userId: string, sessionId: string): Promise<boolean> {
  const user = await getFullUserById(userId)
  if (!user || !user.sessions) return false

  // Keep only the current session
  const currentSession = user.sessions.find((s) => s.id === sessionId)
  if (!currentSession) return false

  // Update user
  const updatedUser: User = {
    ...user,
    sessions: [currentSession],
    updatedAt: Date.now(),
  }

  await redis.set(`${USER_PREFIX}:${userId}`, JSON.stringify(updatedUser))

  return true
}

// OAuth account management
export async function linkOAuthAccount(
  userId: string,
  provider: OAuthAccount["provider"],
  providerAccountId: string,
  accessToken: string,
  refreshToken?: string,
  expiresAt?: number,
): Promise<UserResponse | null> {
  const user = await getFullUserById(userId)
  if (!user) return null

  const oauthAccounts = user.oauthAccounts || []

  // Check if account already linked
  const existingAccount = oauthAccounts.find(
    (account) => account.provider === provider && account.providerAccountId === providerAccountId,
  )

  if (existingAccount) {
    // Update existing account
    const updatedAccounts = oauthAccounts.map((account) => {
      if (account.provider === provider && account.providerAccountId === providerAccountId) {
        return {
          ...account,
          accessToken,
          refreshToken,
          expiresAt,
        }
      }
      return account
    })

    const updatedUser: User = {
      ...user,
      oauthAccounts: updatedAccounts,
      updatedAt: Date.now(),
    }

    await redis.set(`${USER_PREFIX}:${userId}`, JSON.stringify(updatedUser))

    return sanitizeUser(updatedUser)
  } else {
    // Add new account
    const newAccount: OAuthAccount = {
      provider,
      providerAccountId,
      accessToken,
      refreshToken,
      expiresAt,
    }

    const updatedUser: User = {
      ...user,
      oauthAccounts: [...oauthAccounts, newAccount],
      updatedAt: Date.now(),
    }

    await redis.set(`${USER_PREFIX}:${userId}`, JSON.stringify(updatedUser))

    return sanitizeUser(updatedUser)
  }
}

export async function unlinkOAuthAccount(
  userId: string,
  provider: OAuthAccount["provider"],
): Promise<UserResponse | null> {
  const user = await getFullUserById(userId)
  if (!user || !user.oauthAccounts) return null

  // Filter out the account to unlink
  const updatedAccounts = user.oauthAccounts.filter((account) => account.provider !== provider)

  // Update user
  const updatedUser: User = {
    ...user,
    oauthAccounts: updatedAccounts,
    updatedAt: Date.now(),
  }

  await redis.set(`${USER_PREFIX}:${userId}`, JSON.stringify(updatedUser))

  return sanitizeUser(updatedUser)
}

// Security settings
export async function updateSecuritySettings(
  userId: string,
  settings: Partial<SecuritySettings>,
): Promise<UserResponse | null> {
  const user = await getFullUserById(userId)
  if (!user) return null

  // Update user
  const updatedUser: User = {
    ...user,
    securitySettings: {
      ...user.securitySettings,
      ...settings,
    },
    updatedAt: Date.now(),
  }

  await redis.set(`${USER_PREFIX}:${userId}`, JSON.stringify(updatedUser))

  return sanitizeUser(updatedUser)
}

// Activity logging
export async function logActivity(
  userId: string,
  action: string,
  details: Record<string, any>,
  ip?: string,
  userAgent?: string,
): Promise<void> {
  const now = Date.now()
  const activityId = generateId("activity")

  const activity = {
    id: activityId,
    userId,
    action,
    details,
    ip,
    userAgent,
    timestamp: now,
  }

  // Store activity
  await redis.set(`activity:${activityId}`, JSON.stringify(activity))

  // Add to user's activity list
  await redis.lpush(`user:${userId}:activities`, activityId)

  // Trim list to last 100 activities
  await redis.ltrim(`user:${userId}:activities`, 0, 99)
}

export async function getUserActivities(userId: string, limit = 20): Promise<any[]> {
  const activityIds = await redis.lrange(`user:${userId}:activities`, 0, limit - 1)
  if (!activityIds || activityIds.length === 0) return []

  const activities = await Promise.all(
    activityIds.map(async (id) => {
      const data = await redis.get(`activity:${id}`)
      return data ? JSON.parse(data as string) : null
    }),
  )

  return activities.filter(Boolean)
}

