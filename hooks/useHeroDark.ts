"use client";
import { useState, useEffect } from "react";

/** Returns true while #pf-above-fold has data-dark-theme (WebGL / dark CSS pattern active) */
export function useHeroDark() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const el = document.getElementById("pf-above-fold");
    if (!el) return;

    const sync = () => setDark(el.hasAttribute("data-dark-theme"));
    sync();

    const obs = new MutationObserver(sync);
    obs.observe(el, { attributes: true, attributeFilter: ["data-dark-theme"] });
    return () => obs.disconnect();
  }, []);

  return dark;
}
