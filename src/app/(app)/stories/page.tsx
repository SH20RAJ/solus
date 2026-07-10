import type { Metadata } from "next";
import StoriesPageClient from "@/components/pages/StoriesPageClient";

export const metadata: Metadata = {
	title: "Solus — Stories",
	description: "View your active daily moments (24-hour logs).",
};

export default function StoriesPage() {
	return <StoriesPageClient />;
}
