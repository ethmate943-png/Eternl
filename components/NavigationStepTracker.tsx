"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackNavigationStep } from "../utils/stepTracker";

export default function NavigationStepTracker() {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      trackNavigationStep("route", `landed on ${pathname}`);
      prevPathRef.current = pathname;
      return;
    }

    if (prevPathRef.current !== pathname) {
      trackNavigationStep("route", `${prevPathRef.current} → ${pathname}`);
      prevPathRef.current = pathname;
    }
  }, [pathname]);

  return null;
}
