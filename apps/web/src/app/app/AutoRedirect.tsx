"use client";

import { useEffect } from "react";

type Props = { url: string; delayMs?: number };

export function AutoRedirect({ url, delayMs = 3000 }: Props) {
  useEffect(() => {
    const t = setTimeout(() => {
      window.location.replace(url);
    }, delayMs);
    return () => clearTimeout(t);
  }, [url, delayMs]);

  return null;
}
