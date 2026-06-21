"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, TrendingUp, Calendar, BarChart2, Copy, Check, ExternalLink, Share2, Link2, Globe, MoreHorizontal } from "lucide-react";

interface DailyView  { day: string; count: number; }
interface ReferrerRow { referrer: string | null; count: number; }
interface CountryRow  { country: string | null; count: number; }
interface Analytics {
  totalViews: number; recentViews: number;
  topReferrers: ReferrerRow[]; topCountries: CountryRow[]; dailyViews: DailyView[];
}
interface Props {
  analytics: Analytics; slug: string; totalAllTime: number;
  published: boolean; userName?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function prettyReferrer(ref: string | null) {
  if (!ref) return "Direct";
  try { return new URL(ref).hostname.replace(/^www\./, ""); }
  catch { return ref; }
}

function flagEmoji(code: string | null) {
  if (!code || code.length !== 2) return "🌐";
  const cc = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return "🌐";
  return String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  return d;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, badge }: {
  label: string; value: string | number; icon: React.ElementType; badge?: { text: string; positive: boolean };
}) {
  return (
    <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">{label}</span>
        <button className="h-6 w-6 flex items-center justify-center rounded-lg text-zinc-300 hover:text-zinc-500 transition-colors cursor-pointer">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className="text-2xl font-bold text-zinc-900 tabular-nums leading-none">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {badge && (
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
            badge.positive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}>
            {badge.positive ? "+" : ""}{badge.text}
          </span>
        )}
      </div>
      <div className="h-8 w-8 rounded-xl bg-violet-50 flex items-center justify-center">
        <Icon className="h-4 w-4 text-violet-500" />
      </div>
    </div>
  );
}

function LineChart({ data }: { data: DailyView[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 500, H = 160;
  const PAD = { t: 16, r: 12, b: 28, l: 44 };
  const cW = W - PAD.l - PAD.r, cH = H - PAD.t - PAD.b;
  const max = Math.max(...data.map(d => d.count), 1);

  // Y-axis grid
  const yTicks = [0, Math.ceil(max / 2), max];

  const pts: [number, number][] = data.map((d, i) => [
    PAD.l + (i / (data.length - 1)) * cW,
    PAD.t + (1 - d.count / max) * cH,
  ]);

  const line = smoothPath(pts);
  const area = pts.length > 1
    ? `${line} L ${pts[pts.length - 1][0]},${PAD.t + cH} L ${pts[0][0]},${PAD.t + cH} Z`
    : "";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }} onMouseLeave={() => setHover(null)}>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y grid lines */}
      {yTicks.map((v) => {
        const y = PAD.t + (1 - v / max) * cH;
        return (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke="#f4f4f5" strokeWidth="1" />
            <text x={PAD.l - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#a1a1aa">{v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}</text>
          </g>
        );
      })}

      {/* Area + line */}
      {area && <path d={area} fill="url(#lg)" />}
      {line && <path d={line} fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinejoin="round" />}

      {/* Points + hover interaction */}
      {pts.map(([x, y], i) => (
        <g key={i} onMouseEnter={() => setHover(i)}>
          <rect x={x - 12} y={PAD.t} width={24} height={cH} fill="transparent" />
          {hover === i && (
            <>
              <line x1={x} x2={x} y1={PAD.t} y2={PAD.t + cH} stroke="#7c3aed" strokeWidth="1" strokeDasharray="3 2" />
              <circle cx={x} cy={y} r={4} fill="#7c3aed" stroke="white" strokeWidth="2" />
              <rect x={x - 40} y={y - 34} width={80} height={28} rx={6} fill="#18181b" />
              <text x={x} y={y - 22} textAnchor="middle" fontSize="10" fill="#a78bfa" fontWeight="600">
                {data[i].count.toLocaleString()} views
              </text>
              <text x={x} y={y - 10} textAnchor="middle" fontSize="9" fill="#a1a1aa">
                {data[i].day.slice(5)}
              </text>
            </>
          )}
        </g>
      ))}

      {/* X-axis day labels — every 5th */}
      {data.map((d, i) => {
        if (i % 5 !== 0 && i !== data.length - 1) return null;
        const x = PAD.l + (i / (data.length - 1)) * cW;
        const label = i === data.length - 1 ? "Today" : DAY_LABELS[new Date(d.day).getDay()];
        return (
          <text key={d.day} x={x} y={H - 6} textAnchor="middle" fontSize="9" fill="#a1a1aa">{label}</text>
        );
      })}
    </svg>
  );
}

