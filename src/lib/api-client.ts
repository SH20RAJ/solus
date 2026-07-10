"use client";

import type { AppType } from "@/server/api";
import { hc } from "hono/client";
import useSWR, { type SWRConfiguration } from "swr";
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

// Typed SWR hooks for Solus API

/** Fetch user's posts */
export function usePosts(config?: SWRConfiguration) {
	return useSWR("/api/posts", fetcher, config);
}

/** Fetch a single post */
export function usePost(id: string | null, config?: SWRConfiguration) {
	return useSWR(id ? `/api/posts/${id}` : null, fetcher, config);
}

/** Fetch user's stories */
export function useStories(config?: SWRConfiguration) {
	return useSWR("/api/stories", fetcher, config);
}

/** Fetch user's journeys */
export function useJourneys(config?: SWRConfiguration) {
	return useSWR("/api/journeys", fetcher, config);
}

/** Fetch a single journey with its posts */
export function useJourney(id: string | null, config?: SWRConfiguration) {
	return useSWR(id ? `/api/journeys/${id}` : null, fetcher, config);
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
export function useComments(postId: string | null, config?: SWRConfiguration) {
	return useSWR(postId ? `/api/comments/post/${postId}` : null, fetcher, config);
}

