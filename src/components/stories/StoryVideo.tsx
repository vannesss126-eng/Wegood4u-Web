/**
 * Feature-video embed for a post. Sits directly under the hero image and
 * autoplays.
 *
 * Autoplay is only permitted by browsers when the video is muted, so it starts
 * muted (`mute=1`) — the viewer unmutes from the player controls. Served from
 * youtube-nocookie.com (privacy-enhanced), which the CSP `frame-src` allows.
 *
 * Plain server-rendered <iframe> — no client JS. The video is high on the page,
 * so `loading="eager"` keeps the autoplay immediate rather than waiting for a
 * lazy trigger.
 */
import { useTranslations } from "next-intl";

export default function StoryVideo({
  youtubeId,
  title,
}: {
  youtubeId: string;
  title: string;
}) {
  const t = useTranslations("news.video");
  const src =
    `https://www.youtube-nocookie.com/embed/${youtubeId}` +
    `?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;

  return (
    <figure className="my-8">
      <div className="relative aspect-video overflow-hidden rounded-[20px] bg-ink-950">
        <iframe
          src={src}
          title={t("title", { title })}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
      <figcaption className="mt-3 text-center text-[13.5px] text-text-600">
        {t("caption", { title })}
      </figcaption>
    </figure>
  );
}
