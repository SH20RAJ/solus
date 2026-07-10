"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";
import { PostCardSkeleton } from "@/components/Skeleton";
import { usePost } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";

interface Post {
	id: string;
	caption: string | null;
	mediaUrl: string | null;
	mediaType: string | null;
	location: string | null;
	mood: string | null;
	createdAt: string;
}

interface PostResponse {
	success: boolean;
	data: Post;
}

export default function PostDetailPageClient() {
	const params = useParams();
	const router = useRouter();
	const id = params?.id as string;
	const { data: session } = useSession();
	const { data, isLoading, error } = usePost(id);

	const post = (data as PostResponse)?.data;

	const handleDelete = async (postId: string) => {
		if (confirm("Are you sure you want to delete this memory?")) {
			try {
				await fetch(`/api/posts/${postId}`, {
					method: "DELETE",
					credentials: "include",
				});
				router.replace("/home");
			} catch {
				// Silently fail
			}
		}
	};

	if (isLoading) {
		return (
			<div className="py-10 sm:py-16 max-w-[640px] mx-auto space-y-6 animate-pulse">
				<header className="mb-4">
					<div className="h-4 w-20 bg-border/50 rounded" />
				</header>
				<PostCardSkeleton />
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="py-10 sm:py-16 max-w-[640px] mx-auto select-none">
				<EmptyState
					title="Reflection not found"
					description="This private entry may have been deleted or does not exist."
					actionText="Back to Feed"
					actionHref="/home"
				/>
			</div>
		);
	}

	return (
		<div className="py-8 sm:py-12 w-full max-w-[640px] mx-auto animate-slide-up select-none font-sans">
			<header className="mb-8 flex items-center justify-between">
				<span className="text-xs uppercase tracking-[0.15em] font-mono text-text-muted">
					Memory Detail
				</span>
				<Link
					href="/home"
					className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200"
				>
					← Back Feed
				</Link>
			</header>

			<PostCard
				id={post.id}
				username={session?.user?.name ?? "You"}
				userImage={session?.user?.image}
				mediaUrl={post.mediaUrl}
				mediaType={post.mediaType}
				caption={post.caption}
				location={post.location}
				mood={post.mood}
				createdAt={post.createdAt}
				onDelete={handleDelete}
			/>
		</div>
	);
}
