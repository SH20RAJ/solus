import { Hono } from "hono";
import { z } from "zod/v4";
import { zValidator } from "@hono/zod-validator";
import { eq, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { journey, journeyPost, post } from "@/lib/db/schema";
import { authMiddleware } from "@/server/api/middleware/auth";

const journeys = new Hono()
	.use("/*", authMiddleware)
	.get("/", async (c) => {
		const db = getDb();
		const userId = c.get("user").id;

		const results = await db
			.select()
			.from(journey)
			.where(eq(journey.userId, userId))
			.orderBy(desc(journey.createdAt));

		return c.json({ success: true, data: results });
	})
	.get("/:id", async (c) => {
		const db = getDb();
		const userId = c.get("user").id;
		const journeyId = c.req.param("id");

		const results = await db
			.select()
			.from(journey)
			.where(eq(journey.id, journeyId));

		const found = results[0];

		if (!found || found.userId !== userId) {
			return c.json({ success: false, error: "Not found" }, 404);
		}

		// Fetch associated posts
		const posts = await db
			.select({ post })
			.from(journeyPost)
			.innerJoin(post, eq(journeyPost.postId, post.id))
			.where(eq(journeyPost.journeyId, journeyId))
			.orderBy(journeyPost.order);

		return c.json({
			success: true,
			data: { ...found, posts: posts.map((p) => p.post) },
		});
	})
	.post(
		"/",
		zValidator(
			"json",
			z.object({
				title: z.string().min(1).max(200),
				description: z.string().optional(),
				coverUrl: z.string().optional(),
			})
		),
		async (c) => {
			const db = getDb();
			const userId = c.get("user").id;
			const body = c.req.valid("json");
			const id = crypto.randomUUID();

			await db.insert(journey).values({
				id,
				userId,
				title: body.title,
				description: body.description ?? null,
				coverUrl: body.coverUrl ?? null,
			});

			return c.json({ success: true, data: { id } }, 201);
		}
	)
	.patch(
		"/:id",
		zValidator(
			"json",
			z.object({
				title: z.string().min(1).max(200).optional(),
				description: z.string().optional(),
				coverUrl: z.string().optional(),
				isPublic: z.boolean().optional(),
				publishAt: z.string().datetime().optional(),
			})
		),
		async (c) => {
			const db = getDb();
			const userId = c.get("user").id;
			const journeyId = c.req.param("id");
			const body = c.req.valid("json");

			const existing = await db
				.select()
				.from(journey)
				.where(eq(journey.id, journeyId));

			if (!existing[0] || existing[0].userId !== userId) {
				return c.json({ success: false, error: "Not found" }, 404);
			}

			const updateData: Record<string, unknown> = {
				...body,
				updatedAt: new Date(),
			};

			if (body.publishAt) {
				updateData.publishAt = new Date(body.publishAt);
			}

			await db
				.update(journey)
				.set(updateData)
				.where(eq(journey.id, journeyId));

			return c.json({ success: true, data: { id: journeyId } });
		}
	)
	.post(
		"/:id/posts",
		zValidator(
			"json",
			z.object({
				postId: z.string(),
				order: z.number().int().min(0).optional(),
			})
		),
		async (c) => {
			const db = getDb();
			const userId = c.get("user").id;
			const journeyId = c.req.param("id");
			const body = c.req.valid("json");

			// Verify journey ownership
			const existingJourney = await db
				.select()
				.from(journey)
				.where(eq(journey.id, journeyId));

			if (!existingJourney[0] || existingJourney[0].userId !== userId) {
				return c.json({ success: false, error: "Journey not found" }, 404);
			}

			// Verify post ownership
			const existingPost = await db
				.select()
				.from(post)
				.where(eq(post.id, body.postId));

			if (!existingPost[0] || existingPost[0].userId !== userId) {
				return c.json({ success: false, error: "Post not found" }, 404);
			}

			const id = crypto.randomUUID();
			await db.insert(journeyPost).values({
				id,
				journeyId,
				postId: body.postId,
				order: body.order ?? 0,
			});

			return c.json({ success: true }, 201);
		}
	)
	.delete("/:id", async (c) => {
		const db = getDb();
		const userId = c.get("user").id;
		const journeyId = c.req.param("id");

		const existing = await db
			.select()
			.from(journey)
			.where(eq(journey.id, journeyId));

		if (!existing[0] || existing[0].userId !== userId) {
			return c.json({ success: false, error: "Not found" }, 404);
		}

		await db.delete(journey).where(eq(journey.id, journeyId));

		return c.json({ success: true });
	});

export default journeys;
