"use client";

import { useState, useEffect, useRef } from "react";
import { usePosts } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import Skeleton from "@/components/Skeleton";
import EmptyState from "@/components/EmptyState";
import { mutate } from "swr";
import Link from "next/link";

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

export default function ReelsPageClient() {
	const { data: postsData, isLoading } = usePosts();
	const { data: session } = useSession();
	const posts = (postsData as PostsResponse)?.data ?? [];

	// Filter video posts
	const videoReels = posts.filter(
		(p) => p.mediaType === "video" || p.mediaUrl?.endsWith(".mp4")
	);

	const [isMuted, setIsMuted] = useState(true);
	const containerRef = useRef<HTMLDivElement>(null);
	const [activeIdx, setActiveIdx] = useState(0);

	// Handle video autoplay based on scroll intersection
	useEffect(() => {
		const container = containerRef.current;
		if (!container || videoReels.length === 0) return;

		const observerOptions = {
			root: container,
			threshold: 0.6, // Trigger when 60% of the video is visible
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				const video = entry.target.querySelector("video");
				if (!video) return;

				if (entry.isIntersecting) {
					const index = parseInt(entry.target.getAttribute("data-index") ?? "0", 10);
					setActiveIdx(index);
					video.play().catch(() => {});
				} else {
					video.pause();
					video.currentTime = 0;
				}
			});
		}, observerOptions);

		const items = container.querySelectorAll("[data-reel-item]");
		items.forEach((item) => observer.observe(item));

		return () => {
			items.forEach((item) => observer.unobserve(item));
		};
	}, [videoReels.length]);

	const handleDelete = async (postId: string) => {
		if (!confirm("Are you sure you want to delete this video memory?")) return;
		try {
			await fetch(`/api/posts/${postId}`, {
				method: "DELETE",
				credentials: "include",
			});
			mutate("/api/posts");
		} catch {
			// Silently fail
		}
	};

	if (isLoading) {
		return (
			<div className="w-full h-[85vh] flex items-center justify-center bg-black">
				<div className="space-y-4 text-center">
					<Skeleton className="w-[300px] h-[533px] rounded-3xl mx-auto" />
					<div className="h-4 w-32 bg-border/50 rounded mx-auto animate-pulse" />
				</div>
			</div>
		);
	}

	if (videoReels.length === 0) {
		return (
			<div className="py-12 w-full max-w-[600px] mx-auto text-center font-sans">
				<EmptyState
					message="No video posts found in your journal database."
					actionLabel="Create Entry"
					actionHref="/create"
				/>
			</div>
		);
	}

	return (
		<div className="w-full flex justify-center bg-[#050506] font-sans">
			{/* Reels Vertical Scroll Container */}
			<div
				ref={containerRef}
				className="w-full max-w-[420px] h-[calc(100vh-64px)] sm:h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-none relative"
			>
				{videoReels.map((reel, idx) => {
					const dateStr = new Date(reel.createdAt).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					});

					return (
						<div
							key={reel.id}
							data-index={idx}
							data-reel-item
							className="w-full h-full snap-start snap-always relative flex items-center justify-center bg-black select-none overflow-hidden"
						>
							{/* Video Element */}
							<video
								src={reel.mediaUrl!}
								className="w-full h-full object-cover"
								loop
								playsInline
								muted={isMuted}
								onClick={() => setIsMuted(!isMuted)}
							/>

							{/* Big Mute Indicator Overlay */}
							<button
								onClick={() => setIsMuted(!isMuted)}
								className="absolute inset-0 w-full h-full flex items-center justify-center bg-transparent z-10 cursor-pointer active:scale-95 group"
							>
								<div className="p-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10 opacity-0 group-active:opacity-100 transition-opacity duration-200">
									{isMuted ? (
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
											<path d="M11 5 6 9H2v6h4l5 4V5Z" />
											<line x1="22" y1="9" x2="16" y2="15" />
											<line x1="16" y1="9" x2="22" y2="15" />
										</svg>
									) : (
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
											<path d="M11 5 6 9H2v6h4l5 4V5Z" />
											<path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
										</svg>
									)}
								</div>
							</button>

							{/* Sound Toggle Button (bottom right corner) */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									setIsMuted(!isMuted);
								}}
								className="absolute bottom-28 right-4 z-20 w-9 h-9 rounded-full bg-black/45 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/70 cursor-pointer active:scale-95"
							>
								{isMuted ? (
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M11 5 6 9H2v6h4l5 4V5Z" />
										<line x1="22" y1="9" x2="16" y2="15" />
										<line x1="16" y1="9" x2="22" y2="15" />
									</svg>
								) : (
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M11 5 6 9H2v6h4l5 4V5Z" />
										<path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
									</svg>
								)}
							</button>

							{/* Delete button (top right corner, if own post) */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleDelete(reel.id);
								}}
								className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/45 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-red-400 hover:bg-black/70 cursor-pointer active:scale-95"
								title="Delete Reel"
							>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<polyline points="3 6 5 6 21 6" />
									<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
								</svg>
							</button>

							{/* Bottom Info Overlay */}
							<div className="absolute bottom-6 inset-x-0 p-6 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-15 text-left text-white px-6 flex flex-col gap-2">
								<div className="flex items-center gap-2.5">
									<div className="w-7 h-7 rounded-full bg-accent/25 border border-accent/40 flex items-center justify-center text-[10px] font-bold text-accent">
										S
									</div>
									<div className="flex flex-col text-left">
										<span className="text-xs font-semibold text-white">{session?.user?.name ?? "You"}</span>
										<span className="text-[8px] text-white/50 font-mono">{dateStr}</span>
									</div>
									{reel.mood && (
										<span className="ml-auto px-1.5 py-0.5 text-[8px] bg-accent/20 text-accent font-bold uppercase rounded border border-accent/30 tracking-wider">
											{reel.mood}
										</span>
									)}
								</div>

								{reel.location && (
									<div className="flex items-center gap-1 text-[10px] text-white/70">
										<span>📍</span>
										<span>{reel.location}</span>
									</div>
								)}

								{reel.caption && (
									<p className="text-xs text-white/90 font-serif leading-relaxed line-clamp-3 mt-1">
										{reel.caption}
									</p>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
