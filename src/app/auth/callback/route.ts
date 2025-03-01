// app/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect_to") || "/dashboard";

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth callback error:", error);
        return NextResponse.redirect(
          new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, request.url)
        );
      }

      return NextResponse.redirect(new URL(redirectTo, request.url));
    } catch (error) {
      console.error("Auth callback exception:", error);
      return NextResponse.redirect(
        new URL("/sign-in?error=Authentication%20failed", request.url)
      );
    }
  }

  // If no code is present, redirect to the homepage
  return NextResponse.redirect(new URL("/", request.url));
}