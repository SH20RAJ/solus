export default function Skeleton({ className = "" }: { className?: string }) {
	return (
		<div
			className={`bg-border/50 rounded-[12px] animate-pulse ${className}`}
			aria-hidden="true"
		/>
	);
}

export function PostCardSkeleton() {
	return (
		<div className="rounded-[20px] border border-border bg-card overflow-hidden">
			<Skeleton className="aspect-square w-full rounded-none" />
			<div className="p-6 space-y-3">
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-3 w-1/3" />
			</div>
		</div>
	);
}

export function StoryCircleSkeleton() {
	return (
		<div className="flex flex-col items-center gap-2">
			<Skeleton className="w-16 h-16 rounded-full" />
			<Skeleton className="h-3 w-10" />
		</div>
	);
}
