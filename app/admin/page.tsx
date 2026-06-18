import { db } from "@/lib/db";
import { users, portfolios, subscriptions } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { Users, Globe, Zap, BarChart2 } from "lucide-react";
import Logo from "@/components/Logo";

export const metadata = { title: "Admin — PortfolioForge" };
// Force dynamic so this never pre-renders during build (requires auth + live DB)
export const dynamic = "force-dynamic";

async function getAdminStats() {
  const [
    totalUsers,
    proUsers,
    totalPortfolios,
    publishedPortfolios,
    activeSubscriptions,
    recentUsers,
    topPortfolios,
  ] = await Promise.all([
    db.select({ count: count() }).from(users).then((r) => r[0]?.count ?? 0),

    db.select({ count: count() })
      .from(users)
      .where(eq(users.role, "pro"))
      .then((r) => r[0]?.count ?? 0),

    db.select({ count: count() }).from(portfolios).then((r) => r[0]?.count ?? 0),

    db.select({ count: count() })
      .from(portfolios)
      .where(eq(portfolios.published, true))
      .then((r) => r[0]?.count ?? 0),

    db.select({ count: count() })
      .from(subscriptions)
      .where(eq(subscriptions.status, "active"))
      .then((r) => r[0]?.count ?? 0),

    db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(10),

    db.select({
      slug: portfolios.slug,
      viewCount: portfolios.viewCount,
      published: portfolios.published,
      updatedAt: portfolios.updatedAt,
    })
      .from(portfolios)
      .orderBy(desc(portfolios.viewCount))
      .limit(10),
  ]);

  return {
    totalUsers,
    proUsers,
    totalPortfolios,
    publishedPortfolios,
    activeSubscriptions,
    recentUsers,
    topPortfolios,
  };
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200 px-6 py-4">
        <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
          <Logo className="h-7 w-7" />
          Admin Panel
        </h1>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard icon={Users} label="Total Users" value={stats.totalUsers} />
          <StatCard icon={Zap} label="Pro Users" value={stats.proUsers} color="violet" />
          <StatCard icon={Globe} label="Portfolios" value={stats.totalPortfolios} />
          <StatCard icon={Globe} label="Published" value={stats.publishedPortfolios} color="green" />
          <StatCard icon={BarChart2} label="Active Subs" value={stats.activeSubscriptions} color="violet" />
        </div>

        {/* Conversion rate */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-zinc-800 mb-3">Key Metrics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <Metric
              label="Pro conversion"
              value={
                stats.totalUsers > 0
                  ? `${Math.round((stats.proUsers / stats.totalUsers) * 100)}%`
                  : "0%"
              }
            />
            <Metric
              label="Publish rate"
              value={
                stats.totalPortfolios > 0
                  ? `${Math.round((stats.publishedPortfolios / stats.totalPortfolios) * 100)}%`
                  : "0%"
              }
            />
            <Metric label="Free users" value={stats.totalUsers - stats.proUsers} />
            <Metric label="Unpublished" value={stats.totalPortfolios - stats.publishedPortfolios} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent signups */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-800 mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-zinc-400" /> Recent Signups
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-400 border-b border-zinc-50">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((u) => (
                  <tr key={u.id} className="border-b border-zinc-50 last:border-0">
                    <td className="py-2">
                      <div className="font-medium text-zinc-700 truncate max-w-[120px]">
                        {u.name ?? "—"}
                      </div>
                      <div className="text-xs text-zinc-400 truncate max-w-[120px]">
                        {u.email ?? ""}
                      </div>
                    </td>
                    <td className="py-2">
                      <span
                        className={
                          u.role === "pro"
                            ? "text-xs bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-medium"
                            : u.role === "admin"
                            ? "text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-medium"
                            : "text-xs bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded-full"
                        }
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2 text-xs text-zinc-400 whitespace-nowrap">
                      {u.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top portfolios by views */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-800 mb-4 flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-zinc-400" /> Top Portfolios by Views
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-400 border-b border-zinc-50">
                  <th className="pb-2">Slug</th>
                  <th className="pb-2">Views</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.topPortfolios.map((p) => (
                  <tr key={p.slug} className="border-b border-zinc-50 last:border-0">
                    <td className="py-2">
                      <a
                        href={`/u/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-600 hover:underline font-medium"
                      >
                        {p.slug}
                      </a>
                    </td>
                    <td className="py-2 text-zinc-700 font-mono text-xs">
                      {p.viewCount.toLocaleString()}
                    </td>
                    <td className="py-2">
                      {p.published ? (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">Live</span>
                      ) : (
                        <span className="text-xs bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded-full">Draft</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color = "default",
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color?: "default" | "violet" | "green";
}) {
  const colors = {
    default: "text-zinc-400",
    violet: "text-violet-500",
    green: "text-emerald-500",
  };
  return (
    <div className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm">
      <Icon className={`h-4 w-4 mb-2 ${colors[color]}`} />
      <p className="text-2xl font-bold text-zinc-900">{value.toLocaleString()}</p>
      <p className="text-xs text-zinc-400 mt-0.5">{label}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <p className="text-lg font-bold text-zinc-900">{value}</p>
      <p className="text-xs text-zinc-400">{label}</p>
    </div>
  );
}
