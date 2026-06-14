// One-off fuzz test for lib/random-theme.ts — run with: npx tsx scripts/fuzz-random-theme.ts
import { generateRandomLayout, generateRandomStyle } from "../lib/random-theme";
import { validatePatternConfig } from "../lib/patterns/types";
import { getComponentById } from "../lib/components/registry";
import { FREE_COMPONENT_LIMIT } from "../lib/gate";

let fails = 0;
for (let i = 0; i < 200; i++) {
  for (const role of ["free", "pro"]) {
    const ids = generateRandomLayout(role);
    const style = generateRandomStyle(role);
    const subs = ids.map((id) => getComponentById(id)?.subcategory);
    if (role === "free" && ids.length > FREE_COMPONENT_LIMIT) { console.log("LIMIT FAIL", ids.length); fails++; }
    if (new Set(subs).size !== subs.length) { console.log("DUPLICATE SUBCATEGORY", subs); fails++; }
    if (subs[0] !== "Hero") { console.log("HERO NOT FIRST", subs); fails++; }
    if (subs[subs.length - 1] !== "Footer") { console.log("FOOTER NOT LAST", subs); fails++; }
    if (role === "free" && ids.some((id) => getComponentById(id)?.tier === "pro")) { console.log("PRO LEAK", ids); fails++; }
    if (!validatePatternConfig(style.patternConfig)) { console.log("INVALID CONFIG", JSON.stringify(style.patternConfig)); fails++; }
  }
}
console.log(fails === 0 ? "ALL 400 RUNS PASSED" : `${fails} FAILURES`);
const sample = generateRandomStyle("free");
console.log("sample:", JSON.stringify({ theme: sample.themeId, pattern: sample.patternId, config: sample.patternConfig }));
console.log("layout:", generateRandomLayout("free").join(", "));
