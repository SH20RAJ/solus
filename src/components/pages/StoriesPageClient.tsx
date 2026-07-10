"use client";

import { useState, useEffect } from "react";
import StoryCircle from "@/components/StoryCircle";
import EmptyState from "@/components/EmptyState";
import { StoryCircleSkeleton } from "@/components/Skeleton";
import { useStories } from "@/lib/api-client";
import Image from "next/image";

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

	// Progress bar ticker
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
						setActiveStoryIndex(null); // End of stories
					}
					return 0;
				}
				return p + 2; // Increments to 100 over 5 seconds
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

	return (
		<div className="py-8 sm:py-12 w-full max-w-[640px] mx-auto animate-slide-up select-none font-sans">
			<header className="mb-10">
				<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary font-serif">
					Stories
				</h1>
				<p className="mt-1.5 text-xs sm:text-sm text-text-muted leading-relaxed">
					Moments captured and kept for 24 hours.
				</p>
			</header>

			{isLoading ? (
				<div className="flex gap-4 overflow-x-auto pb-4">
					{Array.from({ length: 5 }).map((_, i) => (
						<StoryCircleSkeleton key={i} />
					))}
				</div>
			) : activeStories.length === 0 ? (
				<EmptyState
					message="No stories captured yet. Share a fleeting reflection."
					actionLabel="Capture Story"
					actionHref="/create"
				/>
			) : (
				<div className="space-y-12">
					{/* Horizontal Stories Bubbles */}
					<div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none border-b border-border/20">
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
								isNew={activeStoryIndex !== idx}
								onClick={() => setActiveStoryIndex(idx)}
							/>
						))}
					</div>

					{/* Immersive Theater Story Player */}
					{activeStoryIndex !== null && activeStory && (
						<div className="relative aspect-[9/16] w-full max-w-[340px] mx-auto rounded-[32px] overflow-hidden border border-border/40 bg-[#0c0c0e] shadow-2xl flex flex-col justify-between animate-fade-in">
							{/* Header controls & Progress indicators */}
							<div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/85 to-transparent z-10 space-y-3">
								{/* Progress Segment bars */}
								<div className="flex gap-1.5 h-1 w-full">
									{activeStories.map((_, idx) => {
										let width = "0%";
										if (idx < activeStoryIndex) width = "100%";
										else if (idx === activeStoryIndex) width = `${progress}%`;
										return (
											<div key={idx} className="flex-1 bg-white/20 rounded-full h-full overflow-hidden">
												<div className="bg-accent h-full transition-all duration-100 ease-linear" style={{ width }} />
											</div>
										);
									})}
								</div>

								{/* Creator meta & close */}
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-[9px] font-bold text-accent">
											S
										</div>
										<span className="text-[10px] font-semibold text-white">You</span>
										<span className="text-[8px] text-white/60 font-mono">
											{new Date(activeStory.createdAt).toLocaleTimeString("en-US", {
												hour: "numeric",
												minute: "2-digit"
											})}
										</span>
									</div>
									<button 
										onClick={() => setActiveStoryIndex(null)}
										className="text-white/60 hover:text-white text-xs cursor-pointer p-1"
									>
										✕
									</button>
								</div>
							</div>

							{/* Story Media Viewer */}
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

							{/* Nav Tap Buttons (Left / Right overlays) */}
							<div className="absolute inset-y-16 inset-x-0 z-10 flex">
								<div className="w-1/3 h-full cursor-w-resize" onClick={handlePrev} />
								<div className="w-1/3 h-full" />
								<div className="w-1/3 h-full cursor-e-resize" onClick={handleNext} />
							</div>

							{/* Caption Block */}
							{activeStory.caption && (
								<div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10 text-center text-white text-xs font-serif leading-relaxed">
									{activeStory.caption}
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
