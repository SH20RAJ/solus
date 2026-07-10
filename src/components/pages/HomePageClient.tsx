"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";
import { PostCardSkeleton } from "@/components/Skeleton";
import StoriesCarousel from "@/components/StoriesCarousel";
import CollectionsRow from "@/components/CollectionsRow";
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

export default function HomePageClient() {
	const { data: session } = useSession();
	const [posts, setPosts] = useState<Post[]>([]);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const loaderRef = useRef<HTMLDivElement | null>(null);

	const fetchPosts = async (currentOffset: number, isInitial = false) => {
		try {
			const res = await fetch(`/api/posts?limit=6&offset=${currentOffset}`, { credentials: "include" });
			const json = await res.json();
			if (json.success) {
				if (isInitial) {
					setPosts(json.data);
					setOffset(json.data.length);
				} else {
					setPosts((prev) => [...prev, ...json.data]);
					setOffset((prev) => prev + json.data.length);
				}
				setHasMore(json.hasMore);
			}
		} catch {
			// error
		} finally {
			if (isInitial) setInitialLoading(false);
			setLoadingMore(false);
		}
	};

	// Initial load
	useEffect(() => {
		fetchPosts(0, true);
	}, []);

	// Infinite Scroll Observer
	useEffect(() => {
		if (initialLoading || !hasMore || loadingMore) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setLoadingMore(true);
					fetchPosts(offset);
				}
			},
			{ threshold: 0.1 }
		);

		if (loaderRef.current) {
			observer.observe(loaderRef.current);
		}

		return () => observer.disconnect();
	}, [initialLoading, hasMore, loadingMore, offset]);

	const handleDelete = async (postId: string) => {
		if (confirm("Are you sure you want to delete this memory?")) {
			try {
				await fetch(`/api/posts/${postId}`, {
					method: "DELETE",
					credentials: "include",
				});
				// Remove local state post
				setPosts((prev) => prev.filter((p) => p.id !== postId));
				setOffset((prev) => Math.max(0, prev - 1));
			} catch {
				// Silently fail
			}
		}
	};

	return (
		<div className="py-8 sm:py-12 w-full animate-slide-up select-none">
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

			{/* Collections Row */}
			<CollectionsRow />

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

				{initialLoading ? (
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

						{/* Infinite Scroll Trigger */}
						{hasMore && (
							<div ref={loaderRef} className="py-6 flex justify-center text-xs text-text-muted">
								<div className="flex items-center gap-2">
									<svg className="animate-spin h-4 w-4 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
									</svg>
									<span>Loading older reflections...</span>
								</div>
							</div>
						)}

						{!hasMore && posts.length > 0 && (
							<div className="py-8 text-center text-xs text-text-muted italic">
								You have reached the beginning of your journey.
							</div>
						)}
					</div>
				)}
			</section>
		</div>
	);
}
