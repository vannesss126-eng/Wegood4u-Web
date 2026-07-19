"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import wordmark from "@/assets/images/wegood4u-wordmark.png";

const LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/membership", label: "Membership" },
  { href: "/explore", label: "Venues" },
  { href: "/stories", label: "Stories" },
  { href: "/for-business", label: "For business" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu on route change and lock body scroll while it's open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
    {/* The blurred header creates a containing block for fixed descendants,
        so the full-screen menu must live OUTSIDE it (rendered below). */}
    <header className="sticky top-0 z-50 border-b border-line-cream bg-cream-50/85 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-5 sm:px-6"
      >
        <Link href="/" aria-label="Wegood4u home" className="shrink-0">
          <Image src={wordmark} alt="Wegood4u" height={34} priority />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`text-[15px] font-medium transition-colors hover:text-coral-500 ${
                    active ? "text-coral-500" : "text-text-900"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="px-3 py-2 text-[15px] font-semibold text-text-900 transition-colors hover:text-coral-500"
          >
            Log in
          </Link>
          <Link
            href="/app"
            className="rounded-full bg-coral-500 px-6 py-3 text-[15px] font-semibold text-white transition-all duration-250 hover:-translate-y-0.5 hover:bg-coral-600 hover:shadow-cta"
          >
            Get the app
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-text-900 lg:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M4 4l14 14M18 4L4 18" />
            ) : (
              <path d="M2 6h18M2 11h18M2 16h18" />
            )}
          </svg>
        </button>
      </nav>
    </header>

      {/* Mobile overlay — sibling of the header (see note above). */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-[72px] z-40 flex flex-col overflow-y-auto bg-cream-50 px-6 pb-10 pt-6 lg:hidden"
        >
          <ul className="flex flex-col gap-2">
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block py-3 font-display text-3xl font-semibold text-text-900"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3">
            <Link
              href="/app"
              className="rounded-full bg-coral-500 px-7 py-4 text-center text-[15px] font-semibold text-white"
            >
              Get the app
            </Link>
            <Link
              href="/login"
              className="rounded-full border-[1.5px] border-text-900 px-7 py-4 text-center text-[15px] font-semibold text-text-900"
            >
              Log in
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
