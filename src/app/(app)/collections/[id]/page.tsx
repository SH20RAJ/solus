import type { Metadata } from "next";
import CollectionDetailPageClient from "@/components/pages/CollectionDetailPageClient";
import { APP_CONFIG } from "@/lib/config";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { id } = await params;
	return {
		title: "Solus — Collection Details",
		description: "View individual collections of private memories.",
		alternates: {
			canonical: `${APP_CONFIG.siteUrl}/collections/${id}`,
		},
	};
}

export default function CollectionDetailPage() {
	return <CollectionDetailPageClient />;
}
