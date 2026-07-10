"use client";

import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import { useCollections } from "@/lib/api-client";

interface Journey {
	id: string;
	title: string;
	description: string | null;
	isPublic: boolean;
	createdAt: string;
	updatedAt: string;
}

interface JourneysResponse {
	success: boolean;
	data: Journey[];
}

export default function CollectionsPage() {
	const { data, isLoading } = useCollections();
	const journeys = (data as JourneysResponse)?.data ?? [];

	return (
		<div className="py-8 sm:py-12 w-full animate-slide-up">
			<header className="mb-10">
				<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary font-serif">
					Collections
				</h1>
				<p className="mt-1.5 text-xs sm:text-sm text-text-muted leading-relaxed">
					Organize your private memories into shared or private collections.
				</p>
			</header>

			{isLoading ? (
				<div className="space-y-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="p-6 rounded-[24px] border border-border/30 bg-card space-y-3">
							<Skeleton className="h-5 w-2/3" />
							<Skeleton className="h-4 w-1/2" />
						</div>
					))}
				</div>
			) : journeys.length === 0 ? (
				<EmptyState
					message="No collections created yet. Keep documenting until you're ready to bundle memories."
				/>
			) : (
				<div className="space-y-4">
					{journeys.map((journey) => (
						<Link
							key={journey.id}
							href={`/collections/${journey.id}`}
							className="block p-6 rounded-[24px] border border-border/30 bg-card transition-all duration-300 ease-out hover:bg-surface/50 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)]"
						>
							<div className="flex items-start justify-between gap-4">
								<div>
									<h3 className="text-base font-semibold text-text-primary">
										{journey.title}
									</h3>
									{journey.description && (
										<p className="mt-1.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
											{journey.description}
										</p>
									)}
									<p className="mt-3 text-xs text-text-muted">
										{new Date(journey.createdAt).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</p>
								</div>
								{journey.isPublic && (
									<span className="shrink-0 px-2.5 py-1 rounded-[8px] bg-accent/10 text-accent text-[10px] font-medium uppercase tracking-wider font-mono">
										Public
									</span>
								)}
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
