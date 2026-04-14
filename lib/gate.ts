import type { PatternEntry } from "./patterns/types";
import type { ComponentEntry } from "./components/registry";
import type { ThemeEntry } from "./themes";

export function isPro(userRole: string): boolean {
  return userRole === "pro" || userRole === "admin";
}

export function canUsePattern(pattern: PatternEntry, userRole: string): boolean {
  if (!pattern.isPro) return true;
  return isPro(userRole);
}

export function canUseComponent(component: ComponentEntry, userRole: string): boolean {
  if (component.tier === "free") return true;
  return isPro(userRole);
}

export function canUseTheme(theme: ThemeEntry, userRole: string): boolean {
  if (!theme.isPro) return true;
  return isPro(userRole);
}

/** Maximum components a free user can add to their portfolio */
export const FREE_COMPONENT_LIMIT = 8;

export function canAddMoreComponents(currentCount: number, userRole: string): boolean {
  if (isPro(userRole)) return true;
  return currentCount < FREE_COMPONENT_LIMIT;
}
