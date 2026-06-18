"use client";

import { useState, useRef, useTransition } from "react";
import { updateSlug, updateAvatarUrl } from "@/lib/actions/portfolio";
import { openBillingPortal } from "@/lib/actions/billing";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { Loader2, CheckCircle2, AlertCircle, Upload, Zap, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  currentSlug: string;
  currentAvatar: string;
  userEmail: string;
  userName: string;
  userRole: string;
  hasSubscription: boolean;
}

export default function SettingsClient({ currentSlug, currentAvatar, userEmail, userName, userRole, hasSubscription }: Props) {
  const router = useRouter();
  const { showToast } = usePortfolio();
  const [isPendingBilling, startBillingTransition] = useTransition();
  const proUser = userRole === "pro" || userRole === "admin";

  // Slug
  const [slug, setSlug] = useState(currentSlug);
  const [slugError, setSlugError] = useState("");
  const [isPendingSlug, startSlugTransition] = useTransition();

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSlugSave = () => {
    setSlugError("");
    startSlugTransition(async () => {
      const result = await updateSlug(slug);
      if (result.error) {
        setSlugError(result.error);
      } else {
        showToast("Slug updated ✓");
        router.refresh();
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { showToast("File must be under 5MB", "error"); return; }
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      showToast("Only JPG, PNG, WebP and AVIF allowed", "error"); return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("kind", "avatar");
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) { showToast(data?.error || "Upload failed", "error"); return; }

      await updateAvatarUrl(data.url);
      setAvatarUrl(data.url);
      showToast("Avatar updated ✓");
      router.refresh();
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Settings</h1>
        <p className="text-sm text-zinc-500">Manage your portfolio URL, avatar, and account</p>
      </div>

      {/* Avatar */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-zinc-900">Profile Picture</h2>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl bg-zinc-100 overflow-hidden flex-shrink-0">
            {avatarUrl
              ? <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              : <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-zinc-400">{userName[0]}</div>
            }
          </div>
          <div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50 cursor-pointer disabled:opacity-50"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Uploading..." : "Upload photo"}
            </button>
            <p className="text-xs text-zinc-400 mt-1">JPG, PNG, WebP or AVIF · max 5MB</p>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleFileUpload} />
          </div>
        </div>
      </div>

      {/* Slug */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="font-semibold text-zinc-900">Portfolio URL</h2>
          <p className="text-sm text-zinc-500 mt-1">Your public portfolio lives at this URL. Choose carefully — you can only change it once.</p>
        </div>
        <div className="flex items-center gap-0 border border-zinc-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-zinc-900">
          <span className="bg-zinc-50 px-3 py-2.5 text-sm text-zinc-500 border-r border-zinc-200 whitespace-nowrap">portfolioforge.dev/u/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugError(""); }}
            className="flex-1 px-3 py-2.5 text-sm text-zinc-900 focus:outline-none bg-white"
            placeholder="your-slug"
          />
        </div>
        {slugError && (
          <div className="flex items-center gap-1.5 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" /> {slugError}
          </div>
        )}
        <button
          onClick={handleSlugSave}
          disabled={isPendingSlug || slug === currentSlug}
          className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-700 disabled:opacity-50 cursor-pointer"
        >
          {isPendingSlug ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Save URL
        </button>
      </div>

      {/* Account info */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm space-y-3">
        <h2 className="font-semibold text-zinc-900">Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-zinc-50">
            <span className="text-zinc-400">Name</span><span className="text-zinc-700">{userName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-zinc-50">
            <span className="text-zinc-400">Email</span><span className="text-zinc-700">{userEmail}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-zinc-400">Plan</span>
            {proUser ? (
              <span className="inline-flex items-center gap-1 text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">
                <Zap className="h-3 w-3" /> Pro
              </span>
            ) : (
              <span className="inline-flex items-center text-xs bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full font-medium">Free</span>
            )}
          </div>
        </div>

        {/* Billing actions */}
        {proUser && hasSubscription ? (
          <button
            onClick={() => startBillingTransition(async () => { await openBillingPortal(); })}
            disabled={isPendingBilling}
            className="inline-flex items-center gap-2 border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50 cursor-pointer disabled:opacity-50"
          >
            {isPendingBilling ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
            Manage Billing
          </button>
        ) : !proUser ? (
          <Link
            href="/dashboard/upgrade"
            className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors"
          >
            <Zap className="h-4 w-4" /> Upgrade to Pro
          </Link>
        ) : null}
      </div>
    </div>
  );
}
