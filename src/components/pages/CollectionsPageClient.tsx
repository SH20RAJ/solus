"use client";

import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import { useCollections } from "@/lib/api-client";

interface Journey {
	id: string;
	title: string;
	description: string | null;
	coverUrl: string | null;
	isPublic: boolean;
	createdAt: string;
	updatedAt: string;
}

interface JourneysResponse {
	success: boolean;
	data: Journey[];
}

export default function CollectionsPageClient() {
	const { data, isLoading } = useCollections();
	const journeys = (data as JourneysResponse)?.data ?? [];

	// Vibrant fallback gradient presets for cards that lack cover photos
	const FALLBACK_GRADIENTS = [
		"from-indigo-500/25 to-violet-500/20 text-indigo-400 border-indigo-500/20",
		"from-sky-500/25 to-blue-500/20 text-sky-400 border-sky-500/20",
		"from-emerald-500/25 to-teal-500/20 text-emerald-400 border-emerald-500/20",
		"from-rose-500/25 to-pink-500/20 text-rose-400 border-rose-500/20",
		"from-amber-500/25 to-yellow-500/20 text-amber-400 border-amber-500/20",
	];

	return (
		<div className="py-8 sm:py-12 w-full animate-slide-up select-none font-sans">
			<header className="mb-10 text-left border-b border-border/20 pb-6">
				<span className="text-[10px] uppercase tracking-[0.2em] font-mono text-accent font-semibold">
					memories catalog
				</span>
				<h1 className="text-3xl font-semibold tracking-tight text-text-primary font-serif mt-1">
					Collections
				</h1>
				<p className="mt-1.5 text-xs text-text-muted leading-relaxed">
					Curate and organize your private reflections into beautiful, themed digital chapters.
				</p>
			</header>

			{isLoading ? (
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="aspect-[4/5] rounded-[24px] bg-card border border-border/20 p-3 space-y-4 animate-pulse">
							<div className="aspect-square w-full rounded-xl bg-surface/50" />
							<div className="space-y-2">
								<div className="h-4 w-2/3 bg-surface/50 rounded" />
								<div className="h-3 w-1/2 bg-surface/50 rounded" />
							</div>
						</div>
					))}
				</div>
			) : journeys.length === 0 ? (
				<EmptyState
					message="No collections created yet. Keep documenting until you're ready to bundle memories."
				/>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
					{journeys.map((journey, index) => {
						const gradient = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];
						return (
							<Link
								key={journey.id}
								href={`/collections/${journey.id}`}
								className="group relative flex flex-col bg-card border border-border/30 rounded-[24px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
							>
								{/* Polaroid Cover image */}
								<div className="aspect-square relative w-full bg-[#0c0c0e] overflow-hidden border-b border-border/10">
									{journey.coverUrl ? (
										<img
											src={journey.coverUrl}
											alt={journey.title}
											className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
											loading="lazy"
										/>
									) : (
										<div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
												<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
												<path d="M6 6h10M6 10h10" />
											</svg>
										</div>
									)}

									{journey.isPublic && (
										<span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-accent text-background text-[8px] font-bold uppercase tracking-wider font-mono shadow-sm">
											Public
										</span>
									)}
								</div>

								{/* Album details */}
								<div className="p-4 flex flex-col justify-between flex-1 text-left">
									<div>
										<h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-accent transition-colors truncate">
											{journey.title}
										</h3>
										{journey.description && (
											<p className="mt-1 text-[10px] text-text-muted leading-relaxed line-clamp-2">
												{journey.description}
											</p>
										)}
									</div>
									<div className="mt-3 flex items-center justify-between text-[8px] font-mono uppercase tracking-wider text-text-muted/70">
										<span>
											{new Date(journey.createdAt).toLocaleDateString("en-US", {
												month: "short",
												year: "2-digit",
											})}
										</span>
										<span className="group-hover:text-accent transition-colors font-bold">
											Open Album →
										</span>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