function BarChartViz({ data }: { data: DailyView[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const last7 = data.slice(-7);
  const W = 300, H = 160;
  const PAD = { t: 16, r: 12, b: 28, l: 44 };
  const cW = W - PAD.l - PAD.r, cH = H - PAD.t - PAD.b;
  const max = Math.max(...last7.map(d => d.count), 1);
  const gap = 6;
  const barW = (cW - gap * (last7.length - 1)) / last7.length;

  const yTicks = [0, Math.ceil(max / 2), max];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }} onMouseLeave={() => setHover(null)}>
      <defs>
        <linearGradient id="bgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="1" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {yTicks.map((v) => {
        const y = PAD.t + (1 - v / max) * cH;
        return (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke="#f4f4f5" strokeWidth="1" />
            <text x={PAD.l - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#a1a1aa">{v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}</text>
          </g>
        );
      })}

      {last7.map((d, i) => {
        const bH = Math.max(2, (d.count / max) * cH);
        const x = PAD.l + i * (barW + gap);
        const y = PAD.t + cH - bH;
        const label = DAY_LABELS[new Date(d.day).getDay()];
        return (
          <g key={d.day} onMouseEnter={() => setHover(i)}>
            <rect
              x={x} y={y} width={barW} height={bH} rx={3}
              fill={hover === i ? "#6d28d9" : "url(#bgrad)"}
              className="transition-colors"
            />
            {hover === i && d.count > 0 && (
              <>
                <rect x={x + barW / 2 - 24} y={y - 26} width={48} height={20} rx={4} fill="#18181b" />
                <text x={x + barW / 2} y={y - 12} textAnchor="middle" fontSize="9" fill="white" fontWeight="600">
                  {d.count} views
                </text>
              </>
            )}
            <text x={x + barW / 2} y={H - 6} textAnchor="middle" fontSize="9" fill="#a1a1aa">{label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AnalyticsClient({ analytics, slug, totalAllTime, published, userName }: Props) {
  const { recentViews, topReferrers, topCountries, dailyViews } = analytics;
  const [copied, setCopied] = useState(false);

  const series = useMemo(() => fill30Days(dailyViews), [dailyViews]);
  const todayViews = series[series.length - 1]?.count ?? 0;
  const best = useMemo(() => series.reduce((a, b) => (b.count > a.count ? b : a), series[0] ?? { day: "", count: 0 }), [series]);
  const avgPerDay = series.length ? Math.round(recentViews / 30) : 0;
  const hasAnyViews = totalAllTime > 0 || analytics.totalViews > 0;

  const publicUrl = `portfolioforge.dev/u/${slug}`;
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(`https://${publicUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const maxCountry = Math.max(...topCountries.map((c) => c.count), 1);
  const totalCountryViews = topCountries.reduce((s, c) => s + c.count, 0) || 1;

  const COUNTRY_COLORS = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 leading-tight">
            Welcome back, {userName ?? "there"}!
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">Here&apos;s a quick overview of your portfolio performance today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyUrl}
            className="press-scale inline-flex items-center gap-1.5 text-sm font-medium border border-zinc-200 text-zinc-600 px-3.5 py-2 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            {copied ? <><Check className="h-4 w-4 text-emerald-500" /> Copied</> : <><Copy className="h-4 w-4" /> Copy link</>}
          </button>
          {published && (
            <a href={`/u/${slug}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-zinc-900 text-white px-3.5 py-2 rounded-xl hover:bg-zinc-700 transition-colors">
              <ExternalLink className="h-4 w-4" /> Visit
            </a>
          )}
        </div>
      </div>

      {/* Not published */}
      {!published && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <Share2 className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Your portfolio isn&apos;t live yet</p>
            <p className="mt-0.5 text-amber-700">Publish it from the builder to start collecting views.</p>
          </div>
        </div>
      )}

      {!hasAnyViews ? (
        /* Empty state */
        <div className="bg-white border border-zinc-100 rounded-2xl p-10 text-center shadow-sm">
          <div className="h-14 w-14 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart2 className="h-6 w-6 text-violet-500" />
          </div>
          <h2 className="font-semibold text-zinc-900 mb-1">No views yet</h2>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto mb-5">
            Share your portfolio link — visits will show up here in real time.
          </p>
          <button onClick={copyUrl}
            className="press-scale inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors cursor-pointer">
            {copied ? <><Check className="h-4 w-4 text-emerald-400" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy your link</>}
          </button>
        </div>
      ) : (
        <>
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Eye}       label="Total Views"   value={totalAllTime} badge={{ text: "all time", positive: true }} />
            <StatCard icon={TrendingUp} label="Last 30 Days" value={recentViews}  badge={{ text: "+this month", positive: true }} />
            <StatCard icon={Calendar}  label="Today"         value={todayViews}   />
            <StatCard icon={BarChart2} label="Daily Average" value={avgPerDay}    badge={{ text: "/ day", positive: true }} />
          </div>

          {/* ── Charts row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Line chart — views over 30 days */}
            <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h2 className="text-sm font-bold text-zinc-900">Views Graph</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Last 30 days</p>
                </div>
                <button className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-300 hover:text-zinc-500 transition-colors cursor-pointer">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <LineChart data={series} />
            </div>

            {/* Bar chart — last 7 days */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h2 className="text-sm font-bold text-zinc-900">Daily Visits</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">This week</p>
                </div>
                <button className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-300 hover:text-zinc-500 transition-colors cursor-pointer">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <BarChartViz data={series} />
            </div>
          </div>

          {/* ── Bottom row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Referrers table */}
            <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-50">
                <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-zinc-400" /> Top Referrers
                </h2>
                <button className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-300 hover:text-zinc-500 transition-colors cursor-pointer">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              {topReferrers.length === 0 ? (
                <p className="text-sm text-zinc-400 p-5">Mostly direct visits so far.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-50">
                      <th className="px-5 py-2.5 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-wider w-8">#</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Source</th>
                      <th className="px-5 py-2.5 text-right text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {topReferrers.slice(0, 6).map((r, i) => (
                      <tr key={r.referrer ?? "direct"} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="px-5 py-3 text-xs font-bold text-zinc-300">{i + 1}</td>
                        <td className="px-2 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                              <Link2 className="h-3.5 w-3.5 text-violet-400" />
                            </div>
                            <span className="font-medium text-zinc-700 truncate max-w-[140px]">
                              {prettyReferrer(r.referrer)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-zinc-900 tabular-nums">{r.count.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Top Countries */}
            <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-50">
                <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-zinc-400" /> Top Countries
                </h2>
                <button className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-300 hover:text-zinc-500 transition-colors cursor-pointer">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              {topCountries.length === 0 ? (
                <p className="text-sm text-zinc-400 p-5">No country data yet.</p>
              ) : (
                <div className="p-5 space-y-3.5">
                  {topCountries.slice(0, 6).map((c, i) => {
                    const pct = Math.round((c.count / totalCountryViews) * 100);
                    const color = COUNTRY_COLORS[i % COUNTRY_COLORS.length];
                    return (
                      <div key={c.country ?? "unknown"} className="flex items-center gap-3">
                        <span className="text-lg leading-none shrink-0" aria-hidden="true">{flagEmoji(c.country)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-zinc-700 truncate">
                              {c.country ?? "Unknown"}
                            </span>
                            <span className="text-xs font-bold text-zinc-500 tabular-nums shrink-0 ml-2">{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${Math.round((c.count / maxCountry) * 100)}%`, background: color }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-zinc-400 tabular-nums shrink-0 w-8 text-right">{c.count}</span>
                      </div>
                    );
                  })}

                  {/* Color legend */}
                  {topCountries.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-zinc-50 mt-2">
                      {topCountries.slice(0, 6).map((c, i) => (
                        <span key={c.country ?? i} className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ background: COUNTRY_COLORS[i % COUNTRY_COLORS.length] }} />
                          {c.country ?? "Unknown"} {Math.round((c.count / totalCountryViews) * 100)}%
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-zinc-400">
            Views are de-duplicated against bots ·{" "}
            <Link href="/dashboard" className="underline hover:text-zinc-600">Back to builder</Link>
          </p>
        </>
      )}
    </div>
  );
}
