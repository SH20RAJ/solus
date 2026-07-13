"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";
import { PostCardSkeleton } from "@/components/Skeleton";
import useSWR from "swr";
import { fetcher } from "@/lib/api-client";
import { mutate } from "swr";
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

interface PostsResponse {
	success: boolean;
	data: Post[];
}

export default function TagPageClient() {
	const params = useParams();
	const tag = params?.tag as string;
	const { data: session } = useSession();

	// Fetch posts filtered by tag directly from the server to bypass client-side pagination limits
	const { data: postsData, isLoading } = useSWR<PostsResponse>(
		tag ? `/api/posts?tag=${encodeURIComponent(tag)}&limit=100` : null,
		fetcher
	);
	const filteredPosts = postsData?.data ?? [];

	const handleDelete = async (postId: string) => {
		if (confirm("Are you sure you want to delete this memory?")) {
			try {
				await fetch(`/api/posts/${postId}`, {
					method: "DELETE",
					credentials: "include",
				});
				mutate("/api/posts");
			} catch {
				// Silently fail
			}
		}
	};

	return (
		<div className="max-w-[640px] mx-auto py-8 px-4 select-none animate-slide-up">
			{/* Header */}
			<header className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-text-primary font-serif">
						#{tag}
					</h1>
					<p className="mt-1 text-xs text-text-muted">
						{filteredPosts.length} {filteredPosts.length === 1 ? "memory" : "memories"} tagged
					</p>
				</div>
				<Link
					href="/home"
					className="text-xs text-text-muted hover:text-text-primary transition-colors"
				>
					← Back Feed
				</Link>
			</header>

			{/* List of posts */}
			{isLoading ? (
				<div className="space-y-6">
					<PostCardSkeleton />
					<PostCardSkeleton />
				</div>
			) : filteredPosts.length === 0 ? (
				<EmptyState
					message={`You haven't written any posts tagged with #${tag} yet.`}
					actionLabel="Create Post"
					actionHref="/create"
				/>
			) : (
				<div className="space-y-6">
					{filteredPosts.map((post) => (
						<PostCard
							key={post.id}
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
					))}
				</div>
			)}
		</div>
	);
}
