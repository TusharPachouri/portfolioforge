"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

interface Props {
  children: ReactNode;
  col: number; // 0 | 1 | 2 — column position drives left→right stagger delay
}

export default function CardReveal({ children, col }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 52, scale: 0.93 }}
      transition={{ duration: 0.6, delay: col * 0.13, ease }}
      style={{ opacity: 0, y: 52, scale: 0.93 }} // inline initial so SSR renders hidden
    >
      {children}
    </motion.div>
  );
}
