"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export type RevealAnimation = "fadeIn" | "slideUp" | "slideDown" | "scaleIn";

interface RevealProps {
  children: ReactNode;
  animation?: RevealAnimation;
  duration?: number;
  delay?: number;
  threshold?: number;
  className?: string;
  as?: "div" | "span";
}

export function Reveal({
  children,
  animation = "fadeIn",
  duration = 600,
  delay = 0,
  threshold = 0.2,
  className,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${animation}${visible ? " reveal-visible" : ""}${className ? ` ${className}` : ""}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
