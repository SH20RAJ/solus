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

const MOOD_TYPES = [
	{ name: "Grateful", color: "bg-[#f59e0b]" },
	{ name: "Calm", color: "bg-[#10b981]" },
	{ name: "Reflective", color: "bg-[#6366f1]" },
	{ name: "Excited", color: "bg-[#ec4899]" },
	{ name: "Tired", color: "bg-[#84cc16]" },
] as const;

export default function HomePageClient() {
	const { data: session } = useSession();
	const [posts, setPosts] = useState<Post[]>([]);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const loaderRef = useRef<HTMLDivElement | null>(null);
	const fetchingRef = useRef(false);

	const fetchPosts = async (currentOffset: number, isInitial = false) => {
		if (fetchingRef.current) return;
		fetchingRef.current = true;
		try {
			const res = await fetch(`/api/posts?limit=10&offset=${currentOffset}`, { credentials: "include" });
			const json = (await res.json()) as { success: boolean; data: Post[]; hasMore: boolean };
			if (json.success) {
				if (isInitial) {
					setPosts(json.data);
					setOffset(json.data.length);
				} else {
					setPosts((prev) => {
						const existingIds = new Set(prev.map((p) => p.id));
						const newPosts = json.data.filter((p: Post) => !existingIds.has(p.id));
						return [...prev, ...newPosts];
					});
					setOffset((prev) => prev + json.data.length);
				}
				setHasMore(json.hasMore);
			}
		} catch {
			// error
		} finally {
			fetchingRef.current = false;
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
				setPosts((prev) => prev.filter((p) => p.id !== postId));
				setOffset((prev) => Math.max(0, prev - 1));
			} catch {
				// Silently fail
			}
		}
	};

	// Log a mobile mood check-in directly
	const handleMoodCheckIn = async (moodName: string) => {
		try {
			await fetch("/api/posts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					mood: moodName,
					caption: `Logged today as a ${moodName.toLowerCase()} day.`,
				}),
			});
			// Refresh feed
			fetchPosts(0, true);
		} catch (e) {
			console.error("Mood log failed:", e);
		}
	};

	// Resurface a memory "On This Day" (older than 2 days)
	const memoryPost = posts.find((p) => {
		const createdDate = new Date(p.createdAt).getTime();
		return createdDate < Date.now() - 2 * 24 * 60 * 60 * 1000;
	});

	// Variables for chapter grouping logic
	let lastLocation = "";
	let lastTime = 0;

	return (
		<div className="py-8 sm:py-12 w-full animate-slide-up select-none">
			{/* Greeting */}
			<header className="mb-10 text-left">
				<p className="text-[10px] uppercase tracking-[0.2em] font-mono text-text-muted mb-2">
					{getDateString()}
				</p>
				<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary font-serif">
					{getGreeting()}
				</h1>
			</header>

			{/* MOBILE-ONLY MOOD DOTS CHECK-IN */}
			<div className="p-5 rounded-[20px] bg-card/60 border border-border/20 text-left mb-8 sm:hidden">
				<p className="text-[9px] text-text-muted font-mono uppercase tracking-wider">Mood Check-In</p>
				<h3 className="text-sm font-semibold text-text-primary mt-0.5">How&apos;s today feeling?</h3>
				<div className="flex gap-3 mt-3">
					{MOOD_TYPES.map((m) => (
						<button
							key={m.name}
							onClick={() => handleMoodCheckIn(m.name)}
							className={`w-6 h-6 rounded-full ${m.color} hover:scale-110 active:scale-95 transition-all cursor-pointer shadow border border-white/5`}
							title={`Log today: ${m.name}`}
						/>
					))}
				</div>
			</div>

			{/* Stories Carousel */}
			<StoriesCarousel />

			{/* Collections Row */}
			<CollectionsRow />

			{/* "ON THIS DAY" RESURFACING BLOCK */}
			{memoryPost && (
				<div className="mb-10 p-6 rounded-[24px] bg-[#1e1511] border border-[#d97706]/20 text-left shadow-lg relative overflow-hidden animate-fade-in">
					<div className="absolute right-4 top-4 text-[9px] font-mono font-bold text-[#d97706] uppercase tracking-widest bg-[#d97706]/10 px-2.5 py-1 rounded-full border border-[#d97706]/20">
						On This Day
					</div>
					<span className="text-[10px] text-[#f59e0b] font-mono uppercase tracking-wider font-semibold">
						{new Date(memoryPost.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
					</span>
					<p className="mt-3.5 text-base text-text-primary font-serif italic leading-relaxed">
						&ldquo;{memoryPost.caption}&rdquo;
					</p>
					{memoryPost.location && (
						<span className="mt-3 block text-[10px] text-text-muted">
							📍 {memoryPost.location}
						</span>
					)}
				</div>
			)}

			{/* Reflection Prompt Link */}
			<Link
				href="/create"
				className="group block p-5 rounded-[20px] bg-card border border-border/40 hover:border-border/80 transition-all duration-300 ease-out mb-12 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] active:scale-[0.99]"
			>
				<div className="flex items-center justify-between gap-4">
					<div className="text-left">
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

			{/* Recent Reflections Feed */}
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
						{posts.map((post) => {
							const postTime = new Date(post.createdAt).getTime();
							const isTextOnly = !post.mediaUrl;
							const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

							// Proximity checking for chapter groups
							const gap = Math.abs(postTime - lastTime) / (1000 * 60 * 60 * 24);
							const showDivider = post.location && (post.location.toLowerCase() !== lastLocation.toLowerCase() || gap > 3);

							if (showDivider) {
								lastLocation = post.location!;
								lastTime = postTime;
							}

							return (
								<div key={post.id} className="space-y-4">
									{showDivider && (
										<div className="py-2.5 text-left border-b border-border/20">
											<span className="text-[10px] text-accent font-mono uppercase tracking-[0.2em] font-bold">
												{post.location?.toLowerCase()} chapter
											</span>
										</div>
									)}

									{isTextOnly ? (
										/* Text-only quiet typographic serif quote */
										<div className="py-6 px-5 border-l border-accent pl-6 text-left bg-card/25 rounded-r-[20px] transition-all hover:bg-card/45">
											<p className="text-base text-text-primary font-serif leading-relaxed italic">
												&ldquo;{post.caption}&rdquo;
											</p>
											<div className="mt-3.5 flex items-center gap-2.5 text-[9px] text-text-muted font-mono uppercase tracking-wider">
												<span>{formattedDate}</span>
												{post.location && (
													<>
														<span>&middot;</span>
														<span>📍 {post.location}</span>
													</>
												)}
												<button
													onClick={() => handleDelete(post.id)}
													className="text-red-400/80 hover:text-red-300 font-bold ml-auto cursor-pointer"
												>
													Delete
												</button>
											</div>
										</div>
									) : (
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
									)}
								</div>
							);
						})}

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
