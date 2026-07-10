import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { postLike } from "@/lib/db/schema";
import { authMiddleware } from "@/server/api/middleware/auth";

const likes = new Hono()
	.use("/*", authMiddleware)
	// Get like status and count for a post
	.get("/post/:postId", async (c) => {
		const db = getDb();
		const userId = c.get("user").id;
		const postId = c.req.param("postId");

		const allLikes = await db
			.select()
			.from(postLike)
			.where(eq(postLike.postId, postId));

		const liked = allLikes.some((like) => like.userId === userId);

		return c.json({
			success: true,
			data: {
				liked,
				count: allLikes.length,
			},
		});
	})
	// Toggle like status for a post
	.post("/post/:postId", async (c) => {
		const db = getDb();
		const userId = c.get("user").id;
		const postId = c.req.param("postId");

		const existing = await db
			.select()
			.from(postLike)
			.where(
				and(
					eq(postLike.postId, postId),
					eq(postLike.userId, userId)
				)
			);

		if (existing.length > 0) {
			// Unlike
			await db
				.delete(postLike)
				.where(
					and(
						eq(postLike.postId, postId),
						eq(postLike.userId, userId)
					)
				);
			return c.json({ success: true, liked: false });
		} else {
			// Like
			const id = crypto.randomUUID();
			await db.insert(postLike).values({
				id,
				postId,
				userId,
			});
			return c.json({ success: true, liked: true });
		}
	});

export default likes;
