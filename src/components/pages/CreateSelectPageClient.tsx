"use client";

import Link from "next/link";

export default function CreateSelectPageClient() {
	return (
		<div className="py-12 sm:py-20 px-4 sm:px-6 w-full max-w-[540px] mx-auto animate-slide-up select-none font-sans text-left">
			<header className="mb-10">
				<span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-mono text-accent font-semibold">
					Sanctuary Creator
				</span>
				<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary font-serif mt-1">
					What would you like to capture?
				</h1>
				<p className="mt-1.5 text-xs text-text-muted leading-relaxed">
					Choose a format for your reflection. Everything remains completely private by default.
				</p>
			</header>

			<div className="space-y-4">
				{/* Post */}
				<Link
					href="/create/post"
					className="block p-5 rounded-[24px] bg-card border border-border/30 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 group shadow-sm"
				>
					<div className="flex gap-4 items-start">
						<span className="text-2xl p-2 rounded-xl bg-surface border border-border/20 group-hover:scale-105 transition-transform">✍</span>
						<div>
							<h3 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
								Write or Record a Post
							</h3>
							<p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
								Log thoughts, feelings, voice notes, or photos to your permanent private timeline.
							</p>
						</div>
					</div>
				</Link>

				{/* Story */}
				<Link
					href="/create/story"
					className="block p-5 rounded-[24px] bg-card border border-border/30 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 group shadow-sm"
				>
					<div className="flex gap-4 items-start">
						<span className="text-2xl p-2 rounded-xl bg-surface border border-border/20 group-hover:scale-105 transition-transform">📷</span>
						<div>
							<h3 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
								Share a Story Moment
							</h3>
							<p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
								A quick media snapshot or video-bite that automatically archives after 24 hours.
							</p>
						</div>
					</div>
				</Link>

				{/* Journal */}
				<Link
					href="/create/journal"
					className="block p-5 rounded-[24px] bg-card border border-border/30 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 group shadow-sm"
				>
					<div className="flex gap-4 items-start">
						<span className="text-2xl p-2 rounded-xl bg-surface border border-border/20 group-hover:scale-105 transition-transform">📖</span>
						<div>
							<h3 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
								Create a Journal Book
							</h3>
							<p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
								Curate a folder, diary, or album with custom covers and descriptions for themed logs.
							</p>
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
}
