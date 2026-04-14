import Navbar from "@/components/library/Navbar";
import PreviewClient from "./PreviewClient";
import { auth } from "@/auth";

export const metadata = {
  title: "Preview — PortfolioForge",
  description: "Preview your assembled portfolio.",
};

export default async function PreviewPage() {
  const session = await auth();
  const isSignedIn = !!session?.user?.id;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <PreviewClient isSignedIn={isSignedIn} />
    </div>
  );
}
