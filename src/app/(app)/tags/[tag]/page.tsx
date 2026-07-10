import type { Metadata } from "next";
import TagPageClient from "@/components/pages/TagPageClient";

export const metadata: Metadata = {
	title: "Solus — Explore Tag",
	description: "Browse related private diary entries for the selected tag.",
};

export default function TagPage() {
	return <TagPageClient />;
}
