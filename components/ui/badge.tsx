import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "pro" | "free";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variant === "default" && "bg-zinc-900 text-white",
        variant === "secondary" && "bg-zinc-100 text-zinc-700",
        variant === "outline" && "border border-zinc-200 text-zinc-600",
        variant === "pro" && "bg-violet-100 text-violet-700",
        variant === "free" && "bg-emerald-50 text-emerald-700",
        className
      )}
    >
      {children}
    </span>
  );
}
