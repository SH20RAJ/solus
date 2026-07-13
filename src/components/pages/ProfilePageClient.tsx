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
	const [activeTab, setActiveTab] = useState<"directory" | "reels">("directory");
	
	// Reels player states
	const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);

	const posts = (postsData as PostsResponse)?.data ?? [];
	const collections = (collectionsData as CollectionsResponse)?.data ?? [];
	const postCount = posts.length;
	const collectionCount = collections.length;

	// Calculate statistics
	const totalDays = posts.length > 0 
		? Math.ceil(Math.abs(new Date().getTime() - new Date(posts[posts.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24)) 
		: 0;

	// Filter video posts for reels
	const videoReels = posts.filter(
		(p) => p.mediaType === "video" || p.mediaUrl?.endsWith(".mp4")
	);

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

	const handleExportArchive = () => {
		const archiveData = {
			user: session?.user,
			exportedAt: new Date().toISOString(),
			posts: posts,
			collections: collections,
		};
		const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
			JSON.stringify(archiveData, null, 2)
		)}`;
		const downloadAnchor = document.createElement("a");
		downloadAnchor.setAttribute("href", jsonString);
		downloadAnchor.setAttribute("download", `solus-archive-${session?.user?.name || "user"}.json`);
		document.body.appendChild(downloadAnchor);
		downloadAnchor.click();
		downloadAnchor.remove();
	};

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

	const handleNextReel = () => {
		if (activeReelIndex === null) return;
		if (activeReelIndex < videoReels.length - 1) {
			setActiveReelIndex(activeReelIndex + 1);
		} else {
			setActiveReelIndex(null); // End of list
		}
	};

	const handlePrevReel = () => {
		if (activeReelIndex === null) return;
		if (activeReelIndex > 0) {
			setActiveReelIndex(activeReelIndex - 1);
		} else {
			setActiveReelIndex(null);
		}
	};

	const activeReel = activeReelIndex !== null ? videoReels[activeReelIndex] : null;

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
			<div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 p-6 rounded-[24px] border border-border/30 bg-card/45 backdrop-blur-md text-left">
				{session?.user?.image ? (
					<Image
						src={session.user.image}
						alt={session.user.name ?? "Profile"}
						width={72}
						height={72}
						className="rounded-full border border-border/50 shrink-0"
					/>
				) : (
					<div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-2xl font-bold text-text-muted shrink-0">
						{session?.user?.name?.charAt(0).toUpperCase() ?? "?"}
					</div>
				)}

				<div className="flex-1 space-y-2 w-full">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h1 className="text-xl font-bold tracking-tight text-text-primary">
								{session?.user?.name ?? "Your Profile"}
							</h1>
							<p className="text-xs text-text-muted mt-0.5">{session?.user?.email}</p>
						</div>
						<div className="flex gap-2">
							<button
								onClick={handleExportArchive}
								className="h-8 px-4 rounded-full bg-accent text-background text-xs font-semibold hover:bg-accent/90 transition-all cursor-pointer shadow"
							>
								Export Archive
							</button>
							<button
								onClick={handleSignOut}
								className="h-8 px-4 rounded-full border border-border/40 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-card transition-all cursor-pointer"
							>
								Sign Out
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Organized Personal Dashboard Stats */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
				<div className="p-4 rounded-[16px] border border-border/20 bg-card text-center shadow-sm">
					<span className="block text-2xl font-bold text-text-primary font-mono">{postCount}</span>
					<span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Reflections</span>
				</div>
				<div className="p-4 rounded-[16px] border border-border/20 bg-card text-center shadow-sm">
					<span className="block text-2xl font-bold text-text-primary font-mono">{collectionCount}</span>
					<span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Collections</span>
				</div>
				<div className="p-4 rounded-[16px] border border-border/20 bg-card text-center shadow-sm">
					<span className="block text-2xl font-bold text-text-primary font-mono">{totalDays}</span>
					<span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Days Documented</span>
				</div>
				<div className="p-4 rounded-[16px] border border-border/20 bg-card text-center shadow-sm">
					<span className="block text-sm font-bold text-accent truncate mt-1">{primaryMood}</span>
					<span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Primary Mood</span>
				</div>
			</div>

			{/* Mood Breakdown Visualization */}
			{moodsList.length > 0 && (
				<div className="mb-8 p-6 rounded-[24px] border border-border/30 bg-card shadow-sm">
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

			{/* Sub-page Switcher Tabs */}
			<div className="p-1 rounded-xl bg-card border border-border/25 mb-6 max-w-sm flex items-center shadow-inner">
				<button
					type="button"
					onClick={() => setActiveTab("directory")}
					className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
						activeTab === "directory"
							? "bg-[#0c0c0e] text-accent border border-accent/20 shadow-sm"
							: "text-text-secondary hover:text-text-primary"
					}`}
				>
					Directory
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("reels")}
					className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
						activeTab === "reels"
							? "bg-[#0c0c0e] text-accent border border-accent/20 shadow-sm"
							: "text-text-secondary hover:text-text-primary"
					}`}
				>
					Video Reels
				</button>
			</div>

			{activeTab === "directory" ? (
				/* List of Reflections Organised */
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
			) : (
				/* Video Reels Grid */
				<div className="border border-border/30 rounded-[24px] bg-card p-6 min-h-[300px]">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xs uppercase tracking-[0.15em] font-mono text-text-muted">Video Memories</h2>
						<span className="text-[10px] text-text-muted font-mono">{videoReels.length} videos</span>
					</div>
					{videoReels.length === 0 ? (
						<div className="py-16 text-center text-text-muted text-xs">
							No video entries found in your reflections database.
						</div>
					) : (
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							{videoReels.map((reel, idx) => (
								<div
									key={reel.id}
									onClick={() => setActiveReelIndex(idx)}
									className="aspect-[9/16] relative rounded-2xl overflow-hidden bg-card border border-border/30 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
								>
									<video
										src={reel.mediaUrl!}
										className="w-full h-full object-cover pointer-events-none"
										muted
										playsInline
										loop
										autoPlay
									/>
									<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
										<div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-white">
											<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
												<polygon points="5 3 19 12 5 21 5 3" />
											</svg>
										</div>
									</div>
									<div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent z-10 text-left">
										<p className="text-[10px] text-white/95 truncate font-serif">{reel.caption ?? "Video Note"}</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{/* Selected reflection view (from directory) */}
			{activeTab === "directory" && selectedPost && (
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

			{/* ── Immersive Cinematic Reels Watch Theater Overlay ── */}
			{activeReelIndex !== null && activeReel && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in">
					{/* Close click area */}
					<div
						className="absolute inset-0 z-0 cursor-default"
						onClick={() => setActiveReelIndex(null)}
					/>

					{/* Desktop Nav Arrows */}
					<button
						onClick={handlePrevReel}
						disabled={activeReelIndex === 0}
						className="absolute left-6 lg:left-16 z-20 w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center text-xl font-bold cursor-pointer transition-all active:scale-95 hidden md:flex"
					>
						‹
					</button>

					<button
						onClick={handleNextReel}
						disabled={activeReelIndex === videoReels.length - 1}
						className="absolute right-6 lg:right-16 z-20 w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center text-xl font-bold cursor-pointer transition-all active:scale-95 hidden md:flex"
					>
						›
					</button>

					{/* Cinematic Video Card */}
					<div className="relative aspect-[9/16] h-[85vh] max-h-[800px] w-full max-w-[420px] rounded-[32px] overflow-hidden border border-white/10 bg-[#0c0c0e] shadow-2xl flex flex-col justify-between z-10 animate-slide-up">
						{/* Top close header bar */}
						<div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/90 to-transparent z-10 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="text-[9px] uppercase tracking-wider font-mono text-accent font-semibold bg-accent/15 px-2 py-0.5 border border-accent/20 rounded">
									Reels Mode
								</span>
								<span className="text-[10px] text-white/60 font-mono">
									{new Date(activeReel.createdAt).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric"
									})}
								</span>
							</div>
							<button
								onClick={() => setActiveReelIndex(null)}
								className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer text-sm font-bold"
								title="Close Reels"
							>
								✕
							</button>
						</div>

						{/* Full screen Video Tag */}
						<div className="absolute inset-0 z-0">
							<video
								key={activeReel.id}
								src={activeReel.mediaUrl!}
								className="w-full h-full object-cover"
								autoPlay
								controls
								playsInline
								loop
							/>
						</div>

						{/* Bottom Overlay Description */}
						<div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-10 text-left text-white px-8 flex flex-col gap-2">
							<div className="flex items-center gap-2">
								<span className="text-xs font-bold">{session?.user?.name}</span>
								{activeReel.mood && (
									<span className="px-1.5 py-0.2 text-[8px] bg-accent/20 text-accent font-bold uppercase rounded border border-accent/30 tracking-wider">
										{activeReel.mood}
									</span>
								)}
								{activeReel.location && (
									<span className="text-[9px] text-white/65">
										📍 {activeReel.location}
									</span>
								)}
							</div>
							{activeReel.caption && (
								<p className="text-xs text-white/90 font-serif leading-relaxed line-clamp-3">
									{activeReel.caption}
								</p>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
