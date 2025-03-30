import type React from "react"
import { getCurrentUser } from "../api/auth/actions"
import { ProtectedRoute } from "@/components/protected-route"

export default async function WorkspacesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return <ProtectedRoute isAuthenticated={!!user}>{children}</ProtectedRoute>
}

