"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { useStories } from "@/lib/api-client";
import Modal from "@/components/ui/Modal";
import Link from "next/link";

interface Story {
	id: string;
	userId: string;
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

export default function StoriesCarousel() {
	const { data: session } = useSession();
	const { data: storiesData, isLoading } = useStories();
	const activeStories = ((storiesData as StoriesResponse)?.data ?? []).filter(
		(s) => new Date(s.expiresAt) > new Date()
	);

	const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
	const [progress, setProgress] = useState(0);

	// Handle story auto-advancement
	useEffect(() => {
		if (activeStoryIndex === null) return;

		setProgress(0);
		const duration = 5000; // 5 seconds per story
		const intervalStep = 50; // update every 50ms
		const stepValue = (intervalStep / duration) * 100;

		const timer = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(timer);
					handleNextStory();
					return 100;
				}
				return prev + stepValue;
			});
		}, intervalStep);

		return () => clearInterval(timer);
	}, [activeStoryIndex]);

	const handleNextStory = () => {
		if (activeStoryIndex === null) return;
		if (activeStoryIndex < activeStories.length - 1) {
			setActiveStoryIndex(activeStoryIndex + 1);
		} else {
			setActiveStoryIndex(null); // End of stories
		}
	};

	const handlePrevStory = () => {
		if (activeStoryIndex === null) return;
		if (activeStoryIndex > 0) {
			setActiveStoryIndex(activeStoryIndex - 1);
		} else {
			setActiveStoryIndex(null); // End of stories
		}
	};

	return (
		<div className="w-full py-4 border-b border-border/20 mb-6 bg-card/10 select-none">
			<div className="flex items-center gap-4 overflow-x-auto px-4 scrollbar-none">
				{/* "Add Story" bubble */}
				<Link href="/create/story" className="flex flex-col items-center gap-1.5 shrink-0 group">
					<div className="relative w-16 h-16 p-[2.5px] rounded-full bg-border/40 group-hover:bg-accent/40 transition-colors flex items-center justify-center cursor-pointer">
						<div className="relative w-full h-full rounded-full overflow-hidden bg-surface flex items-center justify-center">
							{session?.user?.image ? (
								<Image
									src={session.user.image}
									alt="Your Profile"
									fill
									className="object-cover"
								/>
							) : (
								<span className="text-sm font-semibold text-text-muted">
									{session?.user?.name?.charAt(0).toUpperCase() ?? "+"}
								</span>
							)}
						</div>
						{/* Accent plus icon */}
						<div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-accent border-2 border-background flex items-center justify-center text-background text-xs font-bold shadow-sm">
							+
						</div>
					</div>
					<span className="text-[10px] text-text-muted group-hover:text-text-primary transition-colors">Your Story</span>
				</Link>

				{/* Active stories */}
				{isLoading
					? Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="flex flex-col items-center gap-1.5 shrink-0 animate-pulse">
								<div className="w-14 h-14 rounded-full bg-border/40" />
								<div className="h-3 w-10 bg-border/40 rounded-full" />
							</div>
						))
					: activeStories.map((story, index) => (
							<div
								key={story.id}
								onClick={() => setActiveStoryIndex(index)}
								className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
							>
								{/* Gradient active border ring */}
								<div className="relative w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-accent shadow-sm">
									<div className="relative w-full h-full rounded-full overflow-hidden bg-background border-2 border-background">
										{story.mediaType === "video" ? (
											<video
												src={story.mediaUrl}
												className="w-full h-full object-cover"
												muted
												playsInline
											/>
										) : story.mediaType === "audio" ? (
											<div className="w-full h-full bg-accent/10 flex items-center justify-center text-accent">
												<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
													<path d="M9 18V5l12-2v13" />
													<circle cx="6" cy="18" r="3" />
													<circle cx="18" cy="16" r="3" />
												</svg>
											</div>
										) : (
											<Image
												src={story.mediaUrl}
												alt="Story Thumbnail"
												fill
												className="object-cover"
											/>
										)}
									</div>
								</div>
								<span className="text-[10px] text-text-muted max-w-[60px] truncate">
									{new Date(story.createdAt).toLocaleTimeString("en-US", {
										hour: "numeric",
										minute: "2-digit",
									})}
								</span>
							</div>
						))}
			</div>

			{/* Full Screen Story View Modal */}
			{activeStoryIndex !== null && (
				<Modal
					isOpen={activeStoryIndex !== null}
					onClose={() => setActiveStoryIndex(null)}
					className="bg-black/90 w-full max-w-[420px] aspect-[9/16] rounded-2xl flex flex-col justify-between"
				>
					{/* Story Viewer Content */}
					<div className="relative w-full h-full flex flex-col justify-between p-4">
						{/* Progress Bars */}
						<div className="absolute top-4 left-4 right-4 z-50 flex gap-1">
							{activeStories.map((_, i) => (
								<div key={i} className="flex-1 h-[2px] bg-white/20 rounded-full overflow-hidden">
									<div
										className="h-full bg-white transition-all ease-linear"
										style={{
											width:
												i === activeStoryIndex
													? `${progress}%`
													: i < activeStoryIndex
														? "100%"
														: "0%",
										}}
									/>
								</div>
							))}
						</div>

						{/* Header (Username & Time) */}
						<div className="absolute top-8 left-4 right-4 z-50 flex items-center justify-between">
							<div className="flex items-center gap-2">
								{session?.user?.image ? (
									<Image
										src={session.user.image}
										alt={session.user.name ?? "You"}
										width={28}
										height={28}
										className="rounded-full border border-white/20"
									/>
								) : (
									<div className="w-7 h-7 rounded-full bg-surface border border-white/20 flex items-center justify-center text-[10px] font-semibold text-white">
										{session?.user?.name?.charAt(0).toUpperCase() ?? "Y"}
									</div>
								)}
								<span className="text-xs font-bold text-white">{session?.user?.name ?? "You"}</span>
								<span className="text-[10px] text-white/60">
									{new Date(activeStories[activeStoryIndex].createdAt).toLocaleTimeString("en-US", {
										hour: "numeric",
										minute: "2-digit",
									})}
								</span>
							</div>
						</div>

						{/* Main Image */}
						<div className="absolute inset-0 z-0">
							<Image
								src={activeStories[activeStoryIndex].mediaUrl}
								alt="Story Content"
								fill
								className="object-contain"
								priority
							/>
						</div>

						{/* Tap Left / Right Hotspots */}
						<div className="absolute inset-x-0 top-16 bottom-16 z-10 flex">
							<div onClick={handlePrevStory} className="w-[30%] h-full cursor-w-resize" />
							<div onClick={handleNextStory} className="w-[70%] h-full cursor-e-resize" />
						</div>

						{/* Caption bottom bar */}
						{activeStories[activeStoryIndex].caption && (
							<div className="absolute bottom-6 left-4 right-4 z-50 text-center">
								<p className="text-xs text-white drop-shadow-md bg-black/30 py-1.5 px-3 rounded-lg inline-block">
									{activeStories[activeStoryIndex].caption}
								</p>
							</div>
						)}
					</div>
				</Modal>
			)}
		</div>
	);
}
