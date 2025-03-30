"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "./loading-states"

interface ProtectedRouteProps {
  children: React.ReactNode
  isAuthenticated: boolean
  fallbackUrl?: string
}

export function ProtectedRoute({ children, isAuthenticated, fallbackUrl = "/login" }: ProtectedRouteProps) {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(fallbackUrl)
    }
  }, [isAuthenticated, router, fallbackUrl])

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <>{children}</>
}

