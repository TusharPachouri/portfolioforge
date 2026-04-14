import type { Metadata } from "next";
import UpgradePageClient from "./UpgradePageClient";

export const metadata: Metadata = { title: "Upgrade to Pro — PortfolioForge" };

export default function UpgradePage() {
  return <UpgradePageClient />;
}
