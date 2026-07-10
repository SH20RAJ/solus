"use client";

import PostCard from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";
import { PostCardSkeleton } from "@/components/Skeleton";
import { usePosts } from "@/lib/api-client";

function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) return "Good morning.";
	if (hour < 17) return "Good afternoon.";
	return "Good evening.";
}

function getDateString(): string {
	return new Date().toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	});
}

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

export default function HomePage() {
	const { data, isLoading } = usePosts();
	const posts = (data as PostsResponse)?.data ?? [];

	return (
		<div className="py-8 sm:py-12">
			{/* Greeting */}
			<header className="mb-10">
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
					{getGreeting()}
				</h1>
				<p className="mt-1 text-sm text-text-muted">
					{getDateString()}
				</p>
			</header>

			{/* Today's memories */}
			<section>
				<h2 className="text-sm text-text-muted mb-6 tracking-wide">
					Your memories
				</h2>

				{isLoading ? (
					<div className="space-y-6">
						<PostCardSkeleton />
						<PostCardSkeleton />
					</div>
				) : posts.length === 0 ? (
					<EmptyState
						message="You haven't captured today yet."
						actionLabel="Create Memory"
						actionHref="/create"
					/>
				) : (
					<div className="space-y-6">
						{posts.map((post) => (
							<PostCard
								key={post.id}
								mediaUrl={post.mediaUrl}
								mediaType={post.mediaType}
								caption={post.caption}
								location={post.location}
								mood={post.mood}
								createdAt={post.createdAt}
							/>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
