import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR safety

    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    checkMobile(); // set initial value

    const handler = () => checkMobile();
    mql.addEventListener("change", handler);

    return () => mql.removeEventListener("change", handler);
  }, []);

  return isMobile;
}
