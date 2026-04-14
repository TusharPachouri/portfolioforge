"use client";

import { BarChart2, Eye, TrendingUp, Globe, Link2 } from "lucide-react";

interface DailyView {
  day: string;
  count: number;
}

interface ReferrerRow {
  referrer: string | null;
  count: number;
}

interface CountryRow {
  country: string | null;
  count: number;
}

interface Analytics {
  totalViews: number;
  recentViews: number;
  topReferrers: ReferrerRow[];
  topCountries: CountryRow[];
  dailyViews: DailyView[];
}

interface Props {
  analytics: Analytics;
  slug: string;
  totalAllTime: number;
}

function StatCard({ icon: Icon, label, value, sub }: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium mb-3">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-3xl font-bold text-zinc-900">{value.toLocaleString()}</p>
      {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
    </div>
  );
}

function MiniBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-violet-500 rounded-full"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function DailyChart({ data }: { data: DailyView[] }) {
  if (data.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-sm text-zinc-400">
        No data yet
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.count), 1);

  // Fill in missing days (last 30 days)
  const filled: DailyView[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const found = data.find((r) => r.day === key);
    filled.push({ day: key, count: found?.count ?? 0 });
  }

  return (
    <div className="flex items-end gap-0.5 h-32 w-full">
      {filled.map((d) => {
        const h = max > 0 ? Math.max(4, Math.round((d.count / max) * 112)) : 4;
        const short = d.day.slice(5); // MM-DD
        return (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
            <div
              title={`${d.day}: ${d.count} views`}
              style={{ height: h }}
              className="w-full bg-violet-500 group-hover:bg-violet-600 rounded-sm transition-colors"
            />
            {/* Only show label every 7 days */}
            {filled.indexOf(d) % 7 === 0 && (
              <span className="text-[9px] text-zinc-400 rotate-0 whitespace-nowrap">{short}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsClient({ analytics, slug, totalAllTime }: Props) {
  const { totalViews, recentViews, topReferrers, topCountries, dailyViews } = analytics;
  const maxRef = Math.max(...topReferrers.map((r) => r.count), 1);
  const maxCountry = Math.max(...topCountries.map((c) => c.count), 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-1 flex items-center gap-2">
          <BarChart2 className="h-6 w-6" /> Analytics
        </h1>
        <p className="text-sm text-zinc-500">
          Stats for <span className="font-medium text-zinc-700">portfolioforge.dev/u/{slug}</span>
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Eye}
          label="All-time views"
          value={totalAllTime}
        />
        <StatCard
          icon={TrendingUp}
          label="Last 30 days"
          value={recentViews}
        />
        <StatCard
          icon={BarChart2}
          label="Tracked views"
          value={totalViews}
          sub="via view log"
        />
      </div>

      {/* Daily chart */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-700 mb-4">Daily views — last 30 days</h2>
        <DailyChart data={dailyViews} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Top referrers */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-700 mb-4 flex items-center gap-1.5">
            <Link2 className="h-4 w-4 text-zinc-400" /> Top referrers
          </h2>
          {topReferrers.length === 0 ? (
            <p className="text-sm text-zinc-400">No referrer data yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {topReferrers.map((r) => (
                <li key={r.referrer ?? "direct"} className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-600 truncate max-w-[140px]">
                    {r.referrer ?? "Direct"}
                  </span>
                  <MiniBar value={r.count} max={maxRef} />
                  <span className="text-zinc-400 text-xs shrink-0">{r.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top countries */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-700 mb-4 flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-zinc-400" /> Top countries
          </h2>
          {topCountries.length === 0 ? (
            <p className="text-sm text-zinc-400">No country data yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {topCountries.map((c) => (
                <li key={c.country ?? "unknown"} className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-600 w-8 shrink-0 font-mono text-xs uppercase">
                    {c.country ?? "??"}
                  </span>
                  <MiniBar value={c.count} max={maxCountry} />
                  <span className="text-zinc-400 text-xs shrink-0">{c.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
