"use client";

import Link from "next/link";
import PostCard from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";
import { PostCardSkeleton } from "@/components/Skeleton";
import StoriesCarousel from "@/components/StoriesCarousel";
import { usePosts } from "@/lib/api-client";
import { mutate } from "swr";
import { useSession } from "@/lib/auth-client";

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
	const { data: session } = useSession();
	const { data: postsData, isLoading } = usePosts();
	const posts = (postsData as PostsResponse)?.data ?? [];

	const handleDelete = async (postId: string) => {
		if (confirm("Are you sure you want to delete this memory?")) {
			try {
				await fetch(`/api/posts/${postId}`, {
					method: "DELETE",
					credentials: "include",
				});
				mutate("/api/posts");
			} catch {
				// Silently fail or log in dev
			}
		}
	};

	return (
		<div className="py-10 sm:py-16 max-w-[640px] mx-auto animate-slide-up">
			{/* Greeting */}
			<header className="mb-10">
				<p className="text-[10px] uppercase tracking-[0.2em] font-mono text-text-muted mb-2">
					{getDateString()}
				</p>
				<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary font-serif">
					{getGreeting()}
				</h1>
			</header>

			{/* Stories Carousel */}
			<StoriesCarousel />

			{/* Reflection Prompt (Apple Journal style) */}
			<Link
				href="/create"
				className="group block p-5 rounded-[20px] bg-card border border-border/40 hover:border-border/80 transition-all duration-300 ease-out mb-12 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] active:scale-[0.99]"
			>
				<div className="flex items-center justify-between gap-4">
					<div>
						<h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors duration-200">
							New Entry
						</h3>
						<p className="text-xs text-text-secondary mt-1 leading-relaxed">
							What happened today? Document a reflection or a moment.
						</p>
					</div>
					<div className="shrink-0 w-8 h-8 rounded-full bg-surface border border-border/60 flex items-center justify-center text-text-muted group-hover:text-text-primary group-hover:bg-card transition-all duration-300">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							<line x1="12" y1="5" x2="12" y2="19" />
							<line x1="5" y1="12" x2="19" y2="12" />
						</svg>
					</div>
				</div>
			</Link>

			{/* Today's memories */}
			<section>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xs uppercase tracking-[0.15em] font-mono text-text-muted">
						Recent Reflections
					</h2>
					{posts.length > 0 && (
						<Link
							href="/timeline"
							className="text-xs text-accent hover:underline transition-all duration-200"
						>
							View Timeline
						</Link>
					)}
				</div>

				{isLoading ? (
					<div className="space-y-6">
						<PostCardSkeleton />
						<PostCardSkeleton />
					</div>
				) : posts.length === 0 ? (
					<EmptyState
						message="Your journal is empty. Take a moment to capture your first reflection."
						actionLabel="Write First Entry"
						actionHref="/create"
					/>
				) : (
					<div className="space-y-6">
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
			</section>
		</div>
	);
}
