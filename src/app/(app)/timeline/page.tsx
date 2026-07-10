"use client";

import PostCard from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";
import { PostCardSkeleton } from "@/components/Skeleton";
import { usePosts } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { mutate } from "swr";

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

export default function TimelinePage() {
	const { data: session } = useSession();
	const { data, isLoading } = usePosts();
	const posts = (data as PostsResponse)?.data ?? [];

	const handleDelete = async (postId: string) => {
		if (confirm("Are you sure you want to delete this memory?")) {
			try {
				await fetch(`/api/posts/${postId}`, {
					method: "DELETE",
					credentials: "include",
				});
				mutate("/api/posts");
			} catch {
				// Silently fail in dev
			}
		}
	};

	return (
		<div className="py-8 sm:py-12 w-full animate-slide-up">
			<header className="mb-10">
				<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary font-serif">
					Timeline
				</h1>
				<p className="mt-1.5 text-xs sm:text-sm text-text-muted leading-relaxed">
					Your private chronological record of life.
				</p>
			</header>

			{isLoading ? (
				<div className="space-y-8">
					<PostCardSkeleton />
					<PostCardSkeleton />
					<PostCardSkeleton />
				</div>
			) : posts.length === 0 ? (
				<EmptyState
					message="Your timeline is empty. Start capturing reflections."
					actionLabel="Write First Entry"
					actionHref="/create"
				/>
			) : (
				<div className="space-y-8">
					{posts.map((post) => (
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
