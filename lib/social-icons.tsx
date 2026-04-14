import { GitBranch, Briefcase, Globe, Mail, Link } from "lucide-react";
import type { ReactNode } from "react";

export function getSocialIcon(platform: string, className = "h-4 w-4"): ReactNode {
  const p = platform.toLowerCase();
  if (p === "github") return <GitBranch className={className} />;
  if (p === "linkedin") return <Briefcase className={className} />;
  if (p === "twitter" || p === "x") return <Globe className={className} />;
  if (p === "email" || p === "mail") return <Mail className={className} />;
  return <Link className={className} />;
}
