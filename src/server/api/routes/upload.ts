import { Hono } from "hono";
import { z } from "zod/v4";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "@/server/api/middleware/auth";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Memory storage fallback for local development when R2 is not active
const memoryStorage = new Map<string, { body: ArrayBuffer; contentType: string }>();

const upload = new Hono()
	.use("/*", authMiddleware)
	.post(
		"/presign",
		zValidator(
			"json",
			z.object({
				filename: z.string().min(1),
				contentType: z.string().min(1),
				size: z.number().int().max(MAX_FILE_SIZE),
			})
		),
		async (c) => {
			const userId = c.get("user").id;
			const { filename, contentType } = c.req.valid("json");

			const ext = filename.split(".").pop() ?? "bin";
			const key = `${userId}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

			// Return the key — client uploads via a separate PUT route
			const uploadUrl = `/api/upload/${encodeURIComponent(key)}`;

			return c.json({
				success: true,
				data: { key, uploadUrl, contentType },
			});
		}
	)
	.put("/:key{.+}", async (c) => {
		const key = c.req.param("key");
		const userId = c.get("user").id;

		// Verify the key belongs to this user
		if (!key.startsWith(userId + "/")) {
			return c.json({ success: false, error: "Forbidden" }, 403);
		}

		const body = await c.req.arrayBuffer();
		const contentType = c.req.header("content-type") ?? "application/octet-stream";

		// Use R2 binding if available (Cloudflare Workers)
		const env = c.env as { STORAGE?: R2Bucket } | undefined;
		if (env && env.STORAGE) {
			await env.STORAGE.put(key, body, {
				httpMetadata: { contentType },
			});
		} else {
			// Fallback to local memory storage
			memoryStorage.set(key, { body, contentType });
		}

		return c.json({
			success: true,
			data: {
				key,
				url: `/api/upload/${encodeURIComponent(key)}`,
			},
		});
	})
	.get("/:key{.+}", async (c) => {
		const key = c.req.param("key");
		const env = c.env as { STORAGE?: R2Bucket } | undefined;

		// 1. Try from R2 if binding is available
		if (env && env.STORAGE) {
			const object = await env.STORAGE.get(key);
			if (object) {
				const headers = new Headers();
				headers.set("Content-Type", object.httpMetadata?.contentType ?? "application/octet-stream");
				headers.set("Cache-Control", "public, max-age=31536000, immutable");
				return new Response(object.body, { headers });
			}
		}

		// 2. Try from in-memory fallback
		const localObj = memoryStorage.get(key);
		if (localObj) {
			const headers = new Headers();
			headers.set("Content-Type", localObj.contentType);
			headers.set("Cache-Control", "public, max-age=31536000, immutable");
			return new Response(localObj.body, { headers });
		}

		return c.json({ success: false, error: "Not found" }, 404);
	});

export default upload;
