import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import { portfolios } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PortfolioData } from "@/types/portfolio";

export const runtime = "nodejs";
export const revalidate = 86400; // 24h cache

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({ params }: Props) {
  const { slug } = await params;

  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.slug, slug),
  });

  if (!portfolio?.published || !portfolio.portfolioData) {
    // Default OG image for PortfolioForge itself
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%", height: "100%",
            background: "linear-gradient(135deg, #18181b 0%, #3f3f46 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#18181b" }}>PF</span>
            </div>
            <span style={{ fontSize: 40, fontWeight: 700, color: "#ffffff" }}>PortfolioForge</span>
          </div>
          <p style={{ fontSize: 22, color: "#a1a1aa", margin: 0 }}>
            Build stunning portfolios in minutes
          </p>
        </div>
      ),
      { ...size }
    );
  }

  const data = portfolio.portfolioData as PortfolioData;
  const { hero, skills } = data;
  const topSkills = skills.categories.flatMap((c) => c.items).slice(0, 5);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
          display: "flex", flexDirection: "column",
          padding: "60px 72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: avatar + name/tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 40 }}>
          {hero.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.avatarUrl}
              width={120}
              height={120}
              style={{ borderRadius: "50%", border: "3px solid rgba(255,255,255,0.2)" }}
              alt=""
            />
          ) : (
            <div style={{
              width: 120, height: 120, borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 48, fontWeight: 700, color: "#fff" }}>
                {hero.name.charAt(0)}
              </span>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <h1 style={{ fontSize: 52, fontWeight: 800, color: "#ffffff", margin: 0 }}>
              {hero.name}
            </h1>
            <p style={{ fontSize: 26, color: "#a1a1aa", margin: 0, maxWidth: 700 }}>
              {hero.tagline}
            </p>
          </div>
        </div>

        {/* Location + availability */}
        <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
          {hero.location && (
            <span style={{
              fontSize: 18, color: "#71717a", background: "rgba(255,255,255,0.05)",
              padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
            }}>
              📍 {hero.location}
            </span>
          )}
          {hero.openToWork && (
            <span style={{
              fontSize: 18, color: "#22c55e", background: "rgba(34,197,94,0.1)",
              padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(34,197,94,0.3)",
            }}>
              ✅ Open to work
            </span>
          )}
        </div>

        {/* Skills */}
        {topSkills.length > 0 && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {topSkills.map((skill) => (
              <span
                key={skill}
                style={{
                  fontSize: 18, color: "#e4e4e7",
                  background: "rgba(255,255,255,0.08)",
                  padding: "8px 18px", borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: "auto", display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 18, color: "#52525b" }}>
            portfolioforge.dev/u/{slug}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "#ffffff",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#18181b" }}>PF</span>
            </div>
            <span style={{ fontSize: 18, color: "#71717a" }}>PortfolioForge</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
