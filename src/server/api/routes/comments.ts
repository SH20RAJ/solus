import { Hono } from "hono";
import { z } from "zod/v4";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { comment, user } from "@/lib/db/schema";
import { authMiddleware } from "@/server/api/middleware/auth";

const comments = new Hono()
	.use("/*", authMiddleware)
	// Get all comments for a post
	.get("/post/:postId", async (c) => {
		const db = getDb();
		const postId = c.req.param("postId");

		const results = await db
			.select({
				id: comment.id,
				postId: comment.postId,
				userId: comment.userId,
				content: comment.content,
				parentId: comment.parentId,
				createdAt: comment.createdAt,
				user: {
					name: user.name,
					image: user.image,
				},
			})
			.from(comment)
			.leftJoin(user, eq(comment.userId, user.id))
			.where(eq(comment.postId, postId))
			.orderBy(comment.createdAt);

		return c.json({ success: true, data: results });
	})
	// Post a comment (or reply)
	.post(
		"/post/:postId",
		zValidator(
			"json",
			z.object({
				content: z.string().min(1),
				parentId: z.string().optional(),
			})
		),
		async (c) => {
			const db = getDb();
			const userId = c.get("user").id;
			const postId = c.req.param("postId");
			const { content, parentId } = c.req.valid("json");
			const id = crypto.randomUUID();

			await db.insert(comment).values({
				id,
				postId,
				userId,
				content,
				parentId: parentId ?? null,
			});

			return c.json({ success: true, data: { id } }, 201);
		}
	)
	// Delete a comment
	.delete("/:id", async (c) => {
		const db = getDb();
		const userId = c.get("user").id;
		const commentId = c.req.param("id");

		const existing = await db
			.select()
			.from(comment)
			.where(eq(comment.id, commentId));

		if (!existing[0] || existing[0].userId !== userId) {
			return c.json({ success: false, error: "Not found" }, 404);
		}

		await db.delete(comment).where(eq(comment.id, commentId));

		return c.json({ success: true });
	});

export default comments;
