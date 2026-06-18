import type { Metadata } from "next";
import Navbar from "@/components/library/Navbar";
import PatternsGallery from "./PatternsGallery";

export const metadata: Metadata = {
  title: "Pattern Library — PortfolioForge",
  description:
    "Browse free CSS background patterns — gradients, geometric, decorative and effects. Copy the CSS or apply them to your portfolio.",
};

export default function PatternsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PatternsGallery />
    </div>
  );
}
