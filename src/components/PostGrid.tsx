"use client";

import Image from "next/image";
import Link from "next/link";

interface GridPost {
	id: string;
	mediaUrl?: string | null;
	mediaType?: string | null;
	caption?: string | null;
}

interface PostGridProps {
	posts: GridPost[];
	onPostClick?: (post: GridPost) => void;
}

export default function PostGrid({ posts, onPostClick }: PostGridProps) {
	if (posts.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center text-text-muted">
				<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3">
					<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
					<circle cx="9" cy="9" r="2" />
					<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
				</svg>
				<p className="text-xs">No memories with photos yet.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-3 gap-1 sm:gap-2">
			{posts.map((post) => {
				const isVideo = post.mediaType === "video";
				return (
					<div
						key={post.id}
						onClick={() => onPostClick?.(post)}
						className="relative aspect-square bg-surface border border-border/20 rounded-md sm:rounded-lg overflow-hidden group cursor-pointer"
					>
						{post.mediaUrl ? (
							<Image
								src={post.mediaUrl}
								alt={post.caption ?? "Memory grid thumbnail"}
								fill
								className="object-cover transition-transform duration-300 group-hover:scale-105"
								sizes="(max-width: 768px) 33vw, 240px"
							/>
						) : (
							<div className="absolute inset-0 flex items-center justify-center p-3 text-center bg-card text-[10px] sm:text-xs text-text-secondary leading-snug font-serif italic line-clamp-4">
								{post.caption}
							</div>
						)}

						{/* Hover overlay */}
						<div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
							{isVideo && (
								<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
									<polygon points="5 3 19 12 5 21 5 3" />
								</svg>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
