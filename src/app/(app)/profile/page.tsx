"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession, signOut } from "@/lib/auth-client";
import { usePosts, useJourneys } from "@/lib/api-client";
import Skeleton from "@/components/Skeleton";
import PostGrid from "@/components/PostGrid";
import PostCard from "@/components/PostCard";
import { mutate } from "swr";

interface Post {
	id: string;
	caption: string | null;
	mediaUrl: string | null;
	mediaType: string | null;
	location: string | null;
	mood: string | null;
	createdAt: string;
}

interface PostsResponse {
	success: boolean;
	data: Post[];
}

interface JourneysResponse {
	success: boolean;
	data: Array<{ id: string }>;
}

export default function ProfilePage() {
	const { data: session, isPending } = useSession();
	const { data: postsData } = usePosts();
	const { data: journeysData } = useJourneys();
	const [activeTab, setActiveTab] = useState<"grid" | "list">("grid");

	const posts = (postsData as PostsResponse)?.data ?? [];
	const postCount = posts.length;
	const journeyCount = ((journeysData as JourneysResponse)?.data ?? []).length;

	const handleSignOut = () => {
		signOut({ fetchOptions: { onSuccess: () => window.location.assign("/login") } });
	};

	const handleDelete = async (postId: string) => {
		if (confirm("Are you sure you want to delete this memory?")) {
			try {
				await fetch(`/api/posts/${postId}`, {
					method: "DELETE",
					credentials: "include",
				});
				mutate("/api/posts");
			} catch {
				// Silently fail
			}
		}
	};

	if (isPending) {
		return (
			<div className="py-10 sm:py-16 max-w-[640px] mx-auto space-y-6">
				<div className="flex items-center gap-4">
					<Skeleton className="w-16 h-16 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-4 w-48" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="py-10 sm:py-16 max-w-[640px] mx-auto animate-slide-up select-none">
			{/* Instagram-style Profile Header */}
			<div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-12">
				{session?.user?.image ? (
					<Image
						src={session.user.image}
						alt={session.user.name ?? "Profile"}
						width={88}
						height={88}
						className="rounded-full border-2 border-border/50 shadow-sm shrink-0"
					/>
				) : (
					<div className="w-22 h-22 rounded-full bg-surface border border-border flex items-center justify-center text-3xl font-semibold text-text-muted shrink-0">
						{session?.user?.name?.charAt(0).toUpperCase() ?? "?"}
					</div>
				)}

				<div className="flex-1 text-center sm:text-left space-y-4">
					<div className="flex flex-col sm:flex-row sm:items-center gap-4">
						<h1 className="text-xl font-bold tracking-tight text-text-primary">
							{session?.user?.name ?? "Your Profile"}
						</h1>
						<button
							onClick={handleSignOut}
							className="h-8 px-4 rounded-[8px] border border-border/40 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-card transition-all cursor-pointer"
						>
							Sign Out
						</button>
					</div>

					<p className="text-xs text-text-muted">{session?.user?.email}</p>

					{/* Stats row */}
					<div className="flex justify-center sm:justify-start gap-8 pt-2">
						<div className="text-sm">
							<span className="font-bold text-text-primary mr-1">{postCount}</span>
							<span className="text-text-muted">memories</span>
						</div>
						<div className="text-sm">
							<span className="font-bold text-text-primary mr-1">{journeyCount}</span>
							<span className="text-text-muted">journeys</span>
						</div>
					</div>
				</div>
			</div>

			{/* Tabs switch */}
			<div className="flex justify-center border-t border-border/20 mb-6">
				<button
					onClick={() => setActiveTab("grid")}
					className={`flex items-center gap-2 py-4 px-6 text-xs uppercase font-mono tracking-wider transition-colors cursor-pointer border-t -mt-[1px] ${
						activeTab === "grid"
							? "border-accent text-accent"
							: "border-transparent text-text-muted hover:text-text-primary"
					}`}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<rect x="3" y="3" width="7" height="7" />
						<rect x="14" y="3" width="7" height="7" />
						<rect x="14" y="14" width="7" height="7" />
						<rect x="3" y="14" width="7" height="7" />
					</svg>
					Grid
				</button>
				<button
					onClick={() => setActiveTab("list")}
					className={`flex items-center gap-2 py-4 px-6 text-xs uppercase font-mono tracking-wider transition-colors cursor-pointer border-t -mt-[1px] ${
						activeTab === "list"
							? "border-accent text-accent"
							: "border-transparent text-text-muted hover:text-text-primary"
					}`}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<line x1="8" y1="6" x2="21" y2="6" />
						<line x1="8" y1="12" x2="21" y2="12" />
						<line x1="8" y1="18" x2="21" y2="18" />
						<line x1="3" y1="6" x2="3.01" y2="6" />
						<line x1="3" y1="12" x2="3.01" y2="12" />
						<line x1="3" y1="18" x2="3.01" y2="18" />
					</svg>
					Feed
				</button>
			</div>

			{/* Views content */}
			<div>
				{activeTab === "grid" ? (
					<PostGrid posts={posts} />
				) : (
					<div className="space-y-6">
						{posts.map((post) => (
							<PostCard
								key={post.id}
								id={post.id}
								username={session?.user?.name ?? "You"}
								userImage={session?.user?.image}
								mediaUrl={post.mediaUrl}
								mediaType={post.mediaType}
								caption={post.caption}
								location={post.location}
								mood={post.mood}
								createdAt={post.createdAt}
								onDelete={handleDelete}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
