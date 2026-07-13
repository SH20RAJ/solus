"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { usePosts, useCollections } from "@/lib/api-client";
import Skeleton from "@/components/Skeleton";
import PostCard from "@/components/PostCard";
import FileManager from "@/components/FileManager";
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
	data: Array<{ id: string; title: string; description?: string; coverUrl?: string }>;
}

interface Highlight {
	id: string;
	title: string;
	coverUrl: string;
	postIds: string[];
	posts?: Post[];
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

	// Mock highlights matching profile design
	const [highlights, setHighlights] = useState<Highlight[]>([
		{
			id: "h1",
			title: "Tokyo 2026",
			coverUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=200&auto=format&fit=crop",
			postIds: [],
		},
		{
			id: "h2",
			title: "Summer Vibes",
			coverUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200&auto=format&fit=crop",
			postIds: [],
		},
		{
			id: "h3",
			title: "Daily Coffee",
			coverUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&auto=format&fit=crop",
			postIds: [],
		},
	]);

	const [showHighlightCreator, setShowHighlightCreator] = useState(false);
	const [newHighlightTitle, setNewHighlightTitle] = useState("");
	const [selectedHighlightPosts, setSelectedHighlightPosts] = useState<string[]>([]);
	const [viewingHighlight, setViewingHighlight] = useState<Highlight | null>(null);
	const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
	const [showFileManager, setShowFileManager] = useState(false);

