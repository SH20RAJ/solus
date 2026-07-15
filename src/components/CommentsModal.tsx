"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { useComments } from "@/lib/api-client";
import { mutate } from "swr";
import Modal from "@/components/ui/Modal";
import Skeleton from "@/components/Skeleton";

interface Comment {
	id: string;
	postId: string;
	userId: string;
	content: string;
	parentId: string | null;
	createdAt: string;
	user: {
		name: string;
		image: string | null;
	} | null;
}

interface CommentsResponse {
	success: boolean;
	data: Comment[];
}

interface CommentsModalProps {
	isOpen: boolean;
	onClose: () => void;
	postId: string;
}

export default function CommentsModal({ isOpen, onClose, postId }: CommentsModalProps) {
	const { data: session } = useSession();
	const { data: commentsData, isLoading } = useComments(postId);
	const comments = (commentsData as CommentsResponse)?.data ?? [];

	const [newComment, setNewComment] = useState("");
	const [replyTo, setReplyTo] = useState<Comment | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Group comments by parentId
	const rootComments = comments.filter((c) => !c.parentId);
	const repliesMap = comments.reduce((acc, c) => {
		if (c.parentId) {
			if (!acc[c.parentId]) acc[c.parentId] = [];
			acc[c.parentId].push(c);
		}
		return acc;
	}, {} as Record<string, Comment[]>);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim() || isSubmitting) return;

		const currentComments = commentsData as CommentsResponse ?? { success: true, data: [] };
		const mockComment: Comment = {
			id: `temp-${Date.now()}`,
			postId,
			userId: session?.user?.id ?? "temp-user",
			content: newComment,
			parentId: replyTo?.id ?? null,
			createdAt: new Date().toISOString(),
			user: {
				name: session?.user?.name ?? "You",
				image: session?.user?.image ?? null,
			}
		};

		const optimisticData: CommentsResponse = {
			success: true,
			data: [...currentComments.data, mockComment]
		};

		const savedComment = newComment;
		const savedReplyTo = replyTo;

		setNewComment("");
		setReplyTo(null);
		setIsSubmitting(true);

		try {
			mutate(`/api/comments/post/${postId}`, optimisticData, false);

			const res = await fetch(`/api/comments/post/${postId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					content: savedComment,
					parentId: savedReplyTo?.id ?? undefined,
				}),
			});
			if (!res.ok) throw new Error("Comment post failed");

			mutate(`/api/comments/post/${postId}`);
		} catch {
			setNewComment(savedComment);
			setReplyTo(savedReplyTo);
			mutate(`/api/comments/post/${postId}`, currentComments, false);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async (commentId: string) => {
		if (!confirm("Are you sure you want to delete this comment?")) return;

		const currentComments = commentsData as CommentsResponse ?? { success: true, data: [] };
		const optimisticData: CommentsResponse = {
			success: true,
			data: currentComments.data.filter((c) => c.id !== commentId)
		};

		try {
			mutate(`/api/comments/post/${postId}`, optimisticData, false);

			const res = await fetch(`/api/comments/${commentId}`, {
				method: "DELETE",
				credentials: "include",
			});
			if (!res.ok) throw new Error("Comment delete failed");

			mutate(`/api/comments/post/${postId}`);
		} catch {
			mutate(`/api/comments/post/${postId}`, currentComments, false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-[500px] h-[80vh] flex flex-col">
			{/* Header */}
			<div className="px-6 py-4 border-b border-border/20 flex items-center justify-between shrink-0">
				<h2 className="text-sm font-bold tracking-tight text-text-primary uppercase font-mono">
					Comments
				</h2>
			</div>

			{/* Comments List Area */}
			<div className="flex-1 overflow-y-auto p-6 space-y-6">
				{isLoading ? (
					<div className="space-y-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="flex gap-3">
								<Skeleton className="w-8 h-8 rounded-full shrink-0" />
								<div className="space-y-1.5 flex-1">
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-3 w-3/4" />
								</div>
							</div>
						))}
					</div>
				) : rootComments.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-center text-text-muted">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2.5">
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
						</svg>
						<p className="text-xs">No comments yet. Write down your private feedback.</p>
					</div>
				) : (
					rootComments.map((comment) => (
						<div key={comment.id} className="space-y-4">
							{/* Root Comment Row */}
							<div className="flex gap-3 items-start group">
								{comment.user?.image ? (
									<Image
										src={comment.user.image}
										alt={comment.user.name}
										width={32}
										height={32}
										className="rounded-full border border-border/30 shrink-0"
									/>
								) : (
									<div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-semibold text-text-muted shrink-0">
										{comment.user?.name?.charAt(0).toUpperCase() ?? "U"}
									</div>
								)}

								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<span className="text-xs font-bold text-text-primary">
											{comment.user?.name ?? "User"}
										</span>
										<span className="text-[10px] text-text-muted">
											{new Date(comment.createdAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
											})}
										</span>
									</div>
									<p className="text-sm text-text-secondary mt-1 leading-relaxed">
										{comment.content}
									</p>

									{/* Action triggers */}
									<div className="flex items-center gap-4 mt-2">
										<button
											onClick={() => setReplyTo(comment)}
											className="text-[10px] font-semibold text-text-muted hover:text-accent transition-colors cursor-pointer"
										>
											Reply
										</button>
										{session?.user && session.user.id === comment.userId && (
											<button
												onClick={() => handleDelete(comment.id)}
												className="text-[10px] font-semibold text-danger/80 hover:text-danger transition-colors cursor-pointer"
											>
												Delete
											</button>
										)}
									</div>
								</div>
							</div>

							{/* Nested Replies */}
							{repliesMap[comment.id]?.map((reply) => (
								<div key={reply.id} className="pl-8 border-l border-border/40 ml-4 space-y-4">
									<div className="flex gap-3 items-start group">
										{reply.user?.image ? (
											<Image
												src={reply.user.image}
												alt={reply.user.name}
												width={24}
												height={24}
												className="rounded-full border border-border/30 shrink-0"
											/>
										) : (
											<div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-[10px] font-semibold text-text-muted shrink-0">
												{reply.user?.name?.charAt(0).toUpperCase() ?? "U"}
											</div>
										)}

										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<span className="text-xs font-bold text-text-primary">
													{reply.user?.name ?? "User"}
												</span>
												<span className="text-[10px] text-text-muted">
													{new Date(reply.createdAt).toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
													})}
												</span>
											</div>
											<p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
												{reply.content}
											</p>

											<div className="flex items-center gap-4 mt-2">
												{session?.user && session.user.id === reply.userId && (
													<button
														onClick={() => handleDelete(reply.id)}
														className="text-[10px] font-semibold text-danger/80 hover:text-danger transition-colors cursor-pointer"
													>
														Delete
													</button>
												)}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					))
				)}
			</div>

			{/* Form inputs at bottom */}
			<div className="p-4 border-t border-border/20 bg-card/10 shrink-0">
				{replyTo && (
					<div className="flex items-center justify-between px-2 py-1 mb-2 bg-accent/5 rounded-lg border border-accent/25 text-[10px] text-accent">
						<span>Replying to @{replyTo.user?.name}</span>
						<button onClick={() => setReplyTo(null)} className="font-bold cursor-pointer hover:text-text-primary">
							✕
						</button>
					</div>
				)}

				<form onSubmit={handleSubmit} className="flex gap-2">
					<input
						type="text"
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						placeholder="Write a private comment..."
						className="flex-1 h-9 px-4 rounded-xl border border-border/40 bg-card text-xs focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent"
					/>
					<button
						type="submit"
						disabled={!newComment.trim() || isSubmitting}
						className="h-9 px-4 rounded-xl bg-text-primary text-background text-xs font-bold transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
					>
						Send
					</button>
				</form>
			</div>
		</Modal>
	);
}
