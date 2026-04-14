"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { PortfolioData, RawUserDetails } from "@/types/portfolio";
import { demoData } from "@/lib/demo-data";

interface PortfolioContextValue {
  portfolioData: PortfolioData;
  rawFormData: RawUserDetails | null;
  isCustom: boolean;
  setPortfolioData: (data: PortfolioData, raw: RawUserDetails) => void;
  resetToDemo: () => void;
  toast: { message: string; type: "success" | "error" } | null;
  showToast: (message: string, type?: "success" | "error") => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolioData, setData] = useState<PortfolioData>(demoData);
  const [rawFormData, setRaw] = useState<RawUserDetails | null>(null);
  const [isCustom, setIsCustom] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const setPortfolioData = useCallback((data: PortfolioData, raw: RawUserDetails) => {
    setData(data);
    setRaw(raw);
    setIsCustom(true);
  }, []);

  const resetToDemo = useCallback(() => {
    setData(demoData);
    setRaw(null);
    setIsCustom(false);
  }, []);

  return (
    <PortfolioContext.Provider value={{ portfolioData, rawFormData, isCustom, setPortfolioData, resetToDemo, toast, showToast }}>
      {children}
      {toast && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transition-all ${
          toast.type === "success" ? "bg-zinc-900 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.message}
        </div>
      )}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used inside PortfolioProvider");
  return ctx;
}
