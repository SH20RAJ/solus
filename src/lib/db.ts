import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { cache } from "react";
import * as schema from "@/lib/db/schema";

// Prevent creating multiple clients in Cloudflare Workers
export const getDb = cache(() => {
	const sql = neon(process.env.DATABASE_URL!);
	return drizzle({ client: sql, schema });
});
