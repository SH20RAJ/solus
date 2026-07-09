import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@/lib/db";

export const auth = betterAuth({
	database: drizzleAdapter(getDb(), {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
	},
});
