import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Header with login button */}
      <header className="flex justify-between items-center w-full">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={120}
          height={25}
          priority
        />
        <Link href="/login">
          <Button variant="outline" size="sm">
            Login
          </Button>
        </Link>
      </header>
      
      {/* Main content */}
      <main className="flex flex-col gap-8 items-center justify-center w-full">
        <h1 className="text-4xl font-bold text-center">Welcome to Our Website</h1>
        <p className="text-center text-muted-foreground max-w-md">
          This is the main page of your application. Users can navigate to the login page
          by clicking the login button in the top right corner.
        </p>
      </main>
      
    
    </div>
  );
}