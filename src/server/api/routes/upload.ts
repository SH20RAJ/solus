import { Hono } from "hono";
import { z } from "zod/v4";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "@/server/api/middleware/auth";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

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
		const env = c.env as { STORAGE?: R2Bucket };
		if (env.STORAGE) {
			await env.STORAGE.put(key, body, {
				httpMetadata: { contentType },
			});
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
		const env = c.env as { STORAGE?: R2Bucket };

		if (!env.STORAGE) {
			return c.json({ success: false, error: "Storage not available" }, 503);
		}

		const object = await env.STORAGE.get(key);

		if (!object) {
			return c.json({ success: false, error: "Not found" }, 404);
		}

		const headers = new Headers();
		headers.set("Content-Type", object.httpMetadata?.contentType ?? "application/octet-stream");
		headers.set("Cache-Control", "public, max-age=31536000, immutable");

		return new Response(object.body, { headers });
	});

export default upload;
