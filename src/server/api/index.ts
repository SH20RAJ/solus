import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "@/lib/auth";
import posts from "@/server/api/routes/posts";
import stories from "@/server/api/routes/stories";
import journeys from "@/server/api/routes/journeys";
import upload from "@/server/api/routes/upload";
import comments from "@/server/api/routes/comments";

const app = new Hono().basePath("/api");

// CORS for cross-origin requests
app.use(
	"/*",
	cors({
		origin: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
		credentials: true,
	})
);

// Health check
app.get("/health", (c) => {
	return c.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

// Better Auth handler
app.on(["POST", "GET"], "/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

// Application routes
app.route("/posts", posts);
app.route("/stories", stories);
app.route("/journeys", journeys);
app.route("/upload", upload);
app.route("/comments", comments);

export type AppType = typeof app;
export default app;
