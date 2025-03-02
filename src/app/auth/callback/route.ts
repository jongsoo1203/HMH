import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    
    // After exchanging the code, get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Check if the user has already filled out the questionnaire
      const { data: patientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      // If no patient data exists, redirect to questionnaire
      if (!patientData) {
        return NextResponse.redirect(`${origin}/questionnaire`);
      }
    }
  }

  // If there's a specific redirect_to parameter, honor that
  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // Default redirect to dashboard for authenticated users or home for others
  return NextResponse.redirect(`${origin}/dashboard`);
}