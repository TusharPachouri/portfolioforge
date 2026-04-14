import Navbar from "@/components/library/Navbar";
import ComponentsClient from "./ComponentsClient";

export const metadata = {
  title: "Component Library — PortfolioForge",
  description: "Browse 27+ portfolio section components. Free and Pro tiers.",
};

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <ComponentsClient />
    </div>
  );
}
