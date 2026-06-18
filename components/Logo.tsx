import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden group shadow-sm transition-transform duration-300 hover:scale-105",
        className || "h-8 w-8"
      )}
    >
      {/* Premium dark/light backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-zinc-950 dark:from-zinc-100 dark:to-zinc-300" />
      
      {/* Colorful energetic glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Isometric Building Block Icon (Represents forging/components) */}
      <svg viewBox="0 0 32 32" className="w-[65%] h-[65%] relative z-10 drop-shadow-md" fill="none">
        {/* Full hexagon base with vibrant gradient */}
        <path d="M8 12.5L16 8L24 12.5V20.5L16 25L8 20.5V12.5Z" fill="url(#pf-logo-grad)" />
        {/* Top face */}
        <path d="M16 8L24 12.5L16 17L8 12.5L16 8Z" className="fill-white/40 dark:fill-white/60" />
        {/* Left face shadow */}
        <path d="M8 12.5V20.5L16 25V17L8 12.5Z" className="fill-black/20 dark:fill-black/10" />
        <defs>
          <linearGradient id="pf-logo-grad" x1="8" y1="8" x2="24" y2="25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a855f7" />
            <stop offset="1" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Inner premium border highlight */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20 dark:ring-black/10 pointer-events-none" />
    </div>
  );
}