	// Calculate statistics
	const totalDays = posts.length > 0
		? Math.ceil(Math.abs(new Date().getTime() - new Date(posts[posts.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24))
		: 0;

	// Calculate profile calendar cells
	const profileFirstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();
	const profileDaysCount = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
	const profileCells = [];
	for (let i = 0; i < profileFirstDay; i++) {
		profileCells.push({ day: null, dateStr: null, post: null });
	}
	for (let d = 1; d <= profileDaysCount; d++) {
		const cellDate = new Date(new Date().getFullYear(), new Date().getMonth(), d);
		const cellDateStr = cellDate.toDateString();
		const dayPost = posts.find((p) => p.mood && new Date(p.createdAt).toDateString() === cellDateStr);
		const year = cellDate.getFullYear();
		const month = String(cellDate.getMonth() + 1).padStart(2, "0");
		const dayStr = String(d).padStart(2, "0");
		profileCells.push({
			day: d,
			dateStr: `${year}-${month}-${dayStr}`,
			post: dayPost,
		});
	}

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

	// Save highlight
	const handleCreateHighlight = () => {
		if (!newHighlightTitle.trim()) return;
		const matchingPostWithMedia = posts.find((p) => p.mediaUrl && selectedHighlightPosts.includes(p.id));
		const cover = matchingPostWithMedia?.mediaUrl?.split(",")[0] || "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=200&auto=format&fit=crop";

		const newHighlight: Highlight = {
			id: `h-${Date.now()}`,
			title: newHighlightTitle,
			coverUrl: cover,
			postIds: selectedHighlightPosts,
		};

		setHighlights((prev) => [...prev, newHighlight]);
		setNewHighlightTitle("");
		setSelectedHighlightPosts([]);
		setShowHighlightCreator(false);
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
		<div className="py-8 sm:py-12 w-full select-none font-sans max-w-[640px] mx-auto">
			<div className="animate-slide-up space-y-8">
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

			{/* INSTAGRAM-STYLE HIGHLIGHTS ROW */}
			<div className="mb-8 text-left">
				<h3 className="text-[10px] text-text-muted font-mono uppercase tracking-wider mb-3">Highlights</h3>
				<div className="flex items-center gap-4 overflow-x-auto py-2 scrollbar-none">
					{/* Add button */}
					<button
						onClick={() => setShowHighlightCreator(true)}
						className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer focus:outline-none"
					>
						<div className="w-14 h-14 rounded-full border border-dashed border-border/60 flex items-center justify-center text-text-muted hover:border-accent hover:text-accent transition-all duration-200 bg-card/20">
							<span className="text-lg">+</span>
						</div>
						<span className="text-[10px] text-text-secondary font-medium">New Highlight</span>
					</button>

					{/* Highlights List */}
					{highlights.map((h) => (
						<button
							key={h.id}
							onClick={() => {
								const linked = posts.filter((p) => h.postIds.includes(p.id));
								setViewingHighlight({ ...h, posts: linked.length > 0 ? linked : posts.slice(0, 3) });
								setCurrentHighlightIndex(0);
							}}
							className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer focus:outline-none group"
						>
							<div className="w-14 h-14 rounded-full p-0.5 border border-border/80 group-hover:border-accent transition-all bg-card overflow-hidden">
								<div className="relative w-full h-full rounded-full overflow-hidden">
									<Image src={h.coverUrl} alt={h.title} fill className="object-cover" />
								</div>
							</div>
							<span className="text-[10px] text-text-secondary group-hover:text-text-primary transition-colors font-medium max-w-[64px] truncate">
								{h.title}
							</span>
						</button>
					))}
				</div>
			</div>

			{/* VAULT DIRECTORY OPTIONS - UNIFIED REDIRECT MATRIX */}
			<div className="mb-8 text-left">
				<h3 className="text-[10px] text-text-muted font-mono uppercase tracking-wider mb-4">Vault Directories</h3>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
					<Link
						href="/timeline"
						className="p-5 rounded-[20px] bg-card border border-border/30 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 flex flex-col gap-2 group shadow-sm text-left"
					>
						<span className="text-xl">📅</span>
						<h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors leading-none">Timeline Map</h4>
						<p className="text-[10px] text-text-secondary leading-normal">Browse raw chronological memory streams.</p>
					</Link>
					<Link
						href="/reels"
						className="p-5 rounded-[20px] bg-card border border-border/30 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 flex flex-col gap-2 group shadow-sm text-left"
					>
						<span className="text-xl">🎬</span>
						<h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors leading-none">Video Reels</h4>
						<p className="text-[10px] text-text-secondary leading-normal">Watch vertical video-snap memory cards.</p>
					</Link>
					<Link
						href="/stories"
						className="p-5 rounded-[20px] bg-card border border-border/30 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 flex flex-col gap-2 group shadow-sm text-left"
					>
						<span className="text-xl">🔮</span>
						<h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors leading-none">Stories Archive</h4>
						<p className="text-[10px] text-text-secondary leading-normal">Explore past 24h story uploads.</p>
					</Link>
					<Link
						href="/collections"
						className="p-5 rounded-[20px] bg-card border border-border/30 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 flex flex-col gap-2 group shadow-sm text-left"
					>
						<span className="text-xl">📖</span>
						<h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors leading-none">Journal Books</h4>
						<p className="text-[10px] text-text-secondary leading-normal">Open curated diaries & photo albums.</p>
					</Link>
					<button
						onClick={() => setShowFileManager(true)}
						className="p-5 rounded-[20px] bg-card border border-border/30 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 flex flex-col gap-2 group shadow-sm text-left cursor-pointer focus:outline-none"
					>
						<span className="text-xl">🔒</span>
						<h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors leading-none">Private Locker</h4>
						<p className="text-[10px] text-text-secondary leading-normal">Secure folders, text logs & files.</p>
					</button>
					<Link
						href="/calendar"
						className="p-5 rounded-[20px] bg-card border border-border/30 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 flex flex-col gap-2 group shadow-sm text-left"
					>
						<span className="text-xl">🌈</span>
						<h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors leading-none">Vibe Calendar</h4>
						<p className="text-[10px] text-text-secondary leading-normal">Explore your logged feelings over days.</p>
					</Link>
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
					<span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Primary Vibe</span>
				</div>
			</div>

			{/* Mood Breakdown Visualization */}
			{moodsList.length > 0 && (
				<div className="mb-8 p-6 rounded-[24px] border border-border/30 bg-card shadow-sm text-left">
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
								/>
							);
						})}
					</div>
					<div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
						{moodsList.map((item, idx) => {
							const colors = ["bg-accent", "bg-[#38bdf8]", "bg-[#34d399]", "bg-[#f59e0b]", "bg-[#ec4899]"];
							const color = colors[idx % colors.length];
							return (
								<div key={item.mood} className="flex items-center gap-2">
									<span className={`w-2 h-2 rounded-full ${color}`} />
									<span className="text-[10px] text-text-secondary leading-none font-mono">
										{item.mood} ({item.percentage}%)
									</span>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Sensory Mood Calendar Widget */}
			<div className="mb-8 p-6 rounded-[24px] border border-border/30 bg-card shadow-sm text-left">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xs uppercase tracking-[0.15em] font-mono text-text-muted">Mood Calendar</h2>
					<Link
						href="/calendar"
						className="text-[10px] font-mono text-accent hover:underline flex items-center gap-1"
					>
						Full Calendar →
					</Link>
				</div>
				<p className="text-[10px] text-text-muted mb-4 font-mono leading-normal">
					Visual log of this month&apos;s daily vibes. Click any day dot to see reflections.
				</p>
				<div className="grid grid-cols-7 gap-2 max-w-sm">
					{["S", "M", "T", "W", "T", "F", "S"].map((w, idx) => (
						<span key={idx} className="text-[9px] font-mono text-text-muted text-center font-bold">
							{w}
						</span>
					))}
					{profileCells.map((cell, idx) => {
						if (!cell.day) return <div key={`p-empty-${idx}`} className="w-7 h-7" />;

						const cellMood = cell.post?.mood;
						const moodColors: Record<string, string> = {
							happy: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.35)] border-amber-500/20 text-amber-950",
							calm: "bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.35)] border-sky-500/20 text-sky-950",
							grateful: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.35)] border-emerald-500/20 text-emerald-950",
							reflective: "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.35)] border-indigo-500/20 text-indigo-950",
							tired: "bg-zinc-500 shadow-[0_0_8px_rgba(115,115,115,0.35)] border-zinc-500/20 text-zinc-950",
						};

						const colorClass = cellMood
							? moodColors[cellMood.toLowerCase()] ?? "bg-accent/40 text-background"
							: "bg-card border-border/10 hover:border-border/30 text-text-secondary";

						return (
							<Link
								key={cell.dateStr}
								href={`/day/${cell.dateStr}`}
								className={`w-7 h-7 rounded-full border flex items-center justify-center text-[9px] font-mono hover:scale-110 active:scale-95 transition-all ${colorClass}`}
								title={cellMood ? `${cell.dateStr}: ${cellMood}` : cell.dateStr || ""}
							>
								{cell.day}
							</Link>
						);
					})}
				</div>
			</div>

