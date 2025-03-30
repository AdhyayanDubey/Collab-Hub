"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { verifyEmail } from "./actions"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Invalid verification link. Please request a new verification email.")
      return
    }

    const verifyUserEmail = async () => {
      try {
        const result = await verifyEmail(token)

        if (result.success) {
          setStatus("success")
          setMessage("Your email has been verified successfully!")
        } else {
          setStatus("error")
          setMessage(result.error || "Failed to verify email. The link may have expired.")
        }
      } catch (error) {
        console.error("Email verification error:", error)
        setStatus("error")
        setMessage("An error occurred during verification. Please try again later.")
      }
    }

    verifyUserEmail()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">Verifying your email address</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
              <p className="text-center">Verifying your email address...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-center font-medium text-lg">{message}</p>
              <p className="text-center text-muted-foreground mt-2">You can now log in to your account.</p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-16 w-16 text-destructive mb-4" />
              <p className="text-center font-medium text-lg">{message}</p>
              <p className="text-center text-muted-foreground mt-2">
                Please try again or contact support if the problem persists.
              </p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

