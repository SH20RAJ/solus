import Link from "next/link";

interface EmptyStateProps {
	message: string;
	actionLabel?: string;
	actionHref?: string;
}

export default function EmptyState({ message, actionLabel, actionHref }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-[24px] bg-card/20 border border-border/30">
			{/* Minimal Quill/Pen Icon */}
			<div className="w-12 h-12 rounded-full bg-surface border border-border/40 flex items-center justify-center mb-6 text-text-muted">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
					<path d="M12 20h9" />
					<path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
				</svg>
			</div>

			<p className="text-sm text-text-secondary leading-relaxed max-w-[280px]">
				{message}
			</p>

			{actionLabel && actionHref && (
				<Link
					href={actionHref}
					className="mt-6 inline-flex h-9 px-5 items-center justify-center rounded-[10px] bg-text-primary text-background text-xs font-medium transition-all duration-200 ease-out hover:opacity-90 active:scale-[0.98]"
				>
					{actionLabel}
				</Link>
			)}
		</div>
	);
}
