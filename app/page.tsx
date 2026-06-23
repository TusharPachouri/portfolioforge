import Navbar from "@/components/library/Navbar";
import LibraryShowcase from "@/components/landing/LibraryShowcase";
import FanCardCarousel from "@/components/landing/FanCardCarousel";
import HeroWave from "@/components/landing/HeroWave";
import HeroContent from "@/components/landing/HeroContent";
import ScrollReveal from "@/components/landing/ScrollReveal";
import MainFooter from "@/components/library/MainFooter";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function HomePage() {
  const session = await auth();
  let avatarUrl: string | null = null;
  if (session?.user?.id) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { image: true },
    });
    avatarUrl = dbUser?.image ?? session.user.image ?? null;
  }

  return (
    <div className="pf-page-root min-h-screen bg-white dark:bg-[#191919] text-zinc-900 dark:text-white selection:bg-blue-100 dark:selection:bg-blue-900/30">

      {/* ── Above fold: Navbar + hero + trusted-by ─────────────── */}
      <div id="pf-above-fold" className="relative bg-white dark:bg-[#191919] pt-px pb-24" style={{ transition: "background 0.5s ease" }}>
        <Navbar avatarUrl={avatarUrl} />

        {/* Hero area — wave spans text + mockup */}
        <div id="pf-hero-zone" className="relative overflow-hidden">
          <HeroWave />
          {/* All hero content + mockup is animated client-side */}
          <HeroContent />
        </div>

        {/* Trusted By Strip */}
        <ScrollReveal delay={0.05}>
          <section className="text-center px-4 relative z-10">
            <p
              className="pf-page-text text-sm font-medium mb-8 uppercase tracking-widest text-xs"
              style={{ color: "var(--pf-page-muted)" }}
            >
              Trusted by 50% of the Forbes Cloud 100
            </p>
            <div
              className="pf-page-text flex flex-wrap justify-center items-center gap-x-12 gap-y-8 grayscale opacity-80"
              style={{ color: "var(--pf-page-muted)" }}
            >
              <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><div className="w-5 h-5 bg-current rounded-sm" /> Vercel</div>
              <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><div className="w-5 h-5 rounded-full border-4 border-current" /> OpenAI</div>
              <div className="flex items-center gap-2 font-bold text-xl tracking-tighter italic">Next.js</div>
              <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">tailwindcss</div>
              <div className="flex items-center gap-2 font-bold text-xl tracking-tighter font-serif">Figma</div>
              <div className="flex items-center gap-2 font-bold text-xl tracking-tighter uppercase">Stripe</div>
            </div>
          </section>
        </ScrollReveal>
      </div>

      {/* ── Library Showcase ────────────────────────────────────── */}
      <ScrollReveal>
        <section className="pf-section border-y border-zinc-200 dark:border-zinc-800 pb-24">
          <div className="max-w-6xl mx-auto px-4">
            <LibraryShowcase />
          </div>
        </section>
      </ScrollReveal>

      {/* ── Fan Card Carousel ────────────────────────────────────── */}
      <ScrollReveal delay={0.05}>
        <section className="pf-section border-b border-zinc-200 dark:border-zinc-800 py-24 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-14">
                <p className="text-xs font-semibold tracking-[0.22em] text-violet-500 uppercase mb-3">The creator</p>
                <h2
                  className="pf-page-text text-3xl sm:text-4xl font-bold tracking-tight mb-3"
                  style={{ color: "var(--pf-page-fg)" }}
                >
                  Built for developers, by a developer
                </h2>
                <p
                  className="pf-page-text text-base max-w-md mx-auto"
                  style={{ color: "var(--pf-page-muted)" }}
                >
                  PortfolioForge is made and maintained by a freelance engineer who needed it himself.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <FanCardCarousel />
            </ScrollReveal>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <ScrollReveal direction="none">
        <MainFooter />
      </ScrollReveal>

    </div>
  );
}
