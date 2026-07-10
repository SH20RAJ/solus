"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { PostCardSkeleton } from "@/components/Skeleton";
import EmptyState from "@/components/EmptyState";
import { useJourney } from "@/lib/api-client";

interface Post {
	id: string;
	caption: string | null;
	mediaUrl: string | null;
	mediaType: string | null;
	location: string | null;
	mood: string | null;
	createdAt: string;
}

interface JourneyData {
	id: string;
	title: string;
	description: string | null;
	isPublic: boolean;
	createdAt: string;
	posts: Post[];
}

interface JourneyResponse {
	success: boolean;
	data: JourneyData;
}

export default function JourneyDetailPage() {
	const params = useParams();
	const id = params.id as string;
	const { data, isLoading } = useJourney(id);
	const journey = (data as JourneyResponse)?.data;

	if (isLoading) {
		return (
			<div className="py-8 sm:py-12 space-y-6">
				<div className="space-y-3">
					<div className="h-8 w-2/3 bg-border/50 rounded-[12px] animate-pulse" />
					<div className="h-4 w-1/3 bg-border/50 rounded-[12px] animate-pulse" />
				</div>
				<PostCardSkeleton />
				<PostCardSkeleton />
			</div>
		);
	}

	if (!journey) {
		return (
			<div className="py-8 sm:py-12">
				<EmptyState message="Journey not found." actionLabel="Back to Journeys" actionHref="/journeys" />
			</div>
		);
	}

	return (
		<div className="py-8 sm:py-12">
			<Link
				href="/journeys"
				className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200 ease-out"
			>
				← Journeys
			</Link>

			<header className="mt-6 mb-10">
				<div className="flex items-start justify-between gap-4">
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
						{journey.title}
					</h1>
					{journey.isPublic && (
						<span className="shrink-0 px-2.5 py-1 rounded-[8px] bg-accent/10 text-accent text-xs font-medium">
							Public
						</span>
					)}
				</div>
				{journey.description && (
					<p className="mt-3 text-base text-text-secondary leading-relaxed">
						{journey.description}
					</p>
				)}
				<p className="mt-3 text-xs text-text-muted">
					Started{" "}
					{new Date(journey.createdAt).toLocaleDateString("en-US", {
						month: "long",
						day: "numeric",
						year: "numeric",
					})}
				</p>
			</header>

			{journey.posts.length === 0 ? (
				<EmptyState message="This journey has no memories yet." />
			) : (
				<div className="space-y-8">
					{journey.posts.map((post) => (
						<PostCard
							key={post.id}
							mediaUrl={post.mediaUrl}
							mediaType={post.mediaType}
							caption={post.caption}
							location={post.location}
							mood={post.mood}
							createdAt={post.createdAt}
						/>
					))}
				</div>
			)}
		</div>
	);
}
