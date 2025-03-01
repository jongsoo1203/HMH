"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserDropdownMenu } from "@/components/user-dropdown-menu"
import { LogIn, UserPlus } from "lucide-react"
import { signOutAction } from "@/app/actions"
import { createClient } from "@/utils/supabase/client"

export function AuthStatus() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setUser(data.session?.user || null)
        setLoading(false)

        // Set up auth state listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            setUser(session?.user || null)
          }
        )

        return () => {
          authListener.subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error fetching auth status:", error)
        setLoading(false)
      }
    }

    getUser()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOutAction()
      // Redirect to main page after sign out
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (loading) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/sign-in">
          <Button variant="ghost" size="sm" className="gap-2">
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Login</span>
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Sign up</span>
          </Button>
        </Link>
      </div>
    )
  }

  return <UserDropdownMenu user={user} handleSignOut={handleSignOut} />
}