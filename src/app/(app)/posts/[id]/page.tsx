import type { Metadata } from "next";
import PostDetailPageClient from "@/components/pages/PostDetailPageClient";
import { APP_CONFIG } from "@/lib/config";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { id } = await params;
	return {
		title: "Solus — Memory Details",
		description: "View and edit your private reflection details, comments, and locations.",
		alternates: {
			canonical: `${APP_CONFIG.siteUrl}/posts/${id}`,
		},
	};
}

export default function PostDetailPage() {
	return <PostDetailPageClient />;
}
