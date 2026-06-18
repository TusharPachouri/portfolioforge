import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Terms of Service — PortfolioForge",
  description: "Terms and conditions for using PortfolioForge.",
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-zinc-400 mb-10">Last updated: April 2025</p>

        <div className="space-y-8 text-zinc-700">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed">
              By accessing or using PortfolioForge, you agree to be bound by these Terms of Service.
              If you do not agree, do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">2. Use of the Service</h2>
            <p className="text-sm leading-relaxed">
              You may use PortfolioForge to create and publish a professional portfolio. You are
              responsible for the accuracy of the content you publish and for ensuring it does not
              violate the rights of others.
            </p>
            <p className="text-sm leading-relaxed mt-3">
              You may not use the service to publish illegal, defamatory, or harmful content, or
              to impersonate others.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">3. Free and Pro Plans</h2>
            <p className="text-sm leading-relaxed">
              The free plan provides access to core portfolio building features with limited
              components and AI regenerations. The Pro plan, billed monthly or annually via Stripe,
              unlocks all themes, patterns, sections, unlimited AI regenerations, analytics, and
              custom domain support.
            </p>
            <p className="text-sm leading-relaxed mt-3">
              Subscriptions auto-renew until cancelled. You may cancel at any time; access continues
              until the end of the current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">4. Intellectual Property</h2>
            <p className="text-sm leading-relaxed">
              You retain ownership of the content you publish through PortfolioForge. By publishing,
              you grant us a limited licence to display your content as part of the service.
            </p>
            <p className="text-sm leading-relaxed mt-3">
              The PortfolioForge platform, codebase, and branding are owned by PortfolioForge and
              may not be copied or resold.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">5. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed">
              PortfolioForge is provided &quot;as is&quot;. We are not liable for any indirect, incidental,
              or consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">6. Termination</h2>
            <p className="text-sm leading-relaxed">
              We may suspend or terminate accounts that violate these terms. You may delete your
              account at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">7. Changes</h2>
            <p className="text-sm leading-relaxed">
              We may update these terms at any time. Continued use of the service after changes
              constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">8. Contact</h2>
            <p className="text-sm leading-relaxed">
              Questions?{" "}
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
          <Link href="/privacy" className="hover:text-zinc-600">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
