import Image from "next/image";

interface PostCardProps {
	mediaUrl?: string | null;
	mediaType?: string | null;
	caption?: string | null;
	location?: string | null;
	mood?: string | null;
	createdAt: string | Date;
}

export default function PostCard({
	mediaUrl,
	caption,
	location,
	mood,
	createdAt,
}: PostCardProps) {
	const date = new Date(createdAt);
	const formattedDate = date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});

	const hasMedia = !!mediaUrl;

	return (
		<article className="rounded-[24px] border border-border/30 bg-card p-4 shadow-[0_2px_12px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out">
			{/* Photo */}
			{mediaUrl && (
				<div className="relative aspect-[4/3] rounded-[16px] overflow-hidden bg-surface mb-4">
					<Image
						src={mediaUrl}
						alt={caption ?? "Memory"}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, 760px"
						priority={false}
					/>
				</div>
			)}

			{/* Content */}
			<div className="px-1.5 py-1">
				{/* Caption */}
				{caption && (
					<p
						className={`text-text-primary leading-relaxed ${
							hasMedia
								? "text-sm sm:text-base font-normal"
								: "text-base sm:text-lg font-serif italic text-text-primary/90"
						}`}
					>
						{caption}
					</p>
				)}

				{/* Meta details */}
				<div className="flex items-center gap-2.5 mt-4 text-[10px] sm:text-xs text-text-muted font-mono uppercase tracking-wider">
					<time dateTime={date.toISOString()}>{formattedDate}</time>
					{location && (
						<>
							<span className="text-text-muted/40">·</span>
							<span className="truncate max-w-[120px] sm:max-w-none">{location}</span>
						</>
					)}
					{mood && (
						<>
							<span className="text-text-muted/40">·</span>
							<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface border border-border/30 text-text-secondary text-[9px] sm:text-[10px]">
								{mood}
							</span>
						</>
					)}
				</div>
			</div>
		</article>
	);
}
