import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 disabled:pointer-events-none disabled:opacity-50 rounded-lg cursor-pointer",
          variant === "default" && "bg-zinc-900 text-white hover:bg-zinc-700",
          variant === "secondary" && "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
          variant === "outline" && "border border-zinc-200 text-zinc-700 hover:bg-zinc-50",
          variant === "ghost" && "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
          variant === "link" && "text-zinc-900 underline-offset-4 hover:underline p-0 h-auto",
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-4 py-2 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          size === "icon" && "h-9 w-9",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
