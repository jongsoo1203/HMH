import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Add paths that should be accessible without completing the questionnaire
const PUBLIC_PATHS = ['/', '/login', '/sign-up', '/auth/callback', '/forgot-password', '/terms', '/privacy', '/contact'];
// Add paths that are part of the onboarding flow
const ONBOARDING_PATHS = ['/questionnaire'];
// Add paths that require questionnaire completion
const PROTECTED_PATHS = ['/dashboard', '/profile', '/settings', '/trials'];

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // Skip middleware for static assets
    if (
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api') || 
      pathname.includes('.') 
    ) {
      return response;
    }

    // First handle authentication redirects
    if (PROTECTED_PATHS.some(path => pathname.startsWith(path)) && userError) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname === "/" && !userError) {
      // For authenticated users, we need to check if they've completed the questionnaire
      // before redirecting to dashboard
      if (user) {
        // Check if the user has completed the questionnaire
        const { data: patientData, error: patientError } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        // If they have not completed the questionnaire, redirect to it
        if (!patientData && !patientError) {
          return NextResponse.redirect(new URL("/questionnaire", request.url));
        }
        
        // Otherwise redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // For authenticated users, check if they need to complete the questionnaire
    if (user && !userError) {
      // Skip questionnaire check for public paths and the questionnaire itself
      if (PUBLIC_PATHS.includes(pathname) || ONBOARDING_PATHS.includes(pathname)) {
        return response;
      }

      // Check if user has completed the questionnaire
      const { data: patientData, error: patientError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      // If there was an error checking questionnaire status, allow access to avoid locking users out
      if (patientError) {
        console.error('Error checking questionnaire status:', patientError);
        return response;
      }
      
      // If user hasn't completed questionnaire and is trying to access a protected path,
      // redirect to questionnaire with the redirect_from parameter
      if (!patientData && PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
        const questionnaireUrl = new URL('/questionnaire', request.url);
        questionnaireUrl.searchParams.set('redirect_from', pathname);
        return NextResponse.redirect(questionnaireUrl);
      }
      
      // If user has completed questionnaire and is trying to access questionnaire again,
      // redirect to dashboard
      if (patientData && ONBOARDING_PATHS.some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    console.error('Supabase client error:', e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};