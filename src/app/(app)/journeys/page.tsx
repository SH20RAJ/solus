"use client";

import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import { useJourneys } from "@/lib/api-client";

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

export default function JourneysPage() {
	const { data, isLoading } = useJourneys();
	const journeys = (data as JourneysResponse)?.data ?? [];

	return (
		<div className="py-8 sm:py-12">
			<header className="mb-10">
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
					Journeys
				</h1>
				<p className="mt-1 text-sm text-text-muted">
					Stories built over time.
				</p>
			</header>

			{isLoading ? (
				<div className="space-y-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="p-6 rounded-[20px] border border-border bg-card space-y-3">
							<Skeleton className="h-5 w-2/3" />
							<Skeleton className="h-4 w-1/2" />
						</div>
					))}
				</div>
			) : journeys.length === 0 ? (
				<EmptyState
					message="No journeys yet. Group your memories into meaningful stories."
				/>
			) : (
				<div className="space-y-4">
					{journeys.map((journey) => (
						<Link
							key={journey.id}
							href={`/journeys/${journey.id}`}
							className="block p-6 rounded-[20px] border border-border bg-card transition-colors duration-200 ease-out hover:bg-surface"
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
									<span className="shrink-0 px-2.5 py-1 rounded-[8px] bg-accent/10 text-accent text-xs font-medium">
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
