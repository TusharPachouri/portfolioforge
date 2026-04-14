import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignInClient from "./SignInClient";

export const metadata: Metadata = { title: "Sign In — PortfolioForge" };

interface Props {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function SignInPage({ searchParams }: Props) {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;

  // Already signed in — send them where they were going
  if (session) redirect(callbackUrl ?? "/dashboard");

  return (
    <SignInClient
      callbackUrl={callbackUrl ?? "/dashboard?import=1"}
      error={error}
    />
  );
}
