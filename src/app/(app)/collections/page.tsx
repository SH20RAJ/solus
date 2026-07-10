import type { Metadata } from "next";
import CollectionsPageClient from "@/components/pages/CollectionsPageClient";

export const metadata: Metadata = {
	title: "Solus — Collections",
	description: "View and organize your reflections into themed collections.",
};

export default function CollectionsPage() {
	return <CollectionsPageClient />;
}
