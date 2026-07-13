"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";
import { PostCardSkeleton } from "@/components/Skeleton";
import { usePost, usePosts } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";

interface Post {
	id: string;
	caption: string | null;
	mediaUrl: string | null;
	mediaType: string | null;
	location: string | null;
	mood: string | null;
	createdAt: string;
}

interface PostResponse {
	success: boolean;
	data: Post;
}

export default function PostDetailPageClient() {
	const params = useParams();
	const router = useRouter();
	const id = params?.id as string;
	const { data: session } = useSession();
	const { data, isLoading, error } = usePost(id);

	// Fetch all posts to perform metadata similarity matching for recommendation
	const { data: allPostsData } = usePosts();
	const allPosts = allPostsData?.data ?? [];

	const post = (data as PostResponse)?.data;

	const handleDelete = async (postId: string) => {
		if (confirm("Are you sure you want to delete this memory?")) {
			try {
				await fetch(`/api/posts/${postId}`, {
					method: "DELETE",
					credentials: "include",
				});
				router.replace("/home");
			} catch {
				// Silently fail
			}
		}
	};

	if (isLoading) {
		return (
			<div className="py-10 sm:py-16 max-w-[640px] mx-auto space-y-6 animate-pulse">
				<header className="mb-4">
					<div className="h-4 w-20 bg-border/50 rounded" />
				</header>
				<PostCardSkeleton />
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="py-10 sm:py-16 max-w-[640px] mx-auto select-none">
				<EmptyState
					message="This private post may have been deleted or does not exist."
					actionLabel="Back to Feed"
					actionHref="/home"
				/>
			</div>
		);
	}

	// Dynamic similarity recommendations scoring
	const otherPosts = allPosts.filter((p) => p.id !== post.id);
	const scoredPosts = otherPosts.map((p) => {
		let score = 0;
		// 1. Same location (highest match weight)
		if (p.location && post.location && p.location.toLowerCase() === post.location.toLowerCase()) {
			score += 3;
		}
		// 2. Same mood (medium match weight)
		if (p.mood && post.mood && p.mood.toLowerCase() === post.mood.toLowerCase()) {
			score += 2;
		}
		// 3. Temporal similarity (same week/month of year)
		const pDate = new Date(p.createdAt);
		const postDate = new Date(post.createdAt);
		if (pDate.getMonth() === postDate.getMonth()) {
			score += 1.5;
		}
		// 4. Hashtag overlap
		const pTags = p.caption?.match(/#[a-zA-Z0-9]+/g) || [];
		const postTags = post.caption?.match(/#[a-zA-Z0-9]+/g) || [];
		const intersection = pTags.filter((tag) => postTags.map(t => t.toLowerCase()).includes(tag.toLowerCase()));
		score += intersection.length * 1.0;

		return { post: p, score };
	});

	// Select top 3 relevant memories
	const relatedMemories = scoredPosts
		.filter((item) => item.score > 0)
		.sort((a, b) => b.score - a.score)
		.map((item) => item.post)
		.slice(0, 3);

	return (
		<div className="py-8 sm:py-12 w-full max-w-[640px] mx-auto animate-slide-up select-none font-sans">
			<header className="mb-8 flex items-center justify-between">
				<span className="text-xs uppercase tracking-[0.15em] font-mono text-text-muted">
					Memory Detail
				</span>
				<Link
					href="/home"
					className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200"
				>
					← Back Feed
				</Link>
			</header>

			<PostCard
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

			{/* Related memories panel */}
			{relatedMemories.length > 0 && (
				<section className="mt-12 pt-8 border-t border-border/20 text-left">
					<h2 className="text-xs uppercase tracking-[0.15em] font-mono text-text-muted mb-6">
						Related Memories
					</h2>
					<div className="space-y-6">
						{relatedMemories.map((m) => (
							<PostCard
								key={m.id}
								id={m.id}
								username={session?.user?.name ?? "You"}
								userImage={session?.user?.image}
								mediaUrl={m.mediaUrl}
								mediaType={m.mediaType}
								caption={m.caption}
								location={m.location}
								mood={m.mood}
								createdAt={m.createdAt}
								onDelete={handleDelete}
							/>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
