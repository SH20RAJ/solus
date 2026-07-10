import Image from "next/image";

interface StoryCircleProps {
	imageUrl: string;
	mediaType?: string | null;
	label?: string;
	isNew?: boolean;
	onClick?: () => void;
}

export default function StoryCircle({
	imageUrl,
	mediaType,
	label,
	isNew = false,
	onClick,
}: StoryCircleProps) {
	const isVideo = mediaType === "video" || imageUrl.endsWith(".mp4") || imageUrl.includes("mp4") || imageUrl.includes("webm");

	return (
		<button
			onClick={onClick}
			className="flex flex-col items-center gap-2 shrink-0 cursor-pointer"
			type="button"
		>
			<div
				className={`relative w-16 h-16 rounded-full overflow-hidden ${
					isNew
						? "ring-2 ring-accent ring-offset-2 ring-offset-background"
						: "ring-1 ring-border"
				}`}
			>
				{isVideo ? (
					<video
						src={imageUrl}
						className="w-full h-full object-cover pointer-events-none"
						muted
						playsInline
					/>
				) : (
					<Image
						src={imageUrl}
						alt={label ?? "Story"}
						fill
						className="object-cover"
						sizes="64px"
					/>
				)}
			</div>
			{label && (
				<span className="text-xs text-text-muted truncate max-w-[64px]">
					{label}
				</span>
			)}
		</button>
	);
}
