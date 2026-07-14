import { Hono } from "hono";
import { z } from "zod/v4";
import { zValidator } from "@hono/zod-validator";
import { eq, desc, and, ilike } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { post } from "@/lib/db/schema";
import { authMiddleware } from "@/server/api/middleware/auth";

const posts = new Hono()
	.use("/*", authMiddleware)
	.get("/", async (c) => {
		const db = getDb();
		const userId = c.get("user").id;
		const limit = parseInt(c.req.query("limit") || "6");
		const offset = parseInt(c.req.query("offset") || "0");
		const tag = c.req.query("tag");
		const loc = c.req.query("location");

		const conditions = [eq(post.userId, userId)];

		if (tag) {
			conditions.push(ilike(post.caption, `%#${tag.toLowerCase()}%`));
		}

		if (loc) {
			conditions.push(ilike(post.location, loc));
		}

		const results = await db
			.select()
			.from(post)
			.where(and(...conditions))
			.orderBy(desc(post.createdAt))
			.limit(limit + 1)
			.offset(offset);

		const hasMore = results.length > limit;
		const paginated = hasMore ? results.slice(0, limit) : results;

		return c.json({ success: true, data: paginated, hasMore });
	})
	.get("/:id", async (c) => {
		const db = getDb();
		const userId = c.get("user").id;
		const postId = c.req.param("id");

		const results = await db
			.select()
			.from(post)
			.where(eq(post.id, postId));

		const found = results[0];

		if (!found || found.userId !== userId) {
			return c.json({ success: false, error: "Not found" }, 404);
		}

		return c.json({ success: true, data: found });
	})
	.post(
		"/",
		zValidator(
			"json",
			z.object({
				caption: z.string().optional(),
				mediaUrl: z.string().optional(),
				mediaType: z.enum(["image", "video", "audio"]).optional(),
				location: z.string().optional(),
				mood: z.string().optional(),
			})
		),
		async (c) => {
			const db = getDb();
			const userId = c.get("user").id;
			const body = c.req.valid("json");
			const id = crypto.randomUUID();

			await db.insert(post).values({
				id,
				userId,
				caption: body.caption ?? null,
				mediaUrl: body.mediaUrl ?? null,
				mediaType: body.mediaType ?? null,
				location: body.location ?? null,
				mood: body.mood ?? null,
			});

			return c.json({ success: true, data: { id } }, 201);
		}
	)
	.patch(
		"/:id",
		zValidator(
			"json",
			z.object({
				caption: z.string().optional(),
				mediaUrl: z.string().optional(),
				mediaType: z.enum(["image", "video", "audio"]).optional(),
				location: z.string().optional(),
				mood: z.string().optional(),
				isPublic: z.boolean().optional(),
			})
		),
		async (c) => {
			const db = getDb();
			const userId = c.get("user").id;
			const postId = c.req.param("id");
			const body = c.req.valid("json");

			const existing = await db
				.select()
				.from(post)
				.where(eq(post.id, postId));

			if (!existing[0] || existing[0].userId !== userId) {
				return c.json({ success: false, error: "Not found" }, 404);
			}

			await db
				.update(post)
				.set({ ...body, updatedAt: new Date() })
				.where(eq(post.id, postId));

			return c.json({ success: true, data: { id: postId } });
		}
	)
	.delete("/:id", async (c) => {
		const db = getDb();
		const userId = c.get("user").id;
		const postId = c.req.param("id");

		const existing = await db
			.select()
			.from(post)
			.where(eq(post.id, postId));

		if (!existing[0] || existing[0].userId !== userId) {
			return c.json({ success: false, error: "Not found" }, 404);
		}

		await db.delete(post).where(eq(post.id, postId));

		return c.json({ success: true });
	});

export default posts;
