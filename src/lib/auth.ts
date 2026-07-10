import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@/lib/db";

export const auth = betterAuth({
	database: drizzleAdapter(getDb(), {
		provider: "pg",
	}),
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
		// apple: {
		// 	clientId: process.env.APPLE_CLIENT_ID!,
		// 	clientSecret: process.env.APPLE_CLIENT_SECRET!,
		// },
	},
});
