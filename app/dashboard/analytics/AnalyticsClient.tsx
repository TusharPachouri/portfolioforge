"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BarChart2, Eye, TrendingUp, Globe, Link2, Calendar, Copy, Check, ExternalLink, Share2 } from "lucide-react";

interface DailyView {
  day: string; // 'YYYY-MM-DD'
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
  published: boolean;
}

// Build a continuous 30-day series (UTC) from sparse rows.
function fill30Days(rows: DailyView[]): DailyView[] {
  const map = new Map(rows.map((r) => [r.day, r.count]));
  const out: DailyView[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ day: key, count: map.get(key) ?? 0 });
  }
  return out;
}

function prettyReferrer(ref: string | null): string {
  if (!ref) return "Direct";
  try {
    return new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return ref;
  }
}

function flagEmoji(code: string | null): string {
  if (!code || code.length !== 2) return "🌐";
  const cc = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return "🌐";
  return String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

function StatCard({ icon: Icon, label, value, sub }: {
  icon: React.ElementType; label: string; value: number | string; sub?: string;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-xs font-medium mb-3">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </div>
      <p className="text-3xl font-bold text-zinc-900 dark:text-white tabular-nums">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sub && <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{sub}</p>}
    </div>
  );
}

function DailyChart({ data }: { data: DailyView[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div>
      <div className="flex items-end gap-[3px] h-36 w-full" role="img" aria-label="Daily views, last 30 days">
        {data.map((d) => {
          const h = Math.max(3, Math.round((d.count / max) * 140));
          return (
            <div key={d.day} className="group relative flex-1 flex flex-col justify-end h-full">
              <div
                style={{ height: h }}
                className={`w-full rounded-sm transition-colors ${
                  d.count > 0 ? "bg-violet-500 group-hover:bg-violet-600" : "bg-zinc-100 dark:bg-zinc-800"
                }`}
              />
              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-10 whitespace-nowrap rounded-lg bg-zinc-900 dark:bg-zinc-700 px-2 py-1 text-[10px] font-medium text-white shadow-lg">
                {d.count} view{d.count !== 1 ? "s" : ""} · {d.day.slice(5)}
              </div>
            </div>
          );
        })}
      </div>
      {/* Axis labels — first, middle, last */}
      <div className="flex justify-between mt-2 text-[10px] text-zinc-400 dark:text-zinc-500">
        <span>{data[0]?.day.slice(5)}</span>
        <span>{data[Math.floor(data.length / 2)]?.day.slice(5)}</span>
        <span>Today</span>
      </div>
    </div>
  );
}

export default function AnalyticsClient({ analytics, slug, totalAllTime, published }: Props) {
  const { recentViews, topReferrers, topCountries, dailyViews } = analytics;
  const [copied, setCopied] = useState(false);

  const series = useMemo(() => fill30Days(dailyViews), [dailyViews]);
  const todayViews = series[series.length - 1]?.count ?? 0;
  const best = useMemo(() => series.reduce((a, b) => (b.count > a.count ? b : a), series[0] ?? { day: "", count: 0 }), [series]);
  const hasAnyViews = totalAllTime > 0 || analytics.totalViews > 0;

  const publicUrl = `portfolioforge.dev/u/${slug}`;
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(`https://${publicUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const maxRef = Math.max(...topReferrers.map((r) => r.count), 1);
  const maxCountry = Math.max(...topCountries.map((c) => c.count), 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-600 dark:text-violet-400 uppercase mb-2">Insights</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Portfolio <span className="font-display-serif italic font-normal">analytics</span>
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{publicUrl}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyUrl}
            className="press-scale inline-flex items-center gap-1.5 text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {copied ? <><Check className="h-4 w-4 text-emerald-500" aria-hidden="true" /> Copied</> : <><Copy className="h-4 w-4" aria-hidden="true" /> Copy link</>}
          </button>
          {published && (
            <a
              href={`/u/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-700 text-white px-3 py-2 rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" /> Visit
            </a>
          )}
        </div>
      </div>

      {/* Not-published notice */}
      {!published && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-sm text-amber-800 dark:text-amber-300">
          <Share2 className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-medium">Your portfolio isn&apos;t live yet</p>
            <p className="mt-0.5 text-amber-700 dark:text-amber-400">Publish it from the builder to start collecting views.</p>
          </div>
        </div>
      )}

      {!hasAnyViews ? (
        /* Empty state */
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-10 text-center shadow-sm">
          <div className="h-14 w-14 bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-violet-950 dark:to-indigo-950 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart2 className="h-6 w-6 text-violet-500" aria-hidden="true" />
          </div>
          <h2 className="font-semibold text-zinc-900 dark:text-white mb-1">No views yet</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto mb-5">
            Share your portfolio link — visits will show up here in real time.
          </p>
          <button
            onClick={copyUrl}
            className="press-scale inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors cursor-pointer"
          >
            {copied ? <><Check className="h-4 w-4 text-emerald-400" aria-hidden="true" /> Copied!</> : <><Copy className="h-4 w-4" aria-hidden="true" /> Copy your link</>}
          </button>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Eye} label="All-time views" value={totalAllTime} />
            <StatCard icon={TrendingUp} label="Last 30 days" value={recentViews} />
            <StatCard icon={Calendar} label="Today" value={todayViews} />
            <StatCard icon={BarChart2} label="Best day" value={best.count} sub={best.count > 0 ? best.day.slice(5) : undefined} />
          </div>

          {/* Daily chart */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-4">Daily views — last 30 days</h2>
            <DailyChart data={series} />
          </div>

          {/* Referrers + Countries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-4 flex items-center gap-1.5">
                <Link2 className="h-4 w-4 text-zinc-400" aria-hidden="true" /> Top referrers
              </h2>
              {topReferrers.length === 0 ? (
                <p className="text-sm text-zinc-400 dark:text-zinc-500">Mostly direct visits so far.</p>
              ) : (
                <ul className="space-y-3">
                  {topReferrers.map((r) => (
                    <li key={r.referrer ?? "direct"} className="flex items-center gap-2.5 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-300 truncate w-28 shrink-0">{prettyReferrer(r.referrer)}</span>
                      <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${Math.round((r.count / maxRef) * 100)}%` }} />
                      </div>
                      <span className="text-zinc-400 dark:text-zinc-500 text-xs shrink-0 tabular-nums w-6 text-right">{r.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-4 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-zinc-400" aria-hidden="true" /> Top countries
              </h2>
              {topCountries.length === 0 ? (
                <p className="text-sm text-zinc-400 dark:text-zinc-500">No country data yet.</p>
              ) : (
                <ul className="space-y-3">
                  {topCountries.map((c) => (
                    <li key={c.country ?? "unknown"} className="flex items-center gap-2.5 text-sm">
                      <span className="shrink-0 text-base leading-none" aria-hidden="true">{flagEmoji(c.country)}</span>
                      <span className="text-zinc-600 dark:text-zinc-300 font-mono text-xs uppercase w-7 shrink-0">{c.country ?? "??"}</span>
                      <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${Math.round((c.count / maxCountry) * 100)}%` }} />
                      </div>
                      <span className="text-zinc-400 dark:text-zinc-500 text-xs shrink-0 tabular-nums w-6 text-right">{c.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
            Views are de-duplicated against bots · <Link href="/dashboard" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">Back to builder</Link>
          </p>
        </>
      )}
    </div>
  );
}