			{/* Memory Directory List */}
			<div className="border border-border/30 rounded-[24px] bg-card overflow-hidden text-left">
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
								year: "2-digit",
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
		</div>

			{/* Detail Overlay Card */}
			{selectedPost && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div
						className="fixed inset-0"
						onClick={() => setSelectedPost(null)}
					/>
					<div className="relative w-full max-w-[500px] z-10 animate-scale-in">
						<button
							onClick={() => setSelectedPost(null)}
							className="absolute -top-10 right-0 w-8 h-8 rounded-full bg-black/80 text-white flex items-center justify-center text-xs font-bold cursor-pointer"
						>
							✕
						</button>
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
							onDelete={(id) => {
								handleDelete(id);
								setSelectedPost(null);
							}}
						/>
					</div>
				</div>
			)}

			{/* INSTAGRAM-STYLE HIGHLIGHT PLAYER MODAL */}
			{viewingHighlight && viewingHighlight.posts && viewingHighlight.posts.length > 0 && (
				<div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
					<div className="absolute inset-0" onClick={() => setViewingHighlight(null)} />
					<div className="relative w-full max-w-[420px] aspect-[9/16] bg-card rounded-3xl overflow-hidden border border-border/40 flex flex-col z-10 animate-scale-in text-white shadow-2xl">
						{/* Progress Indicators */}
						<div className="absolute top-3 left-4 right-4 flex gap-1.5 z-20">
							{viewingHighlight.posts.map((_, idx) => (
								<div key={idx} className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
									<div
										className="h-full bg-accent transition-all duration-3000 ease-linear"
										style={{
											width: idx < currentHighlightIndex ? "100%" : idx === currentHighlightIndex ? "100%" : "0%",
										}}
									/>
								</div>
							))}
						</div>

						{/* Highlight Header */}
						<div className="absolute top-7 left-4 right-4 flex items-center justify-between z-20 text-white">
							<span className="text-xs font-bold tracking-wide uppercase font-mono bg-black/45 px-3 py-1.5 rounded-full border border-white/10">
								🌟 {viewingHighlight.title}
							</span>
							<button
								onClick={() => setViewingHighlight(null)}
								className="w-7 h-7 rounded-full bg-black/45 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-black/60 border border-white/10"
							>
								✕
							</button>
						</div>

						{/* Highlight Slides */}
						<div className="flex-1 relative w-full h-full bg-surface">
							{viewingHighlight.posts[currentHighlightIndex].mediaUrl ? (
								<div className="relative w-full h-full">
									{viewingHighlight.posts[currentHighlightIndex].mediaType === "video" ? (
										<video
											src={viewingHighlight.posts[currentHighlightIndex].mediaUrl!}
											className="w-full h-full object-cover"
											autoPlay
											muted
											playsInline
										/>
									) : (
										<Image
											src={viewingHighlight.posts[currentHighlightIndex].mediaUrl!.split(",")[0]}
											alt="Highlight memory"
											fill
											className="object-cover"
										/>
									)}
								</div>
							) : (
								<div className="w-full h-full flex flex-col items-center justify-center p-6 text-center font-serif italic text-base bg-[#181512]">
									&ldquo;{viewingHighlight.posts[currentHighlightIndex].caption}&rdquo;
								</div>
							)}

							{/* Navigation Tap Overlays */}
							<div
								onClick={() => {
									if (currentHighlightIndex > 0) {
										setCurrentHighlightIndex(currentHighlightIndex - 1);
									}
								}}
								className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer z-10"
							/>
							<div
								onClick={() => {
									if (currentHighlightIndex < (viewingHighlight.posts?.length ?? 1) - 1) {
										setCurrentHighlightIndex(currentHighlightIndex + 1);
									} else {
										setViewingHighlight(null);
									}
								}}
								className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer z-10"
							/>
						</div>

						{/* Caption Overlay */}
						{viewingHighlight.posts[currentHighlightIndex].caption && (
							<div className="absolute bottom-6 left-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-left z-20 text-xs leading-relaxed font-serif text-white/90">
								{viewingHighlight.posts[currentHighlightIndex].caption}
							</div>
						)}
					</div>
				</div>
			)}

			{/* HIGHLIGHT CREATOR MODAL */}
			{showHighlightCreator && (
				<div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="absolute inset-0" onClick={() => setShowHighlightCreator(false)} />
					<div className="relative w-full max-w-[450px] bg-card border border-border/40 rounded-[28px] p-6 text-left z-10 animate-scale-in">
						<h3 className="text-sm font-bold text-text-primary uppercase font-mono tracking-wider mb-4">Create Highlight</h3>
						<input
							type="text"
							value={newHighlightTitle}
							onChange={(e) => setNewHighlightTitle(e.target.value)}
							placeholder="Highlight Title (e.g. Kyoto Trip)"
							className="w-full h-10 px-4 rounded-xl border border-border/40 bg-card text-xs text-text-primary placeholder:text-text-muted focus:outline-none mb-4"
						/>
						<p className="text-[10px] text-text-muted font-mono uppercase tracking-wider mb-2">Select Memories</p>
						<div className="max-h-48 overflow-y-auto border border-border/20 rounded-xl divide-y divide-border/10 mb-6 bg-surface/30">
							{posts.map((p) => {
								const isSelected = selectedHighlightPosts.includes(p.id);
								return (
									<div
										key={p.id}
										onClick={() => {
											if (isSelected) {
												setSelectedHighlightPosts(selectedHighlightPosts.filter((id) => id !== p.id));
											} else {
												setSelectedHighlightPosts([...selectedHighlightPosts, p.id]);
											}
										}}
										className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-surface/50 text-xs transition-colors ${
											isSelected ? "bg-accent/5 text-accent" : "text-text-secondary"
										}`}
									>
										<span className="text-base shrink-0">{isSelected ? "☑" : "☐"}</span>
										<span className="truncate flex-1 font-serif italic">{p.caption || "Photo memory"}</span>
									</div>
								);
							})}
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => setShowHighlightCreator(false)}
								className="flex-1 h-9 rounded-xl border border-border text-xs font-semibold text-text-secondary hover:text-text-primary transition-all cursor-pointer"
							>
								Cancel
							</button>
							<button
								onClick={handleCreateHighlight}
								className="flex-1 h-9 rounded-xl bg-accent text-background text-xs font-semibold hover:bg-accent/90 transition-all cursor-pointer"
							>
								Save Highlight
							</button>
						</div>
					</div>
				</div>
			)}

			{showFileManager && (
				<FileManager
					isOpen={showFileManager}
					onClose={() => setShowFileManager(false)}
					userId={session?.user?.id ?? "anonymous"}
				/>
			)}
		</div>
	);
}
