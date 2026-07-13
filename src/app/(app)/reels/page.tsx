import type { Metadata } from "next";
import ReelsPageClient from "@/components/pages/ReelsPageClient";

export const metadata: Metadata = {
	title: "Solus — Reels",
	description: "Relive your private video reflections.",
};

export default function ReelsPage() {
	return <ReelsPageClient />;
}
