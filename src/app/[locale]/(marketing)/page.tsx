import type { Metadata } from "next";
import Hero from "@/components/home/Hero";

export const metadata: Metadata = {
  title: "Wegood4u — Eat. Snap. Earn.",
  description:
    "The membership that rewards you for exploring. Visit partner restaurants and stays across Malaysia and Thailand, share what you love, and earn credits, rewards and VIP access.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* Sections 1.3–1.8 land here phase by phase. */}
    </>
  );
}
