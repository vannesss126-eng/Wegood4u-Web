import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set a new password | Wegood4u',
  // Auth surface: reached only from a Supabase recovery email, never from
  // search. robots.txt disallowed it already, but only the meta directive stops
  // a page that was linked from somewhere else being indexed anyway.
  robots: { index: false, follow: false },
};

export default function ResetPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}

