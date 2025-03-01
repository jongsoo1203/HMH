"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ThemeAwareAvatar } from "@/components/theme-aware-avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { User, LogOut, UserPlus, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
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
        // Get the current session
        const { data } = await supabase.auth.getSession()
        console.log("Session check:", data.session ? "Logged in" : "Not logged in")
        setUser(data.session?.user || null)
        setLoading(false)

        // Set up auth state listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("Auth state changed:", event, session?.user?.email)
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
      // Use the server action for signing out
      await signOutAction();
    } catch (error) {
      console.error("Sign out error:", error);
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <ThemeAwareAvatar />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{user.email}</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center gap-2 text-destructive focus:text-destructive" 
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}