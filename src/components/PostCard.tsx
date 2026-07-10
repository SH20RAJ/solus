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

	return (
		<article className="rounded-[20px] border border-border bg-card overflow-hidden">
			{/* Photo */}
			{mediaUrl && (
				<div className="relative aspect-square bg-surface">
					<Image
						src={mediaUrl}
						alt={caption ?? "Memory"}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, 760px"
					/>
				</div>
			)}

			{/* Content */}
			<div className="p-6">
				{/* Caption */}
				{caption && (
					<p className="text-base text-text-primary leading-relaxed">
						{caption}
					</p>
				)}

				{/* Meta */}
				<div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
					<time dateTime={date.toISOString()}>{formattedDate}</time>
					{location && (
						<>
							<span>·</span>
							<span>{location}</span>
						</>
					)}
					{mood && (
						<>
							<span>·</span>
							<span>{mood}</span>
						</>
					)}
				</div>
			</div>
		</article>
	);
}
