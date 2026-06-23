import Link from "next/link";
import Logo from "@/components/Logo";
import { ArrowLeft, Sparkles, UserX } from "lucide-react";

export default function ProfileNotFound({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimal top bar */}
      <header className="border-b border-zinc-100 px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <Logo className="w-7 h-7" />
          <span className="text-sm font-bold text-zinc-900 group-hover:text-violet-600 transition-colors">
            PortfolioForge
          </span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center mx-auto">
            <UserX className="w-10 h-10 text-zinc-400" strokeWidth={1.5} />
          </div>
          {/* Violet glow ring */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
              transform: "scale(1.8)",
            }}
          />
        </div>

        {/* Slug badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-500 mb-5">
          <span className="text-zinc-400">/u/</span>
          <span className="text-zinc-700 font-semibold">{slug}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-3 tracking-tight">
          Portfolio not found
        </h1>
        <p className="text-zinc-500 text-base max-w-sm mx-auto leading-relaxed mb-10">
          <span className="font-medium text-zinc-700">@{slug}</span> hasn&apos;t published
          their portfolio yet — or this link doesn&apos;t exist.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 text-zinc-700 text-sm font-semibold hover:bg-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
          >
            <Sparkles className="w-4 h-4" />
            Build your portfolio free
          </Link>
        </div>

        {/* Divider + reassurance */}
        <div className="mt-16 pt-8 border-t border-zinc-100 max-w-xs mx-auto w-full">
          <p className="text-xs text-zinc-400">
            If you own <span className="font-mono text-zinc-600">portfolioforge.dev/u/{slug}</span>,{" "}
            <Link href="/auth/signin" className="text-violet-500 hover:text-violet-700 underline underline-offset-2 transition-colors">
              sign in
            </Link>{" "}
            and publish your portfolio to make this page live.
          </p>
        </div>
      </main>
    </div>
  );
}
