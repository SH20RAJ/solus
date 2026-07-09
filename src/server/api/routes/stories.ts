import { Hono } from "hono";
import { z } from "zod/v4";
import { zValidator } from "@hono/zod-validator";
import { eq, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { story } from "@/lib/db/schema";
import { authMiddleware } from "@/server/api/middleware/auth";

const STORY_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

const stories = new Hono()
	.use("/*", authMiddleware)
	.get("/", async (c) => {
		const db = getDb();
		const userId = c.get("user").id;

		const results = await db
			.select()
			.from(story)
			.where(eq(story.userId, userId))
			.orderBy(desc(story.createdAt));

		return c.json({ success: true, data: results });
	})
	.post(
		"/",
		zValidator(
			"json",
			z.object({
				mediaUrl: z.string(),
				mediaType: z.enum(["image", "video"]),
				caption: z.string().optional(),
			})
		),
		async (c) => {
			const db = getDb();
			const userId = c.get("user").id;
			const body = c.req.valid("json");
			const id = crypto.randomUUID();

			await db.insert(story).values({
				id,
				userId,
				mediaUrl: body.mediaUrl,
				mediaType: body.mediaType,
				caption: body.caption ?? null,
				expiresAt: new Date(Date.now() + STORY_DURATION_MS),
			});

			return c.json({ success: true, data: { id } }, 201);
		}
	)
	.delete("/:id", async (c) => {
		const db = getDb();
		const userId = c.get("user").id;
		const storyId = c.req.param("id");

		const existing = await db
			.select()
			.from(story)
			.where(eq(story.id, storyId));

		if (!existing[0] || existing[0].userId !== userId) {
			return c.json({ success: false, error: "Not found" }, 404);
		}

		await db.delete(story).where(eq(story.id, storyId));

		return c.json({ success: true });
	});

export default stories;
