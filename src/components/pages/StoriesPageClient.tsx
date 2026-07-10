"use client";

import { useState, useEffect } from "react";
import StoryCircle from "@/components/StoryCircle";
import EmptyState from "@/components/EmptyState";
import { StoryCircleSkeleton } from "@/components/Skeleton";
import { useStories } from "@/lib/api-client";
import { mutate } from "swr";
import Image from "next/image";
import Link from "next/link";

interface Story {
	id: string;
	mediaUrl: string;
	mediaType: string;
	caption: string | null;
	expiresAt: string;
	createdAt: string;
}

interface StoriesResponse {
	success: boolean;
	data: Story[];
}

export default function StoriesPageClient() {
	const { data, isLoading } = useStories();
	const stories = (data as StoriesResponse)?.data ?? [];

	// Filter out expired stories
	const activeStories = stories.filter(
		(s) => new Date(s.expiresAt) > new Date()
	);

	const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
	const [progress, setProgress] = useState(0);

	const activeStory = activeStoryIndex !== null ? activeStories[activeStoryIndex] : null;

	// Progress bar timer ticker
	useEffect(() => {
		if (activeStoryIndex === null) return;
		setProgress(0);

		const interval = setInterval(() => {
			setProgress((p) => {
				if (p >= 100) {
					// Move to next story
					if (activeStoryIndex < activeStories.length - 1) {
						setActiveStoryIndex(activeStoryIndex + 1);
					} else {
						setActiveStoryIndex(null); // Close player at end
					}
					return 0;
				}
				return p + 2; // ~5 seconds total duration
			});
		}, 100);

		return () => clearInterval(interval);
	}, [activeStoryIndex, activeStories.length]);

	const handlePrev = () => {
		if (activeStoryIndex === null) return;
		if (activeStoryIndex > 0) {
			setActiveStoryIndex(activeStoryIndex - 1);
		} else {
			setActiveStoryIndex(null);
		}
	};

	const handleNext = () => {
		if (activeStoryIndex === null) return;
		if (activeStoryIndex < activeStories.length - 1) {
			setActiveStoryIndex(activeStoryIndex + 1);
		} else {
			setActiveStoryIndex(null);
		}
	};

	const handleDeleteStory = async (storyId: string) => {
		if (!confirm("Delete this fleeting moment?")) return;
		try {
			await fetch(`/api/stories/${storyId}`, {
				method: "DELETE",
				credentials: "include",
			});
			setActiveStoryIndex(null);
			mutate("/api/stories");
		} catch {
			// Silently fail
		}
	};

	return (
		<div className="py-8 sm:py-12 w-full max-w-[720px] mx-auto animate-slide-up select-none font-sans">
			{/* Header */}
			<header className="mb-8 flex items-end justify-between border-b border-border/20 pb-6">
				<div>
					<span className="text-[10px] uppercase tracking-[0.2em] font-mono text-accent font-semibold">
						fleeting archives
					</span>
					<h1 className="text-3xl font-semibold tracking-tight text-text-primary font-serif mt-1">
						Moments
					</h1>
					<p className="mt-1.5 text-xs text-text-muted leading-relaxed">
						Fleeting memories that expire automatically 24 hours after creation.
					</p>
				</div>
				<Link
					href="/create"
					className="h-9 px-4 rounded-full bg-accent text-background text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-accent/5 cursor-pointer"
				>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
						<line x1="12" y1="5" x2="12" y2="19" />
						<line x1="5" y1="12" x2="19" y2="12" />
					</svg>
					Capture Moment
				</Link>
			</header>

			{isLoading ? (
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="aspect-[9/16] rounded-2xl bg-card border border-border/25 animate-pulse" />
					))}
				</div>
			) : activeStories.length === 0 ? (
				<EmptyState
					message="No fleeting moments active. Capture your first story today."
					actionLabel="Capture Moment"
					actionHref="/create"
				/>
			) : (
				<div className="space-y-8">
					{/* Bubble Reels Quick-bar */}
					<div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
						{activeStories.map((story, idx) => (
							<StoryCircle
								key={story.id}
								imageUrl={story.mediaUrl}
								mediaType={story.mediaType}
								label={
									story.caption ??
									new Date(story.createdAt).toLocaleTimeString("en-US", {
										hour: "numeric",
										minute: "2-digit",
									})
								}
								isNew={true}
								onClick={() => setActiveStoryIndex(idx)}
							/>
						))}
					</div>

					{/* Postcard Stories Grid */}
					<div className="space-y-4">
						<h3 className="text-xs uppercase tracking-wider font-mono text-text-muted">
							Active Moments Gallery
						</h3>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							{activeStories.map((story, idx) => {
								const isStoryVideo = story.mediaType === "video" || story.mediaUrl.endsWith(".mp4");
								const dateStr = new Date(story.createdAt).toLocaleTimeString("en-US", {
									hour: "numeric",
									minute: "2-digit"
								});

								return (
									<div
										key={story.id}
										onClick={() => setActiveStoryIndex(idx)}
										className="aspect-[9/16] relative rounded-2xl overflow-hidden bg-card border border-border/30 group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
									>
										{/* Media cover */}
										<div className="absolute inset-0 z-0">
											{isStoryVideo ? (
												<video
													src={story.mediaUrl}
													className="w-full h-full object-cover pointer-events-none"
													muted
													playsInline
													loop
													autoPlay
												/>
											) : (
												<Image
													src={story.mediaUrl}
													alt={story.caption ?? "Moment"}
													fill
													className="object-cover transition-transform duration-500 group-hover:scale-105"
													sizes="(max-width: 640px) 50vw, 30vw"
												/>
											)}
										</div>

										{/* Top Badge */}
										<div className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-black/45 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
											{isStoryVideo ? (
												<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
													<polygon points="5 3 19 12 5 21 5 3" />
												</svg>
											) : (
												<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
													<circle cx="12" cy="12" r="10" />
												</svg>
											)}
										</div>

										{/* Bottom Card Info Overlay */}
										<div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10 flex flex-col justify-end text-left">
											<span className="text-[10px] font-mono text-white/80 font-semibold">
												{dateStr}
											</span>
											{story.caption && (
												<p className="text-[11px] text-white/95 truncate font-serif mt-0.5 leading-relaxed">
													{story.caption}
												</p>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* ── Immersive Cinematic Theater Player Modal ── */}
					{activeStoryIndex !== null && activeStory && (
						<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in">
							{/* Large background close click catcher */}
							<div
								className="absolute inset-0 z-0 cursor-default"
								onClick={() => setActiveStoryIndex(null)}
							/>

							{/* Desktop Floating Left/Right Nav Arrows */}
							<button
								onClick={handlePrev}
								className="absolute left-6 lg:left-16 z-20 w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center text-xl font-bold cursor-pointer transition-all active:scale-95 hidden md:flex"
								title="Previous Story"
							>
								‹
							</button>

							<button
								onClick={handleNext}
								className="absolute right-6 lg:right-16 z-20 w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center text-xl font-bold cursor-pointer transition-all active:scale-95 hidden md:flex"
								title="Next Story"
							>
								›
							</button>

							{/* The Main Player Card Container */}
							<div className="relative aspect-[9/16] h-[85vh] max-h-[800px] w-full max-w-[420px] rounded-[32px] overflow-hidden border border-white/10 bg-[#0c0c0e] shadow-2xl flex flex-col justify-between z-10 animate-slide-up">
								{/* Top overlay details & bars */}
								<div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/90 to-transparent z-10 space-y-3.5">
									{/* Segments progress bar */}
									<div className="flex gap-1.5 h-1 w-full">
										{activeStories.map((_, idx) => {
											let width = "0%";
											if (idx < activeStoryIndex) width = "100%";
											else if (idx === activeStoryIndex) width = `${progress}%`;
											return (
												<div key={idx} className="flex-1 bg-white/25 rounded-full h-full overflow-hidden">
													<div className="bg-accent h-full transition-all duration-100 ease-linear" style={{ width }} />
												</div>
											);
										})}
									</div>

									{/* Header user identity + Delete + Close buttons */}
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="w-7 h-7 rounded-full bg-accent/25 border border-accent/40 flex items-center justify-center text-[10px] font-bold text-accent">
												S
											</div>
											<div className="flex flex-col text-left">
												<span className="text-xs font-semibold text-white">You</span>
												<span className="text-[8px] text-white/50 font-mono">
													{new Date(activeStory.createdAt).toLocaleTimeString("en-US", {
														hour: "numeric",
														minute: "2-digit"
													})}
												</span>
											</div>
										</div>

										<div className="flex items-center gap-3">
											{/* Delete story button */}
											<button
												onClick={() => handleDeleteStory(activeStory.id)}
												className="p-1.5 rounded-lg text-white/60 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
												title="Delete story"
											>
												<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
													<polyline points="3 6 5 6 21 6" />
													<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
												</svg>
											</button>

											<button
												onClick={() => setActiveStoryIndex(null)}
												className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer text-sm font-bold"
												title="Close Theater"
											>
												✕
											</button>
										</div>
									</div>
								</div>

								{/* Cinematic Media Content */}
								<div className="absolute inset-0 z-0">
									{activeStory.mediaType === "video" || activeStory.mediaUrl.endsWith(".mp4") ? (
										<video
											key={activeStory.id}
											src={activeStory.mediaUrl}
											className="w-full h-full object-cover"
											autoPlay
											muted
											playsInline
										/>
									) : (
										<Image
											src={activeStory.mediaUrl}
											alt="Story Media"
											fill
											className="object-cover"
											priority
										/>
									)}
								</div>

								{/* Mobile Tap-to-step zone triggers */}
								<div className="absolute inset-y-16 inset-x-0 z-10 flex">
									<div className="w-1/3 h-full cursor-w-resize" onClick={handlePrev} />
									<div className="w-1/3 h-full" />
									<div className="w-1/3 h-full cursor-e-resize" onClick={handleNext} />
								</div>

								{/* Bottom caption overlay */}
								{activeStory.caption && (
									<div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-10 text-center text-white text-xs font-serif leading-relaxed px-8">
										{activeStory.caption}
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
