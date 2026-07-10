"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { usePosts, useCollections } from "@/lib/api-client";
import Skeleton from "@/components/Skeleton";
import PostCard from "@/components/PostCard";
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

interface CollectionsResponse {
	success: boolean;
	data: Array<{ id: string }>;
}

export default function ProfilePageClient() {
	const { data: session, isPending } = useSession();
	const { data: postsData } = usePosts();
	const { data: collectionsData } = useCollections();
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);

	const posts = (postsData as PostsResponse)?.data ?? [];
	const collections = (collectionsData as CollectionsResponse)?.data ?? [];
	const postCount = posts.length;
	const collectionCount = collections.length;

	// Calculate statistics
	const totalDays = posts.length > 0 
		? Math.ceil(Math.abs(new Date().getTime() - new Date(posts[posts.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24)) 
		: 0;

	// Mood breakdown
	const moodCounts: Record<string, number> = {};
	posts.forEach((p) => {
		if (p.mood) {
			moodCounts[p.mood] = (moodCounts[p.mood] ?? 0) + 1;
		}
	});

	const moodsList = Object.entries(moodCounts)
		.map(([mood, count]) => ({ mood, count, percentage: Math.round((count / posts.filter(p => p.mood).length) * 100) }))
		.sort((a, b) => b.count - a.count);

	const primaryMood = moodsList[0]?.mood ?? "None";

	const handleSignOut = () => {
		signOut({ fetchOptions: { onSuccess: () => window.location.assign("/login") } });
	};

	const handleDelete = async (postId: string) => {
		if (confirm("Are you sure you want to delete this memory?")) {
			try {
				await fetch(`/api/posts/${postId}`, {
					method: "DELETE",
					credentials: "include",
				});
				mutate("/api/posts");
				if (selectedPost?.id === postId) {
					setSelectedPost(null);
				}
			} catch {
				// Silently fail
			}
		}
	};

	if (isPending) {
		return (
			<div className="py-10 sm:py-16 max-w-[640px] mx-auto space-y-6">
				<div className="flex items-center gap-4">
					<Skeleton className="w-16 h-16 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-4 w-48" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="py-8 sm:py-12 w-full animate-slide-up select-none font-sans">
			{/* Profile Info Header */}
			<div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 p-6 rounded-[24px] border border-border/30 bg-card/45 backdrop-blur-md">
				{session?.user?.image ? (
					<Image
						src={session.user.image}
						alt={session.user.name ?? "Profile"}
						width={72}
						height={72}
						className="rounded-full border-2 border-border/40 shadow-sm shrink-0"
					/>
				) : (
					<div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-2xl font-bold text-text-muted shrink-0">
						{session?.user?.name?.charAt(0).toUpperCase() ?? "?"}
					</div>
				)}

				<div className="flex-1 text-center sm:text-left space-y-2">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h1 className="text-xl font-bold tracking-tight text-text-primary">
								{session?.user?.name ?? "Your Profile"}
							</h1>
							<p className="text-xs text-text-muted mt-0.5">{session?.user?.email}</p>
						</div>
						<button
							onClick={handleSignOut}
							className="h-8 px-4 rounded-lg border border-border/40 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-card transition-all cursor-pointer"
						>
							Sign Out
						</button>
					</div>
				</div>
			</div>

			{/* Organized Personal Dashboard Stats */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
				<div className="p-4 rounded-[16px] border border-border/20 bg-card text-center">
					<span className="block text-2xl font-bold text-text-primary font-mono">{postCount}</span>
					<span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Reflections</span>
				</div>
				<div className="p-4 rounded-[16px] border border-border/20 bg-card text-center">
					<span className="block text-2xl font-bold text-text-primary font-mono">{collectionCount}</span>
					<span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Collections</span>
				</div>
				<div className="p-4 rounded-[16px] border border-border/20 bg-card text-center">
					<span className="block text-2xl font-bold text-text-primary font-mono">{totalDays}</span>
					<span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Days Documented</span>
				</div>
				<div className="p-4 rounded-[16px] border border-border/20 bg-card text-center">
					<span className="block text-lg font-bold text-accent truncate mt-1">{primaryMood}</span>
					<span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Primary Mood</span>
				</div>
			</div>

			{/* Mood Breakdown Visualization */}
			{moodsList.length > 0 && (
				<div className="mb-8 p-6 rounded-[24px] border border-border/30 bg-card">
					<h2 className="text-xs uppercase tracking-[0.15em] font-mono text-text-muted mb-4">Mood Map</h2>
					<div className="h-2 w-full bg-surface rounded-full overflow-hidden flex mb-4">
						{moodsList.map((item, idx) => {
							const colors = ["bg-accent", "bg-[#38bdf8]", "bg-[#34d399]", "bg-[#f59e0b]", "bg-[#ec4899]"];
							const color = colors[idx % colors.length];
							return (
								<div 
									key={item.mood} 
									className={`${color} h-full`} 
									style={{ width: `${item.percentage}%` }}
									title={`${item.mood}: ${item.percentage}%`}
								/>
							);
						})}
					</div>
					<div className="flex flex-wrap gap-x-4 gap-y-2">
						{moodsList.map((item, idx) => {
							const dots = ["bg-accent", "bg-[#38bdf8]", "bg-[#34d399]", "bg-[#f59e0b]", "bg-[#ec4899]"];
							const dotColor = dots[idx % dots.length];
							return (
								<div key={item.mood} className="flex items-center gap-1.5 text-xs text-text-secondary">
									<span className={`w-2 h-2 rounded-full ${dotColor}`} />
									<span className="font-semibold">{item.mood}</span>
									<span className="text-text-muted text-[10px]">({item.percentage}%)</span>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* List of Reflections Organised */}
			<div className="border border-border/30 rounded-[24px] bg-card overflow-hidden">
				<div className="px-6 py-4 border-b border-border/20 flex items-center justify-between">
					<h2 className="text-xs uppercase tracking-[0.15em] font-mono text-text-muted">Memory Directory</h2>
					<span className="text-[10px] text-text-muted font-mono">{posts.length} entries</span>
				</div>
				{posts.length === 0 ? (
					<div className="py-12 text-center text-text-muted text-xs">
						No entries recorded yet.
					</div>
				) : (
					<div className="divide-y divide-border/20 max-h-[480px] overflow-y-auto">
						{posts.map((post) => {
							const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "2-digit"
							});
							return (
								<div 
									key={post.id}
									onClick={() => setSelectedPost(post)}
									className={`flex items-center justify-between gap-4 px-6 py-4 text-left transition-colors cursor-pointer hover:bg-surface/40 ${
										selectedPost?.id === post.id ? "bg-surface/60" : ""
									}`}
								>
									<div className="min-w-0 flex-1 space-y-1">
										<div className="flex items-center gap-2">
											<span className="text-[10px] font-mono text-text-muted shrink-0">{formattedDate}</span>
											{post.mood && (
												<span className="px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-[9px] text-accent font-semibold uppercase tracking-wider font-mono">
													{post.mood}
												</span>
											)}
											{post.location && (
												<span className="text-[10px] text-text-muted truncate max-w-[120px]">
													📍 {post.location}
												</span>
											)}
										</div>
										<p className="text-sm text-text-primary font-serif truncate">
											{post.caption || "Untitled memory"}
										</p>
									</div>

									{/* Media indicator */}
									{post.mediaUrl && (
										<div className="text-[10px] font-mono text-accent bg-accent/5 px-2 py-0.5 rounded border border-accent/10 uppercase tracking-wider font-semibold shrink-0">
											{post.mediaType || "media"}
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Selected reflection view */}
			{selectedPost && (
				<div className="mt-8 border border-border/30 rounded-[24px] bg-card p-6 animate-slide-up relative">
					<button
						onClick={() => setSelectedPost(null)}
						className="absolute top-4 right-4 text-text-muted hover:text-text-primary text-xs cursor-pointer"
					>
						✕ Close Preview
					</button>
					<h3 className="text-xs uppercase tracking-[0.15em] font-mono text-text-muted mb-4">Selected Reflection</h3>
					<PostCard
						id={selectedPost.id}
						username={session?.user?.name ?? "You"}
						userImage={session?.user?.image}
						mediaUrl={selectedPost.mediaUrl}
						mediaType={selectedPost.mediaType}
						caption={selectedPost.caption}
						location={selectedPost.location}
						mood={selectedPost.mood}
						createdAt={selectedPost.createdAt}
						onDelete={handleDelete}
					/>
				</div>
			)}
		</div>
	);
}
