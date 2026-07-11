"use client";

import type { AppType } from "@/server/api";
import { hc } from "hono/client";
import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";
import useSWRMutation from "swr/mutation";

// Type-safe Hono RPC client
const client = hc<AppType>("/");

export { client };

// Generic fetcher for SWR
async function fetcher<T>(url: string): Promise<T> {
	const res = await fetch(url, { credentials: "include" });

	if (!res.ok) {
		const error = await res.json().catch(() => ({ error: "Request failed" }));
		throw new Error((error as { error?: string }).error ?? "Request failed");
	}

	return res.json() as Promise<T>;
}

// API Response Interfaces
export interface Post {
	id: string;
	userId: string;
	caption: string | null;
	mediaUrl: string | null;
	mediaType: "image" | "video" | "audio" | null;
	location: string | null;
	mood: string | null;
	isPublic: boolean;
	publishAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface PostsResponse {
	success: boolean;
	data: Post[];
	hasMore?: boolean;
}

export interface PostResponse {
	success: boolean;
	data: Post;
}

export interface Story {
	id: string;
	userId: string;
	mediaUrl: string;
	mediaType: "image" | "video" | "audio";
	caption: string | null;
	expiresAt: string;
	createdAt: string;
}

export interface StoriesResponse {
	success: boolean;
	data: Story[];
}

export interface Collection {
	id: string;
	userId: string;
	title: string;
	description: string | null;
	coverUrl: string | null;
	isPublic: boolean;
	publishAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CollectionsResponse {
	success: boolean;
	data: Collection[];
}

export interface CollectionDetailResponse {
	success: boolean;
	data: Collection & {
		posts: Post[];
	};
}

export interface Comment {
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

export interface CommentsResponse {
	success: boolean;
	data: Comment[];
}

export interface LikesResponse {
	success: boolean;
	data: {
		liked: boolean;
		count: number;
	};
}

// Typed SWR hooks for Solus API

/** Fetch user's posts */
export function usePosts(config?: SWRConfiguration<PostsResponse>): SWRResponse<PostsResponse, any> {
	return useSWR<PostsResponse>("/api/posts", fetcher, config);
}

/** Fetch a single post */
export function usePost(id: string | null, config?: SWRConfiguration<PostResponse>): SWRResponse<PostResponse, any> {
	return useSWR<PostResponse>(id ? `/api/posts/${id}` : null, fetcher, config);
}

/** Fetch user's stories */
export function useStories(config?: SWRConfiguration<StoriesResponse>): SWRResponse<StoriesResponse, any> {
	return useSWR<StoriesResponse>("/api/stories", fetcher, config);
}

/** Fetch user's collections */
export function useCollections(config?: SWRConfiguration<CollectionsResponse>): SWRResponse<CollectionsResponse, any> {
	return useSWR<CollectionsResponse>("/api/collections", fetcher, config);
}

/** Fetch a single collection with its posts */
export function useCollection(id: string | null, config?: SWRConfiguration<CollectionDetailResponse>): SWRResponse<CollectionDetailResponse, any> {
	return useSWR<CollectionDetailResponse>(id ? `/api/collections/${id}` : null, fetcher, config);
}

/** Mutation helper for POST/PATCH/DELETE */
export function useApiMutation<T>(
	url: string,
	method: "POST" | "PATCH" | "DELETE" = "POST"
) {
	return useSWRMutation(
		url,
		async (_key: string, { arg }: { arg?: unknown }) => {
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: arg ? JSON.stringify(arg) : undefined,
			});

			if (!res.ok) {
				const error = await res
					.json()
					.catch(() => ({ error: "Request failed" }));
				throw new Error(
					(error as { error?: string }).error ?? "Request failed"
				);
			}

			return res.json() as Promise<T>;
		}
	);
}

/** Fetch comments for a post */
export function useComments(postId: string | null, config?: SWRConfiguration<CommentsResponse>): SWRResponse<CommentsResponse, any> {
	return useSWR<CommentsResponse>(postId ? `/api/comments/post/${postId}` : null, fetcher, config);
}

/** Fetch likes count and user liked status for a post */
export function useLikes(postId: string | null, config?: SWRConfiguration<LikesResponse>): SWRResponse<LikesResponse, any> {
	return useSWR<LikesResponse>(postId ? `/api/likes/post/${postId}` : null, fetcher, config);
}



