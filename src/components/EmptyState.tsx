interface EmptyStateProps {
	message: string;
	actionLabel?: string;
	actionHref?: string;
}

export default function EmptyState({ message, actionLabel, actionHref }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-24 px-4 text-center">
			{/* Simple circle illustration */}
			<div className="w-16 h-16 rounded-full border-2 border-dashed border-border mb-6" />

			<p className="text-sm text-text-secondary leading-relaxed max-w-[280px]">
				{message}
			</p>

			{actionLabel && actionHref && (
				<a
					href={actionHref}
					className="mt-6 inline-flex h-11 px-6 items-center rounded-[12px] bg-text-primary text-background text-sm font-medium transition-opacity duration-200 ease-out hover:opacity-85"
				>
					{actionLabel}
				</a>
			)}
		</div>
	);
}
