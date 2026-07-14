import type { Metadata } from "next";
import TagPageClient from "@/components/pages/TagPageClient";
import { APP_CONFIG } from "@/lib/config";

interface PageProps {
	params: Promise<{
		tag: string;
	}>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { tag } = await params;
	const decoded = decodeURIComponent(tag);
	return {
		title: `#${decoded} Reflections | Solus`,
		description: `Browse related private diary entries for #${decoded}.`,
		alternates: {
			canonical: `${APP_CONFIG.siteUrl}/tags/${tag}`,
		},
	};
}

export default function TagPage() {
	return <TagPageClient />;
}
