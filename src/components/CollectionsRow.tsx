"use client";

import Image from "next/image";
import Link from "next/link";
import { useCollections } from "@/lib/api-client";
import Skeleton from "@/components/Skeleton";

interface Journey {
	id: string;
	title: string;
	description: string | null;
	coverUrl: string | null;
	createdAt: string;
}

interface JourneysResponse {
	success: boolean;
	data: Journey[];
}

export default function CollectionsRow() {
	const { data: journeysData, isLoading } = useCollections();
	const collections = (journeysData as JourneysResponse)?.data ?? [];

	if (isLoading) {
		return (
			<div className="w-full pb-4 border-b border-border/20 mb-8 select-none">
				<div className="flex gap-4 overflow-x-auto px-4 scrollbar-none">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
							<Skeleton className="w-24 h-24 rounded-2xl" />
							<Skeleton className="h-3 w-14 rounded-full" />
						</div>
					))}
				</div>
			</div>
		);
	}

	if (collections.length === 0) return null;

	// Gradients list for cover fallbacks
	const GRADIENTS = [
		"from-pink-500/20 to-rose-500/10",
		"from-purple-500/20 to-indigo-500/10",
		"from-blue-500/20 to-cyan-500/10",
		"from-teal-500/20 to-emerald-500/10",
		"from-amber-500/20 to-orange-500/10",
	];

	return (
		<div className="w-full pb-6 border-b border-border/20 mb-8 select-none">
			<div className="px-4 mb-3 flex items-center justify-between">
				<h2 className="text-xs uppercase tracking-[0.15em] font-mono text-text-muted">
					Collections
				</h2>
				<Link
					href="/collections"
					className="text-xs text-text-muted hover:text-text-primary transition-colors"
				>
					See all
				</Link>
			</div>

			<div className="flex items-center gap-4 overflow-x-auto px-4 scrollbar-none">
				{collections.map((collection, index) => {
					const gradient = GRADIENTS[index % GRADIENTS.length];
					return (
						<Link
							key={collection.id}
							href={`/collections/${collection.id}`}
							className="flex flex-col items-center gap-2 shrink-0 group"
						>
							{/* Google Photos Album style cover card */}
							<div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-card border border-border/30 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all duration-300 group-hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.1)] group-hover:scale-[1.02]">
								{collection.coverUrl ? (
									<Image
										src={collection.coverUrl}
										alt={collection.title}
										fill
										className="object-cover"
									/>
								) : (
									<div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted/65 group-hover:text-text-primary transition-colors duration-300">
											<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
											<path d="M6 6h10M6 10h10" />
										</svg>
									</div>
								)}
							</div>
							
							<span className="text-[10px] font-semibold text-text-secondary group-hover:text-text-primary transition-colors max-w-[96px] truncate text-center">
								{collection.title}
							</span>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
