import Markdown, { type Components } from "react-markdown";
import { ArrowUpRight } from "lucide-react";

/**
 * Renders a story's first-party markdown body in the site's type system.
 *
 * Security: react-markdown does NOT render raw HTML (no rehype-raw here), so even
 * though this content is first-party (migrated by us, not user input), any stray
 * markup is escaped rather than executed — no `dangerouslySetInnerHTML` anywhere.
 * External links open in a new tab with `rel="noopener noreferrer"` (the site-wide
 * rule); internal links stay same-tab.
 */
const isExternal = (href?: string) =>
  !!href && /^https?:\/\//i.test(href) && !href.includes("wegood4u.com");

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-12 mb-4 scroll-mt-28 font-display text-[25px] font-bold leading-[1.2] tracking-[-0.3px] text-text-900 sm:text-[29px]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-9 mb-3 font-display text-[20px] font-semibold leading-[1.3] text-text-900 sm:text-[22px]">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-7 mb-2 font-display text-[17px] font-semibold text-text-900">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="my-5 text-[17px] leading-[1.75] text-text-900/85 sm:text-[18px]">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="my-6 list-disc space-y-2.5 pl-6 marker:text-coral-500">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-6 list-decimal space-y-2.5 pl-6 marker:font-semibold marker:text-coral-600">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1.5 text-[17px] leading-[1.7] text-text-900/85 sm:text-[18px]">
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-text-900">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-7 border-l-[3px] border-coral-500/40 pl-5 text-[18px] italic leading-[1.7] text-text-600">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => {
    const ext = isExternal(href);
    return (
      <a
        href={href}
        className="font-medium text-coral-700 underline decoration-coral-500/40 underline-offset-2 transition-colors duration-200 hover:decoration-coral-500"
        {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
        {ext ? (
          <ArrowUpRight aria-hidden="true" className="ml-0.5 inline size-3.5 align-[-1px]" />
        ) : null}
      </a>
    );
  },
  // Content carries no images today; strip any that appear rather than allow an
  // unbounded external <img> into the trusted-content surface.
  img: () => null,
};

export default function StoryProse({ content }: { content: string }) {
  return (
    <div className="story-prose">
      <Markdown components={components}>{content}</Markdown>
    </div>
  );
}
