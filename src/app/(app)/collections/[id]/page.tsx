import type { Metadata } from "next";
import CollectionDetailPageClient from "@/components/pages/CollectionDetailPageClient";

export const metadata: Metadata = {
	title: "Solus — Collection Details",
	description: "View individual collections of private memories.",
};

export default function CollectionDetailPage() {
	return <CollectionDetailPageClient />;
}
