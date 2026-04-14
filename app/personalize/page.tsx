import Navbar from "@/components/library/Navbar";
import PersonalizeClient from "./PersonalizeClient";

export const metadata = {
  title: "Personalize — PortfolioForge",
  description: "Fill in your details and generate your portfolio with Gemini AI.",
};

export default function PersonalizePage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <PersonalizeClient />
    </div>
  );
}
