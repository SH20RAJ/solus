import { createMiddleware } from "hono/factory";
import { auth } from "@/lib/auth";

type AuthEnv = {
	Variables: {
		user: {
			id: string;
			name: string;
			email: string;
		};
	};
};

/** Verify Better Auth session and attach user to Hono context */
export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session?.user) {
		return c.json({ success: false, error: "Unauthorized" }, 401);
	}

	c.set("user", {
		id: session.user.id,
		name: session.user.name,
		email: session.user.email,
	});

	await next();
});
