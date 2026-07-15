"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "@/components/ui/Dropdown";
import CommentsModal from "@/components/CommentsModal";
import { formatCaption } from "@/utils/text";
import { renderMarkdown } from "@/utils/markdown";
import { useLikes, LikesResponse } from "@/lib/api-client";
import { mutate } from "swr";

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
	publishAt?: string | Date | null;
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
	publishAt,
	createdAt,
	onDelete,
}: PostCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [imageError, setImageError] = useState(false);
	const [isCommentsOpen, setIsCommentsOpen] = useState(false);
	const lastTap = useRef<number>(0);

	const { data: likesData } = useLikes(id ?? null);
	const isLiked = likesData?.data?.liked ?? false;

	const handleLikeToggle = async () => {
		if (!id) return;

		const currentLikes = likesData ?? {
			success: true,
			data: { liked: false, count: 0 }
		};

		const nextLiked = !currentLikes.data.liked;
		const nextCount = nextLiked ? currentLikes.data.count + 1 : Math.max(0, currentLikes.data.count - 1);

		const optimisticData: LikesResponse = {
			success: true,
			data: { liked: nextLiked, count: nextCount }
		};

		try {
			mutate(`/api/likes/post/${id}`, optimisticData, false);

			await fetch(`/api/likes/post/${id}`, {
				method: "POST",
				credentials: "include",
			});
			mutate(`/api/likes/post/${id}`);
		} catch {
			mutate(`/api/likes/post/${id}`, currentLikes, false);
		}
	};

	const handleDoubleTap = () => {
		const now = Date.now();
		const DOUBLE_PRESS_DELAY = 300;
		if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
			if (!isLiked) {
				handleLikeToggle();
			}
		}
		lastTap.current = now;
	};

	const date = new Date(createdAt);
	const formattedDate = date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});

	const isTimeLocked = publishAt && new Date(publishAt).getTime() > Date.now();

	// If time-locked, render a tactile sealed envelope visual with countdown
	if (isTimeLocked) {
		const countdownMs = new Date(publishAt).getTime() - Date.now();
		const daysLeft = Math.ceil(countdownMs / (1000 * 60 * 60 * 24));
		return (
			<div className="rounded-[24px] border border-border/30 bg-[#0e0f14] p-6 shadow-md text-center max-w-md mx-auto select-none my-6">
				<div className="w-12 h-12 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center mx-auto text-accent text-xl mb-4">
					✉
				</div>
				<h3 className="text-sm font-semibold text-text-primary">Time-Locked Memory</h3>
				<p className="text-xs text-text-muted mt-2 leading-relaxed">
					This moment is sealed. It will become readable in {daysLeft} {daysLeft === 1 ? 'day' : 'days'}.
				</p>
				<div className="mt-4 text-[9px] text-accent/80 font-mono tracking-wider">
					TEMPORAL VAULT LOCK
				</div>
			</div>
		);
	}

	const hasMedia = !!mediaUrl && !imageError;
	const isVideo = mediaType === "video";
	const isAudio = mediaType === "audio";
	const mediaUrls = mediaUrl ? mediaUrl.split(",") : [];

	const getTruncatedCaption = (text: string) => {
		const LIMIT = 120;
		if (text.length <= LIMIT) return { content: text, isTruncated: false };
		if (isExpanded) return { content: text, isTruncated: false };
		return { content: text.slice(0, LIMIT) + "...", isTruncated: true };
	};

	const dropdownItems = [];
	if (id) {
		dropdownItems.push({
			label: "View Entry",
			onClick: () => window.location.assign(`/posts/${id}`),
		});
		if (onDelete) {
			dropdownItems.push({
				label: "Delete Entry",
				onClick: () => onDelete(id),
				className: "text-red-500 hover:bg-red-500/10",
			});
		}
	}

	// ── Render Text Only Mode ──
	if (!hasMedia) {
		return (
			<article className="rounded-[24px] border border-border/30 bg-card p-5 shadow-sm hover:shadow-md transition-all duration-300 ease-out select-none text-left">
				<div className="flex items-center justify-between mb-4">
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
								<span className="text-[9px] text-text-muted truncate mt-0.5 inline-block">
									📍 {location}
								</span>
							)}
						</div>
					</div>

					{dropdownItems.length > 0 && (
						<Dropdown
							trigger={
								<button className="p-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer rounded-lg hover:bg-surface">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

				{caption && (
					<div className="text-sm text-text-primary leading-relaxed font-serif italic mt-2 mb-6 prose-p:italic">
						{renderMarkdown(caption)}
					</div>
				)}

				<div className="flex items-center justify-between pt-3 border-t border-border/20">
					<div className="flex items-center gap-6">
						{/* Favorite Toggle Bookmark */}
						<div className="flex items-center gap-1.5">
							<button
								onClick={handleLikeToggle}
								className={`transition-transform active:scale-75 cursor-pointer p-0.5 rounded-full ${
									isLiked ? "text-amber-400" : "text-text-muted hover:text-text-primary"
								}`}
								title={isLiked ? "Remove from Favorites" : "Add to Favorites"}
							>
								<svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75">
									<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
								</svg>
							</button>
							<span className="text-[9px] text-text-muted select-none font-mono">
								{isLiked ? "Favorited" : "Favorite"}
							</span>
						</div>

						{/* Reflections & Notes */}
						<button
							onClick={() => setIsCommentsOpen(true)}
							className="text-text-muted hover:text-text-primary transition-colors cursor-pointer p-0.5"
							title="Self-notes & Reflections"
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
								<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
							</svg>
						</button>

						{/* Export */}
						<button className="text-text-muted hover:text-text-primary cursor-pointer p-0.5" title="Export Post">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
								<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
								<polyline points="16 6 12 2 8 6" />
								<line x1="12" y1="2" x2="12" y2="15" />
							</svg>
						</button>
					</div>

					<span className="text-[9px] text-text-muted font-mono uppercase tracking-wider">
						{formattedDate}
					</span>
				</div>
			</article>
		);
	}

	// ── Render Media Mode ──
	return (
		<article className="rounded-[24px] border border-border/30 bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-out select-none text-left">
			{/* Media element with double-tap bookmark */}
			<div className="relative aspect-[4/3] w-full bg-surface" onDoubleClick={handleDoubleTap}>
				{isAudio ? (
					<div className="flex flex-col items-center justify-center h-full p-6 bg-surface/30">
						<span className="text-3xl mb-4">🎵</span>
						<audio src={mediaUrls[0]} controls className="w-full max-w-xs mt-2" />
					</div>
				) : isVideo ? (
					<video src={mediaUrls[0]} controls className="w-full h-full object-cover" />
				) : (
					<Image
						src={mediaUrls[0]}
						alt="Memory"
						fill
						className="object-cover"
						onError={() => setImageError(true)}
					/>
				)}

				{/* Floating Header Overlay */}
				<div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between text-white z-10">
					<div className="flex items-center gap-3">
						{userImage ? (
							<Image
								src={userImage}
								alt={username}
								width={32}
								height={32}
								className="rounded-full border border-white/20"
							/>
						) : (
							<div className="w-8 h-8 rounded-full bg-white/20 border border-white/10 flex items-center justify-center text-xs font-semibold">
								{username.charAt(0).toUpperCase()}
							</div>
						)}
						<div className="text-left">
							<div className="flex items-center gap-1.5">
								<span className="text-xs font-bold">{username}</span>
								{mood && (
									<span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-white/10 text-[8px] font-medium border border-white/10">
										{mood}
									</span>
								)}
							</div>
							{location && (
								<span className="text-[9px] text-white/80 truncate block">
									📍 {location}
								</span>
							)}
						</div>
					</div>

					{dropdownItems.length > 0 && (
						<Dropdown
							trigger={
								<button className="p-1 text-white/80 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/10">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
			</div>

			<div className="p-4 pt-3">
				{/* Actions Row */}
				<div className="flex items-center justify-between pb-3 mb-2.5 border-b border-border/20">
					<div className="flex items-center gap-6">
						{/* Favorite toggle button */}
						<div className="flex items-center gap-1.5">
							<button
								onClick={handleLikeToggle}
								className={`transition-transform active:scale-75 cursor-pointer p-0.5 rounded-full ${
									isLiked ? "text-amber-400" : "text-text-muted hover:text-text-primary"
								}`}
								title={isLiked ? "Remove from Favorites" : "Add to Favorites"}
							>
								<svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75">
									<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
								</svg>
							</button>
							<span className="text-[9px] text-text-muted select-none font-mono">
								{isLiked ? "Favorited" : "Favorite"}
							</span>
						</div>

						{/* Reflections & Notes */}
						<button
							onClick={() => setIsCommentsOpen(true)}
							className="text-text-muted hover:text-text-primary transition-colors cursor-pointer p-0.5"
							title="Self-notes & Reflections"
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
								<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
							</svg>
						</button>

						{/* Export */}
						<button className="text-text-muted hover:text-text-primary cursor-pointer p-0.5" title="Export Post">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
								<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
								<polyline points="16 6 12 2 8 6" />
								<line x1="12" y1="2" x2="12" y2="15" />
							</svg>
						</button>
					</div>

					<span className="text-[9px] text-text-muted font-mono uppercase tracking-wider">
						{formattedDate}
					</span>
				</div>

				{/* Caption Block */}
				{caption && (() => {
					const { content, isTruncated } = getTruncatedCaption(caption);
					return (
						<div className="text-xs text-text-primary leading-relaxed font-serif">
							<span className="font-bold mr-2 text-[10px] font-sans block mb-1">{username}</span>
							<div className="prose-p:inline font-serif text-text-secondary">
								{renderMarkdown(content)}
							</div>
							{isTruncated && (
								<button
									onClick={() => setIsExpanded(true)}
									className="text-text-muted hover:text-text-primary text-[10px] font-semibold focus:outline-none ml-1 cursor-pointer font-sans"
								>
									more
								</button>
							)}
						</div>
					);
				})()}
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
