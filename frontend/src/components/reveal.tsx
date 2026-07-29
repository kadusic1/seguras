"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

export type RevealAnimation =
  | "slideUp"
  | "slideDown"
  | "zoomIn"
  | "zoomOut"
  | "zoomIn"
  | "zoomOut";

interface RevealProps {
  children: ReactNode;
  animation?: RevealAnimation;
  duration?: number;
  delay?: number;
  threshold?: number | "some" | "all";
  className?: string;
}

const variants: Record<RevealAnimation, Variants> = {
  slideUp: {
    hidden: { y: 40 },
    visible: { y: 0 },
  },
  slideDown: {
    hidden: { y: -40 },
    visible: { y: 0 },
  },
  zoomIn: {
    hidden: { scale: 0.92 },
    visible: { scale: 1 },
  },
  zoomOut: {
    hidden: { scale: 1.08 },
    visible: { scale: 1 },
  },
};

export function Reveal({
  children,
  animation = "slideUp",
  duration = 500,
  threshold = 0.2,
  className,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      variants={variants[animation]}
      transition={{
        duration: duration / 1000,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
