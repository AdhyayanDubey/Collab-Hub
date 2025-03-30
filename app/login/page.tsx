"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { login, signup } from "@/app/api/auth/actions"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [signupError, setSignupError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showTwoFactorInput, setShowTwoFactorInput] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [twoFactorCode, setTwoFactorCode] = useState("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoginError(null)
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)

      // If we're in 2FA mode, add the userId and code
      if (showTwoFactorInput && userId) {
        formData.append("userId", userId)
        formData.append("twoFactorCode", twoFactorCode)
      }

      const result = await login(formData)

      if (result.success) {
        toast({
          title: "Logged in successfully",
          description: "Welcome back to CollabHub!",
        })
        router.push("/workspaces")
        router.refresh()
      } else if (result.requiresTwoFactor) {
        // Show 2FA input
        setShowTwoFactorInput(true)
        setUserId(result.userId || null)
        setLoginError("Please enter your two-factor authentication code")
      } else {
        setLoginError(result.error || "An error occurred during login")
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSignupError(null)
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await signup(formData)

      if (result.success) {
        toast({
          title: "Account created successfully",
          description: "Please check your email to verify your account.",
        })
        router.push("/login")
        router.refresh()
      } else {
        setSignupError(result.error || "An error occurred during signup")
      }
    } catch (error) {
      console.error("Signup error:", error)
      setSignupError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-primary">Collab</span>Hub
          </h1>
          <p className="text-muted-foreground mt-2">Real-time collaboration platform</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" id="login-tab">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" id="signup-tab">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>{showTwoFactorInput ? "Two-Factor Authentication" : "Login"}</CardTitle>
                  <CardDescription>
                    {showTwoFactorInput
                      ? "Enter the verification code from your authenticator app"
                      : "Enter your credentials to access your account"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loginError && (
                    <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{loginError}</div>
                  )}

                  {!showTwoFactorInput ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-xs"
                            type="button"
                            onClick={() => router.push("/forgot-password")}
                          >
                            Forgot password?
                          </Button>
                        </div>
                        <div className="relative">
                          <Input id="password" name="password" type={showPassword ? "text" : "password"} required />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" name="remember" />
                        <label
                          htmlFor="remember"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Remember me
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="twoFactorCode">Verification Code</Label>
                      <Input
                        id="twoFactorCode"
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        className="text-center text-xl tracking-widest"
                        required
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {showTwoFactorInput ? "Verifying..." : "Logging in..."}
                      </>
                    ) : showTwoFactorInput ? (
                      "Verify"
                    ) : (
                      "Login"
                    )}
                  </Button>

                  {showTwoFactorInput && (
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full"
                      onClick={() => {
                        setShowTwoFactorInput(false)
                        setUserId(null)
                        setTwoFactorCode("")
                      }}
                    >
                      Back to Login
                    </Button>
                  )}

                  {!showTwoFactorInput && (
                    <div className="text-center text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => document.getElementById("signup-tab")?.click()}
                        type="button"
                      >
                        Sign up
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <form onSubmit={handleSignup}>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>Enter your information to create an account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {signupError && (
                    <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{signupError}</div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" name="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" name="lastName" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input id="password" name="password" type={showPassword ? "text" : "password"} required />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters long and contain at least one uppercase letter and one
                      number.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" required />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" name="terms" required />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link href="#" className="text-primary hover:underline">
                        terms of service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-primary hover:underline">
                        privacy policy
                      </Link>
                    </label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => document.getElementById("login-tab")?.click()}
                      type="button"
                    >
                      Login
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

