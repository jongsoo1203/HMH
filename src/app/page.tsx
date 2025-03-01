import { LoginForm } from "@/components/login-form";
import { ThemeAwareAvatar } from "@/components/theme-aware-avatar";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <div className="w-full text-center mb-2">
          <ThemeAwareAvatar size="large" />
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