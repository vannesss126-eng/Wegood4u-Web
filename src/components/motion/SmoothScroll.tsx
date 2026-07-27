"use client";

import { ReactLenis } from "lenis/react";
import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
/** Server + first client paint agree: assume motion is allowed, then correct. */
const getServerSnapshot = () => false;

/**
 * Global smooth-scroll wrapper (DESIGN.md §7). Wrap marketing layouts only —
 * auth/QR pages don't need the extra JS. Disabled entirely under
 * prefers-reduced-motion: reduce (hard requirement).
 *
 * Reads the media query through useSyncExternalStore rather than
 * useEffect + setState: the preference IS an external store, and the effect
 * form triggers a cascading re-render on every mount.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1 }}>
      {children}
    </ReactLenis>
  );
}
