"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { signInAction } from "@/app/actions"
import { createClient } from "@/utils/supabase/client"
import { FormMessage, Message } from "@/components/form-message"
import { SubmitButton } from "@/components/submit-button"

export function LoginForm({
  className,
  message,
  ...props
}: React.ComponentProps<"div"> & { message?: Message }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formMessage, setFormMessage] = useState<Message | null>(message || null)
  const supabase = createClient()
  // Removed useTransition as we're using a direct approach

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLoading) return; // Prevent multiple submissions
    
    if (!email || !password) {
      setFormMessage({ error: "Email and password are required" })
      return
    }
    
    setIsLoading(true)
    setFormMessage(null)

    // Create a FormData object for the server action
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)
    
    // Use the SubmitButton approach which is more reliable with server actions
    try {
      const result = await signInAction(formData)
      
      // If we reach here, it means we received a result (likely an error)
      // instead of being redirected
      if (result) {
        setFormMessage({ error: "Invalid email or password" })
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setFormMessage({ error: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setFormMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) throw error
    } catch (error) {
      console.error("Google login error:", error)
      setFormMessage({ error: "Failed to sign in with Google" })
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-foreground underline hover:text-primary"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input 
                id="password" 
                name="password"
                type="password"
                placeholder="Your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            {formMessage && <FormMessage message={formMessage} />}
            <div className="flex flex-col gap-3 mt-2">
              {/* Option 1: Use the original button with state handling */}
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              
              {/* Option 2: Use the SubmitButton component (uncomment to use) */}
              {/* <SubmitButton 
                className="w-full" 
                pendingText="Signing In..." 
                formAction={(formData) => {
                  if (!email || !password) {
                    setFormMessage({ error: "Email and password are required" })
                    return
                  }
                  return signInAction(formData)
                }}
              >
                Sign in
              </SubmitButton> */}
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                Sign in with Google
              </Button>
            </div>
            <div className="text-center text-sm mt-2">
              Don&apos;t have an account?{" "}
              <Link 
                className="font-medium text-primary underline hover:text-primary/90" 
                href="/sign-up"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}