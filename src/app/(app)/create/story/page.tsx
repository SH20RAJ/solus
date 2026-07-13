import type { Metadata } from "next";
import CreateStoryPageClient from "@/components/pages/CreateStoryPageClient";

export const metadata: Metadata = {
	title: "Solus — New Story",
	description: "Post a new 24h disappearing visual story snap.",
};

export default function CreateStoryPage() {
	return <CreateStoryPageClient />;
}
