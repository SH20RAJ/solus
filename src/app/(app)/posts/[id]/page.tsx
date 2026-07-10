import type { Metadata } from "next";
import PostDetailPageClient from "@/components/pages/PostDetailPageClient";

export const metadata: Metadata = {
	title: "Solus — Memory Details",
	description: "View and edit your private reflection details, comments, and locations.",
};

export default function PostDetailPage() {
	return <PostDetailPageClient />;
}
