"use client";

import { usePosts } from "@/lib/api-client";
import PostCard from "@/components/PostCard";
import Skeleton from "@/components/Skeleton";
import Link from "next/link";

interface DayPageClientProps {
	slug: string;
}

const MOOD_TYPES = [
	{ name: "Happy", color: "bg-amber-500/10 text-amber-300 border-amber-500/30", label: "Happy ☀️" },
	{ name: "Calm", color: "bg-sky-500/10 text-sky-300 border-sky-500/30", label: "Calm 🌊" },
	{ name: "Grateful", color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30", label: "Grateful 🌱" },
	{ name: "Reflective", color: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30", label: "Reflective 🌌" },
	{ name: "Tired", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30", label: "Tired 💤" },
] as const;

export default function DayPageClient({ slug }: DayPageClientProps) {
	const { data: postsData, error, isLoading } = usePosts();
	const posts = postsData?.data ?? [];

	// Parse date
	const parsedDate = new Date(slug);
	const isValidDate = !isNaN(parsedDate.getTime());
	const displayDate = isValidDate
		? parsedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
		: slug;

	// Filter posts on target date
	const targetDateStr = isValidDate ? parsedDate.toDateString() : "";
	const dayPosts = posts.filter((p) => {
		if (!isValidDate) return false;
		return new Date(p.createdAt).toDateString() === targetDateStr;
	});

	// Find if there is a primary mood logged
	const loggedMood = dayPosts.find((p) => p.mood)?.mood;
	const moodConfig = loggedMood
		? MOOD_TYPES.find((m) => m.name.toLowerCase() === loggedMood.toLowerCase())
		: null;

	return (
		<div className="max-w-xl mx-auto px-4 py-8 pb-24 sm:py-12 select-none min-h-screen">
			{/* Navigation Header */}
			<header className="flex items-center justify-between mb-8">
				<Link
					href="/home"
					className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors flex items-center gap-1.5"
				>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<line x1="19" y1="12" x2="5" y2="12" />
						<polyline points="12 19 5 12 12 5" />
					</svg>
					Back to Feed
				</Link>

				<span className="text-[10px] font-mono text-text-muted uppercase tracking-widest bg-card px-2.5 py-1 rounded-full border border-border/20">
					Daily Archive
				</span>
			</header>

			{/* Date Header Title */}
			<div className="text-center mb-10">
				<h1 className="text-2xl font-bold font-sans tracking-tight text-text-primary">
					{displayDate}
				</h1>
				{moodConfig && (
					<div className="mt-3 flex justify-center">
						<span className={`text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border ${moodConfig.color}`}>
							Vibe Check: {moodConfig.label}
						</span>
					</div>
				)}
			</div>

			{/* Loading / Error states */}
			{isLoading && (
				<div className="space-y-6">
					<Skeleton variant="post" />
					<Skeleton variant="post" />
				</div>
			)}

			{!isLoading && error && (
				<div className="text-center py-12 text-sm text-text-muted font-mono">
					Failed to load reflections for this day.
				</div>
			)}

			{/* Posts list */}
			{!isLoading && !error && (
				<>
					{dayPosts.length === 0 ? (
						<div className="text-center py-20 border border-dashed border-border/40 rounded-3xl bg-card/10 px-6">
							<div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-text-muted mx-auto mb-4">
								📓
							</div>
							<h3 className="text-sm font-semibold text-text-primary mb-1">No reflections logged</h3>
							<p className="text-xs text-text-muted max-w-xs mx-auto mb-6">
								This date is currently quiet. Log a feeling, note, or visual visual story.
							</p>
							<Link
								href="/create"
								className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-accent text-background text-xs font-semibold hover:bg-accent/90 transition-all active:scale-[0.97]"
							>
								Create entry +
							</Link>
						</div>
					) : (
						<div className="space-y-8">
							<div className="text-[10px] font-mono text-text-muted uppercase tracking-wider border-b border-border/20 pb-2 mb-4">
								Logged entries ({dayPosts.length})
							</div>
							{dayPosts.map((post) => (
								<PostCard
									key={post.id}
									id={post.id}
									userId={post.userId}
									mediaUrl={post.mediaUrl}
									mediaType={post.mediaType}
									caption={post.caption}
									location={post.location}
									mood={post.mood}
									createdAt={post.createdAt}
									publishAt={post.publishAt}
								/>
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
}
