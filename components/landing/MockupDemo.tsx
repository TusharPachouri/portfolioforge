"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Layers, Lock, FileText, Plus, Moon, ExternalLink, RefreshCw, BarChart, Settings, LayoutTemplate, Palette, PenLine } from "lucide-react";
import Logo from "@/components/Logo";

export default function MockupDemo() {
  const [phase, setPhase] = useState<"idle" | "moving_to_generate" | "generating" | "built" | "moving_to_link" | "live">("idle");
  const [cursorPos, setCursorPos] = useState({ x: "80%", y: "80%" });
  const [cursorActive, setCursorActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [components, setComponents] = useState<string[]>([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let mounted = true;
    const runAnimation = async () => {
      // Reset
      setCursorPos({ x: "80%", y: "80%" });
      setComponents([]);
      setMenuOpen(false);
      setIsLive(false);
      await new Promise(r => setTimeout(r, 1000));
      if (!mounted) return;

      // Move to Add
      setCursorPos({ x: "400px", y: "85px" }); // Fixed px for reliability
      await new Promise(r => setTimeout(r, 1000));
      if (!mounted) return;

      // Click Add
      setCursorActive(true);
      await new Promise(r => setTimeout(r, 150));
      setCursorActive(false);
      setMenuOpen(true);
      await new Promise(r => setTimeout(r, 500));
      if (!mounted) return;

      // Move to Hero Section
      setCursorPos({ x: "400px", y: "130px" });
      await new Promise(r => setTimeout(r, 600));
      if (!mounted) return;

      // Click Hero Section
      setCursorActive(true);
      await new Promise(r => setTimeout(r, 150));
      setCursorActive(false);
      setMenuOpen(false);
      setComponents(["Hero"]);
      await new Promise(r => setTimeout(r, 1000));
      if (!mounted) return;

      // Move to Add again
      setCursorPos({ x: "400px", y: "85px" });
      await new Promise(r => setTimeout(r, 800));
      if (!mounted) return;

      // Click Add
      setCursorActive(true);
      await new Promise(r => setTimeout(r, 150));
      setCursorActive(false);
      setMenuOpen(true);
      await new Promise(r => setTimeout(r, 500));
      if (!mounted) return;

      // Move to Projects
      setCursorPos({ x: "400px", y: "170px" });
      await new Promise(r => setTimeout(r, 600));
      if (!mounted) return;

      // Click Projects
      setCursorActive(true);
      await new Promise(r => setTimeout(r, 150));
      setCursorActive(false);
      setMenuOpen(false);
      setComponents(["Hero", "Projects"]);
      await new Promise(r => setTimeout(r, 1500));
      if (!mounted) return;

      // Move to Link
      setCursorPos({ x: "50%", y: "28px" });
      await new Promise(r => setTimeout(r, 1000));
      if (!mounted) return;

      // Click Link
      setCursorActive(true);
      await new Promise(r => setTimeout(r, 150));
      setCursorActive(false);
      setIsLive(true);
      setCursorPos({ x: "120%", y: "80%" }); // Move out

      await new Promise(r => setTimeout(r, 6000));
      if (!mounted) return;
      runAnimation();
    };

    runAnimation();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="w-full overflow-x-auto pb-8 -mb-8 custom-scrollbar">
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 bg-white dark:bg-[#121212] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden relative flex flex-col h-[600px] min-w-[900px] w-full max-w-5xl mx-auto">
        
        {/* Animated Cursor */}
        <motion.div 
          className="absolute z-[100] pointer-events-none"
          animate={{ 
            left: cursorPos.x, 
            top: cursorPos.y,
            scale: cursorActive ? 0.8 : 1
          }}
          transition={{ 
            left: { duration: 0.8, ease: "easeInOut" },
            top: { duration: 0.8, ease: "easeInOut" },
            scale: { duration: 0.1 }
          }}
          style={{ transformOrigin: "top left" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg text-black dark:text-white">
            <path d="M4 4L11.33 21.08L14.47 14.47L21.08 11.33L4 4Z" fill="currentColor" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* Mock App Header */}
        <div className="h-14 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-4 bg-white dark:bg-[#121212] z-20 shrink-0 relative">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6" />
            <span className="font-semibold text-sm">PortfolioForge</span>
          </div>

          <motion.div 
            animate={{
              backgroundColor: isLive ? "var(--tw-colors-blue-50)" : "var(--tw-colors-zinc-50)",
            }}
            className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 gap-2 cursor-pointer transition-colors"
          >
            <Lock className="w-3 h-3" />
            <span className={isLive ? "text-blue-600 dark:text-blue-400 font-medium" : ""}>
              portfolioforge.dev/u/ipandeysumit
            </span>
            {!isLive && <FileText className="w-3 h-3 ml-2" />}
            {!isLive && <ExternalLink className="w-3 h-3" />}
          </motion.div>

          <div className="flex items-center gap-3">
            <Moon className="w-4 h-4 text-zinc-400" />
            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-full text-xs font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              Live
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400" />
          </div>
        </div>

        {/* Mock App Body */}
        <div className="flex flex-1 overflow-hidden bg-white dark:bg-[#121212] text-left relative">
          
          {/* Left Nav */}
          <div className="w-[180px] border-r border-zinc-100 dark:border-zinc-800 p-4 flex flex-col gap-6 shrink-0 bg-white dark:bg-[#121212]">
            <div>
              <div className="text-[10px] font-bold text-zinc-400 tracking-wider mb-2 uppercase">Build</div>
              <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-md px-3 py-2 text-sm font-medium flex items-center gap-2 shadow-sm">
                <Layers className="w-4 h-4" /> Builder
              </div>
              <div className="text-zinc-600 dark:text-zinc-400 px-3 py-2 text-sm font-medium flex items-center gap-2 mt-1">
                <PenLine className="w-4 h-4" /> Edit Details
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-zinc-400 tracking-wider mb-2 uppercase">Customize</div>
              <div className="text-zinc-600 dark:text-zinc-400 px-3 py-2 text-sm font-medium flex items-center gap-2">
                <Palette className="w-4 h-4" /> Theme
              </div>
              <div className="text-zinc-600 dark:text-zinc-400 px-3 py-2 text-sm font-medium flex items-center gap-2 mt-1">
                <LayoutTemplate className="w-4 h-4" /> Pattern
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="w-[240px] border-r border-zinc-100 dark:border-zinc-800 p-4 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/20 shrink-0 relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-sm">My Components</h3>
                <p className="text-xs text-zinc-500">{components.length} sections</p>
              </div>
              <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium px-2 py-1 rounded flex items-center gap-1 shadow-sm relative">
                <Plus className="w-3 h-3" /> Add
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-[#1e1e1e] border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl overflow-hidden z-30"
                    >
                      <div className="px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800">
                        Hero Section
                      </div>
                      <div className="px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        Projects
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
              {components.length === 0 ? (
                <div className="border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-white dark:bg-[#121212] mt-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 text-zinc-400">
                    <LayoutTemplate className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-200">Empty canvas</h4>
                  <p className="text-xs text-zinc-400">Add a component</p>
                </div>
              ) : (
                <AnimatePresence>
                  {components.map((comp, i) => (
                    <motion.div 
                      key={comp + i}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 flex items-center gap-3 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded bg-violet-50 dark:bg-violet-900/30 text-violet-500 flex items-center justify-center">
                        <LayoutTemplate className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{comp}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Main Preview */}
          <motion.div 
            layout
            animate={{
              position: isLive ? "absolute" : "relative",
              inset: isLive ? 0 : "auto",
              zIndex: isLive ? 40 : 10
            }}
            className={`flex-1 bg-zinc-50 dark:bg-zinc-900/50 p-6 flex flex-col`}
          >
            {/* Toolbar */}
            <motion.div 
              animate={{ opacity: isLive ? 0 : 1 }}
              className="flex justify-between items-center mb-6 shrink-0"
            >
              <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                <RefreshCw className="w-3 h-3" /> Saved
              </div>
              <div className="flex gap-2">
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm">
                  <PenLine className="w-3 h-3" /> Edit Code
                </div>
                <div className="bg-violet-500 hover:bg-violet-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3 h-3" /> AI Assist
                </div>
              </div>
            </motion.div>

            {/* Canvas */}
            <div className="flex-1 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-[#0a0a0a] shadow-sm relative overflow-hidden flex flex-col">
              
              {components.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-700 m-4 rounded-xl">
                  <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-500 mb-6 relative">
                    <Plus className="w-8 h-8 relative z-10" />
                  </div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Build your portfolio</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
                    Click the Add button to insert premium, customizable sections.
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="max-w-3xl mx-auto px-8 py-12 flex flex-col gap-12">
                    
                    {/* Render Hero */}
                    {components.includes("Hero") && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-28 h-28 shrink-0 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-1 shadow-xl">
                          <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-full overflow-hidden border-2 border-white dark:border-zinc-900">
                             <img src="/tushar-image.png" alt="Profile" className="w-full h-full object-cover" />
                          </div>
                        </div>
                        <div className="text-center md:text-left mt-2">
                          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-zinc-900 dark:text-white tracking-tight">Tushar Pachouri</h1>
                          <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg max-w-lg leading-relaxed">
                            Software developer & product designer. I build stunning user interfaces and scalable web systems.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Render Projects */}
                    {components.includes("Projects") && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Layers className="w-5 h-5 text-violet-500"/> Featured Work</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="group bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 transition-all hover:shadow-md">
                             <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                               <LayoutTemplate className="w-5 h-5"/>
                             </div>
                             <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">SaaS Dashboard</h3>
                             <p className="text-sm text-zinc-500 dark:text-zinc-400">React, Next.js, Framer Motion.</p>
                          </div>
                          <div className="group bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 transition-all hover:shadow-md">
                             <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                               <PenLine className="w-5 h-5"/>
                             </div>
                             <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">Design System</h3>
                             <p className="text-sm text-zinc-500 dark:text-zinc-400">Tailwind CSS component library.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
