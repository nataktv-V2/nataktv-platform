"use client";

import { useEffect, useRef } from "react";

export function AdScaler({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function fit() {
      const inner = innerRef.current;
      const outer = outerRef.current;
      if (!inner || !outer) return;

      const el = inner.firstElementChild as HTMLElement | null;
      if (!el) return;

      // Check if child has fixed dimensions via inline style
      const inlineW = el.style.width;
      const hasFixedSize = inlineW && parseInt(inlineW) >= 1080;

      if (hasFixedSize) {
        const adW = parseInt(inlineW);
        const adH = parseInt(el.style.height) || adW;
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const s = Math.min(winW / adW, winH / adH, 1);

        outer.style.width = "100vw";
        outer.style.height = "100vh";
        outer.style.overflow = "hidden";
        outer.style.display = "flex";
        outer.style.alignItems = "center";
        outer.style.justifyContent = "center";
        outer.style.backgroundColor = "#0a0a0c";
        inner.style.transform = `scale(${s})`;
        inner.style.transformOrigin = "center center";
      } else {
        outer.style.cssText = "";
        inner.style.cssText = "";
      }
    }

    fit();
    const t1 = setTimeout(fit, 100);
    const t2 = setTimeout(fit, 500);
    window.addEventListener("resize", fit);
    return () => {
      window.removeEventListener("resize", fit);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div ref={outerRef}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
