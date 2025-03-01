import { Beaker } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { ThemeSwitcher } from "@/components/theme-switcher";
import HeaderAuth from "@/components/header-auth";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Health Mapping Hub",
  description: "app with Next.js and Supabase",
};

const montserrat = Montserrat();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check authentication status
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Determine the "Find Trials" link based on auth status
  const findTrialsLink = user ? "/dashboard" : "/";
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background flex flex-col antialiased">
            <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
              <div className="container mx-auto px-4 flex h-16 items-center">
                <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-semibold">
                  <Beaker className="h-8 w-8 text-blue-600" />
                  <span className="text-lg">Health Mapping Hub</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
                  <Link href={findTrialsLink} className="text-md font-medium hover:underline underline-offset-8">Find Trials</Link>
                  <Link href="/contact" className="text-md font-medium hover:underline underline-offset-8">Contact</Link>
                  <ThemeSwitcher />
                  <HeaderAuth />
                </nav>
              </div>
            </header>
          
            <main className="flex-1">
              <div className="container mx-auto px-4 py-8">
                {children}
              </div>
            </main>
          
            <footer className="border-t py-4">
              <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Health Mapping Hub</span>
                </div>
                <p className="text-center text-sm text-muted-foreground md:text-left">
                  &copy; Health Mapping Hub, 2025. All rights reserved.
                </p>
                <nav className="flex gap-4 sm:gap-6">
                  <Link href="/terms" className="text-md font-medium hover:underline underline-offset-8 transition-colors">Terms</Link>
                  <Link href="/privacy" className="text-md font-medium hover:underline underline-offset-8 transition-colors">Privacy</Link>
                  <Link href="/contact" className="text-md font-medium hover:underline underline-offset-8 transition-colors">Contact</Link>
                </nav>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}