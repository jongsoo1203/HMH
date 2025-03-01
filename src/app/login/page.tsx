import { LoginForm } from "@/components/ui/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <div className="w-full text-center mb-4">
          {/* You can add your logo here */}
          {/* <Image src="/logo.svg" width={120} height={40} alt="Logo" className="mx-auto" /> */}
        </div>
        
        <LoginForm />
        
        <div className="w-full text-center mt-6 text-sm text-gray-500">
          {/* You can add footer content here */}
          {/* <p>© 2025 Your Company. All rights reserved.</p> */}
        </div>
      </div>
    </main>
  );
}