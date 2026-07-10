"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Dropdown from "@/components/ui/Dropdown";
import CommentsModal from "@/components/CommentsModal";

interface PostCardProps {
	id?: string;
	userId?: string;
	username?: string;
	userImage?: string | null;
	mediaUrl?: string | null;
	mediaType?: string | null;
	caption?: string | null;
	location?: string | null;
	mood?: string | null;
	createdAt: string | Date;
	onDelete?: (id: string) => void;
}

export default function PostCard({
	id,
	username = "You",
	userImage,
	mediaUrl,
	mediaType,
	caption,
	location,
	mood,
	createdAt,
	onDelete,
}: PostCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [showHeart, setShowHeart] = useState(false);
	const [isCommentsOpen, setIsCommentsOpen] = useState(false);
	const lastTap = useRef<number>(0);

	const date = new Date(createdAt);
	const formattedDate = date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});

	const hasMedia = !!mediaUrl;
	const isVideo = mediaType === "video";

	// Double click to reflect/save animation
	const handleDoubleTap = () => {
		const now = Date.now();
		const DOUBLE_PRESS_DELAY = 300;
		if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
			setIsSaved(true);
			setShowHeart(true);
			setTimeout(() => setShowHeart(false), 800);
		}
		lastTap.current = now;
	};

	const truncateCaption = (text: string) => {
		const LIMIT = 120;
		if (text.length <= LIMIT) return text;
		if (isExpanded) return text;
		return (
			<>
				{text.slice(0, LIMIT)}...{" "}
				<button
					onClick={() => setIsExpanded(true)}
					className="text-text-muted hover:text-text-primary text-xs font-semibold focus:outline-none ml-1 cursor-pointer"
				>
					more
				</button>
			</>
		);
	};

	const dropdownItems = [];
	if (onDelete && id) {
		dropdownItems.push({
			label: "Delete Reflection",
			onClick: () => onDelete(id),
			className: "text-danger hover:bg-danger/10",
		});
	}

	if (!hasMedia) {
		return (
			<article className="rounded-[24px] border border-border/30 bg-card p-5 shadow-[0_2px_12px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out select-none">
				{/* Tweet Header */}
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-3">
						{userImage ? (
							<Image
								src={userImage}
								alt={username}
								width={36}
								height={36}
								className="rounded-full border border-border/40"
							/>
						) : (
							<div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-sm font-semibold text-text-muted">
								{username.charAt(0).toUpperCase()}
							</div>
						)}
						<div className="min-w-0">
							<div className="flex items-center gap-1.5">
								<span className="text-sm font-bold text-text-primary hover:underline cursor-pointer">
									{username}
								</span>
								{mood && (
									<span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-surface border border-border/30 text-[8px] text-text-secondary font-medium">
										{mood}
									</span>
								)}
							</div>
							{location && (
								<p className="text-[10px] text-text-muted truncate mt-0.5">
									{location}
								</p>
							)}
						</div>
					</div>

					{dropdownItems.length > 0 && (
						<Dropdown
							trigger={
								<button className="p-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer rounded-lg hover:bg-surface">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<circle cx="12" cy="12" r="1" />
										<circle cx="19" cy="12" r="1" />
										<circle cx="5" cy="12" r="1" />
									</svg>
								</button>
							}
							items={dropdownItems}
						/>
					)}
				</div>

				{/* Tweet text content */}
				{caption && (
					<p className="text-base sm:text-lg text-text-primary leading-relaxed font-sans mt-2 mb-6">
						{caption}
					</p>
				)}

				{/* Tweet Footer / Actions */}
				<div className="flex items-center justify-between pt-3 border-t border-border/20">
					<div className="flex items-center gap-6">
						{/* Like/Reflect */}
						<button
							onClick={() => setIsSaved(!isSaved)}
							className={`transition-transform active:scale-75 cursor-pointer p-0.5 rounded-full ${
								isSaved ? "text-accent" : "text-text-muted hover:text-text-primary"
							}`}
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75">
								<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
							</svg>
						</button>

						{/* Comments */}
						<button
							onClick={() => setIsCommentsOpen(true)}
							className="text-text-muted hover:text-text-primary transition-colors cursor-pointer p-0.5"
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
								<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
							</svg>
						</button>

						{/* Export */}
						<button className="text-text-muted hover:text-text-primary cursor-pointer p-0.5">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
								<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
								<polyline points="16 6 12 2 8 6" />
								<line x1="12" y1="2" x2="12" y2="15" />
							</svg>
						</button>
					</div>

					<span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
						{formattedDate}
					</span>
				</div>

				{id && (
					<CommentsModal
						isOpen={isCommentsOpen}
						onClose={() => setIsCommentsOpen(false)}
						postId={id}
					/>
				)}
			</article>
		);
	}

	return (
		<article className="rounded-[24px] border border-border/30 bg-card overflow-hidden shadow-[0_2px_12px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out select-none">
			{/* Instagram-style Header */}
			<div className="flex items-center justify-between px-4 py-3">
				<div className="flex items-center gap-3">
					{userImage ? (
						<Image
							src={userImage}
							alt={username}
							width={32}
							height={32}
							className="rounded-full border border-border/40"
						/>
					) : (
						<div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-semibold text-text-muted">
							{username.charAt(0).toUpperCase()}
						</div>
					)}
					<div className="min-w-0">
						<div className="flex items-center gap-1.5">
							<span className="text-xs font-bold text-text-primary hover:underline cursor-pointer">
								{username}
							</span>
							{mood && (
								<span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-surface border border-border/30 text-[8px] text-text-secondary font-medium">
									{mood}
								</span>
							)}
						</div>
						{location && (
							<p className="text-[10px] text-text-muted truncate mt-0.5">
								{location}
							</p>
						)}
					</div>
				</div>

				{/* Options menu */}
				{dropdownItems.length > 0 && (
					<Dropdown
						trigger={
							<button className="p-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer rounded-lg hover:bg-surface">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<circle cx="12" cy="12" r="1" />
									<circle cx="19" cy="12" r="1" />
									<circle cx="5" cy="12" r="1" />
								</svg>
							</button>
						}
						items={dropdownItems}
					/>
				)}
			</div>

			{/* Photo/Video with Double-Tap Support */}
			{mediaUrl && (
				<div
					onClick={handleDoubleTap}
					className="relative aspect-square w-full bg-surface overflow-hidden cursor-pointer"
				>
					{isVideo ? (
						<video
							src={mediaUrl}
							controls
							className="w-full h-full object-cover"
						/>
					) : (
						<Image
							src={mediaUrl}
							alt={caption ?? "Memory"}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, 760px"
						/>
					)}

					{/* Heart Pop Animation */}
					{showHeart && (
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
							<svg
								width="80"
								height="80"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="text-white drop-shadow-lg scale-[1.2] animate-fade-in"
								style={{
									animation: "fade-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) both",
								}}
							>
								<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
							</svg>
						</div>
					)}
				</div>
			)}

			{/* Content area */}
			<div className="p-4 pt-3">
				{/* Actions Row */}
				<div className="flex items-center justify-between pb-3 mb-2.5 border-b border-border/20">
					<div className="flex items-center gap-4">
						{/* Reflect/Bookmark (like replacement) */}
						<button
							onClick={() => setIsSaved(!isSaved)}
							className={`transition-transform active:scale-75 cursor-pointer p-0.5 rounded-full ${
								isSaved ? "text-accent" : "text-text-muted hover:text-text-primary"
							}`}
							title={isSaved ? "Reflected" : "Reflect"}
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill={isSaved ? "currentColor" : "none"}
								stroke="currentColor"
								strokeWidth="1.75"
							>
								<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
							</svg>
						</button>

						{/* Comments trigger */}
						<button
							onClick={() => setIsCommentsOpen(true)}
							className="text-text-muted hover:text-text-primary transition-colors cursor-pointer p-0.5"
							title="Reflections & Notes"
						>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
								<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
							</svg>
						</button>

						{/* Export/Link Button */}
						<button
							className="text-text-muted hover:text-text-primary cursor-pointer p-0.5"
							title="Export Entry"
						>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
								<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
								<polyline points="16 6 12 2 8 6" />
								<line x1="12" y1="2" x2="12" y2="15" />
							</svg>
						</button>
					</div>

					<span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
						{formattedDate}
					</span>
				</div>

				{/* Caption Block */}
				{caption && (
					<p className="text-sm text-text-primary leading-relaxed font-sans">
						<span className="font-bold mr-2 text-xs">{username}</span>
						{truncateCaption(caption)}
					</p>
				)}
			</div>

			{id && (
				<CommentsModal
					isOpen={isCommentsOpen}
					onClose={() => setIsCommentsOpen(false)}
					postId={id}
				/>
			)}
		</article>
	);
}
