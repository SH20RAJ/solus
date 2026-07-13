export default function Skeleton({ className = "" }: { className?: string }) {
	return (
		<div
			className={`bg-border/30 rounded-[12px] animate-pulse ${className}`}
			aria-hidden="true"
		/>
	);
}

export function PostCardSkeleton() {
	return (
		<div className="rounded-[24px] border border-border/25 bg-card p-5 space-y-4 shadow-sm select-none">
			{/* Header skeleton */}
			<div className="flex items-center gap-3">
				<Skeleton className="w-9 h-9 rounded-full" />
				<div className="space-y-1.5 flex-1">
					<Skeleton className="h-3 w-28 rounded" />
					<Skeleton className="h-2.5 w-20 rounded" />
				</div>
				<Skeleton className="w-6 h-6 rounded-lg" />
			</div>

			{/* Media container skeleton */}
			<Skeleton className="aspect-[4/3] w-full rounded-2xl" />

			{/* Caption block */}
			<div className="space-y-2">
				<Skeleton className="h-3.5 w-full rounded" />
				<Skeleton className="h-3.5 w-2/3 rounded" />
			</div>

			{/* Action Footer skeleton */}
			<div className="flex items-center justify-between pt-3 border-t border-border/10">
				<div className="flex items-center gap-4">
					<Skeleton className="w-16 h-4 rounded-full" />
					<Skeleton className="w-12 h-4 rounded-full" />
				</div>
				<Skeleton className="h-3 w-14 rounded" />
			</div>
		</div>
	);
}

export function StoryCircleSkeleton() {
	return (
		<div className="flex flex-col items-center gap-1.5 shrink-0">
			<div className="w-16 h-16 rounded-full p-[2.5px] border border-border/30 bg-card/40 flex items-center justify-center">
				<Skeleton className="w-full h-full rounded-full" />
			</div>
			<Skeleton className="h-2 w-10 rounded" />
		</div>
	);
}

export function CollectionCardSkeleton() {
	return (
		<div className="w-32 h-44 rounded-2xl border border-border/25 bg-card/60 p-3 space-y-3 shrink-0">
			<Skeleton className="w-full h-24 rounded-xl" />
			<Skeleton className="h-3 w-20 rounded" />
			<Skeleton className="h-2 w-12 rounded" />
		</div>
	);
}
