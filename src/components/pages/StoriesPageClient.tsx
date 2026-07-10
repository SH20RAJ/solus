"use client";

import StoryCircle from "@/components/StoryCircle";
import EmptyState from "@/components/EmptyState";
import { StoryCircleSkeleton } from "@/components/Skeleton";
import { useStories } from "@/lib/api-client";

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

	return (
		<div className="py-10 sm:py-16 max-w-[640px] mx-auto animate-slide-up">
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
				<div className="flex gap-4 overflow-x-auto pb-4">
					{activeStories.map((story) => (
						<StoryCircle
							key={story.id}
							imageUrl={story.mediaUrl}
							label={
								story.caption ??
								new Date(story.createdAt).toLocaleTimeString("en-US", {
									hour: "numeric",
									minute: "2-digit",
								})
							}
							isNew
						/>
					))}
				</div>
			)}
		</div>
	);
}
