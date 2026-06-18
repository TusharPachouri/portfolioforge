import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Privacy Policy — PortfolioForge",
  description: "How PortfolioForge collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-zinc-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900 text-sm">
            <Logo className="h-7 w-7" />
            PortfolioForge
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-zinc-400 mb-10">Last updated: April 2025</p>

        <div className="prose prose-zinc max-w-none space-y-8 text-zinc-700">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">1. Information We Collect</h2>
            <p className="text-sm leading-relaxed">
              When you sign in with GitHub, we receive your name, email address, and profile picture
              from GitHub. We store this information to create and manage your account.
            </p>
            <p className="text-sm leading-relaxed mt-3">
              We also collect the portfolio content you provide (work history, skills, projects, etc.)
              to generate and display your portfolio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">2. How We Use Your Information</h2>
            <ul className="text-sm space-y-1.5 list-disc list-inside">
              <li>To create and display your public portfolio</li>
              <li>To process payments via Stripe (we never store card details)</li>
              <li>To send transactional emails (welcome, portfolio live, billing)</li>
              <li>To provide portfolio view analytics to Pro users</li>
              <li>To improve the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">3. Third-Party Services</h2>
            <ul className="text-sm space-y-1.5 list-disc list-inside">
              <li><strong>GitHub OAuth</strong> — authentication</li>
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>Resend</strong> — transactional email delivery</li>
              <li><strong>Neon</strong> — database hosting</li>
              <li><strong>Upstash Redis</strong> — rate limiting and caching</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              Each third party has its own privacy policy. We only share the minimum data required
              for each service to function.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">4. Analytics</h2>
            <p className="text-sm leading-relaxed">
              We track anonymous page views on public portfolio pages (referrer and country) to
              provide analytics to Pro users. We do not use advertising trackers or third-party
              analytics scripts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">5. Data Retention</h2>
            <p className="text-sm leading-relaxed">
              Your data is retained for as long as your account is active. You may delete your
              account and all associated data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">6. Your Rights</h2>
            <p className="text-sm leading-relaxed">
              You have the right to access, correct, and delete your personal data. To exercise
              these rights, email us at{" "}
              <a href="mailto:hello@portfolioforge.dev" className="text-violet-600 hover:underline">
                hello@portfolioforge.dev
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">7. Contact</h2>
            <p className="text-sm leading-relaxed">
              Questions? Email{" "}
              <a href="mailto:hello@portfolioforge.dev" className="text-violet-600 hover:underline">
                hello@portfolioforge.dev
              </a>
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-100 mt-16">
        <div className="max-w-2xl mx-auto px-4 py-6 flex gap-4 text-xs text-zinc-400">
          <Link href="/" className="hover:text-zinc-600">Home</Link>
          <Link href="/terms" className="hover:text-zinc-600">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
