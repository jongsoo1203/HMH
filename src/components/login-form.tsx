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
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signInAction } from "@/app/actions"
import { FormMessage, Message } from "@/components/form-message"

export function LoginForm({
  className,
  searchParams,
  ...props
}: React.ComponentProps<"div"> & { searchParams?: any }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<Message | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormMessage(null);

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      
      // Call the server action for signing in
      const result = await signInAction(formData);

      if (result.error) {
        setFormMessage({ error: result.error });
        setIsLoading(false);
        return;
      }

      // On successful login, redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setFormMessage({ error: "An unexpected error occurred. Please try again." });
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setFormMessage(null);

    // try {
    //   // Import the Supabase client from your utils/supabase.ts file
    //   // This assumes you have a client-side Supabase client setup
    //   const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
    //   const supabase = createClientComponentClient();
      
    //   const { error } = await supabase.auth.signInWithOAuth({
    //     provider: 'google',
    //     options: {
    //       redirectTo: `${window.location.origin}/auth/callback`
    //     }
    //   });
      
    //   if (error) throw error;
      
    //   // Note: Google auth redirects the user, so we don't need to handle
    //   // success case here as the page will reload
    // } catch (error) {
    //   console.error("Google login error:", error);
    //   setFormMessage({ error: "Failed to sign in with Google. Please try again." });
    //   setIsLoading(false);
    // }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              {formMessage && <FormMessage message={formMessage} />}
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}