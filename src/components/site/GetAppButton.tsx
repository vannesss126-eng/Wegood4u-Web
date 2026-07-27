"use client";

import Button, { type ButtonVariant } from "@/components/ui/Button";
import { useAppDownload } from "./AppDownloadModal";

/**
 * "Get the App" trigger — opens the download modal instead of navigating.
 *
 * A thin client wrapper so Server Components (e.g. the homepage Rewards section)
 * can drop a modal trigger without becoming client components themselves. The
 * nav wires `useAppDownload()` directly since it's already a client tree.
 */
export default function GetAppButton({
  variant = "primary",
  className,
  children = "Get the App",
}: {
  variant?: ButtonVariant;
  className?: string;
  children?: React.ReactNode;
}) {
  const { open } = useAppDownload();
  return (
    <Button variant={variant} onClick={open} className={className}>
      {children}
    </Button>
  );
}
