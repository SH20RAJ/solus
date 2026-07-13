import type { Metadata } from "next";
import CreatePostPageClient from "@/components/pages/CreatePostPageClient";

export const metadata: Metadata = {
	title: "Solus — New Reflection",
	description: "Seal a new written or vocal memory reflection.",
};

export default function CreatePostPage() {
	return <CreatePostPageClient />;
}
