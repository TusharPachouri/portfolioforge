import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const metadata = { title: "Auth Error — PortfolioForge" };

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="h-12 w-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900 mb-2">Authentication failed</h1>
        <p className="text-zinc-500 text-sm mb-6">Something went wrong during sign-in. Please try again.</p>
        <Link href="/auth/signin"
          className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-all">
          Try again
        </Link>
      </div>
    </div>
  );
}
