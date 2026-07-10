import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

const DATABASE_URL =
	process.env.DATABASE_URL ||
	"postgresql://neondb_owner:npg_OkHz8e6Dldgn@ep-broad-dream-aokhdt5q-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function main() {
	console.log("🌱 Seeding database...");
	const sql = neon(DATABASE_URL);
	const db = drizzle({ client: sql, schema });

	// 1. Get first user or create a demo user
	let dbUser = await db.query.user.findFirst();

	if (!dbUser) {
		console.log("No user found. Creating a demo user...");
		const demoUserId = crypto.randomUUID();
		await db.insert(schema.user).values({
			id: demoUserId,
			name: "Shaswat Raj",
			email: "sh20raj@gmail.com",
			image: "https://lh3.googleusercontent.com/a/ACg8ocL...",
		});
		dbUser = await db.query.user.findFirst();
	}

	if (!dbUser) {
		throw new Error("Failed to create or retrieve seed user.");
	}

	const userId = dbUser.id;
	console.log(`Seeding data for user: ${dbUser.name} (${userId})`);

	// 2. Clear old application data for clean demonstration
	await db.delete(schema.journeyPost);
	await db.delete(schema.journey).where(eq(schema.journey.userId, userId));
	await db.delete(schema.story).where(eq(schema.story.userId, userId));
	await db.delete(schema.comment);
	await db.delete(schema.post).where(eq(schema.post.userId, userId));

	// 3. Create Posts
	console.log("Creating mock posts...");
	const post1Id = crypto.randomUUID();
	const post2Id = crypto.randomUUID();
	const post3Id = crypto.randomUUID();
	const post4Id = crypto.randomUUID();
	const post5Id = crypto.randomUUID();

	// Post 1: Tweet-style text post
	await db.insert(schema.post).values({
		id: post1Id,
		userId,
		caption: "Leave everyone. Don't leave yourself. The quiet moments are where we rediscover who we are when nobody is watching. Solus is becoming my digital sanctuary.",
		mediaUrl: null,
		mediaType: null,
		location: "Home Studio",
		mood: "Reflective",
	});

	// Post 2: Image post (Scenic)
	await db.insert(schema.post).values({
		id: post2Id,
		userId,
		caption: "Sunset at the edge of the world. No audience, no validation needed. Just the waves and the wind.",
		mediaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
		mediaType: "image",
		location: "Bali, Indonesia",
		mood: "Peaceful",
	});

	// Post 3: Video post (Vlog)
	await db.insert(schema.post).values({
		id: post3Id,
		userId,
		caption: "Escaping into the wild. Let your mind wander.",
		mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
		mediaType: "video",
		location: "Yosemite National Park",
		mood: "Excited",
	});

	// Post 4: Voice Note (Audio)
	await db.insert(schema.post).values({
		id: post4Id,
		userId,
		caption: "Midnight self-talk. Recorded a quick voice note about the importance of digital detox and taking time off social media.",
		mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
		mediaType: "audio",
		location: "My Room",
		mood: "Calm",
	});

	// Post 5: Image Carousel (multiple comma-separated URLs)
	await db.insert(schema.post).values({
		id: post5Id,
		userId,
		caption: "A three-part gallery: Forest pathways, sunrays filtering through green leaves, and the deep woods.",
		mediaUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop,https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop,https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop",
		mediaType: "image",
		location: "Black Forest, Germany",
		mood: "Grateful",
	});

	// 4. Create Stories (valid for 24H)
	console.log("Creating active stories...");
	const storyDuration = 24 * 60 * 60 * 1000;
	await db.insert(schema.story).values({
		id: crypto.randomUUID(),
		userId,
		mediaUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop",
		mediaType: "image",
		caption: "Morning sunlight!",
		expiresAt: new Date(Date.now() + storyDuration),
	});

	await db.insert(schema.story).values({
		id: crypto.randomUUID(),
		userId,
		mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
		mediaType: "video",
		caption: "Warm fireside.",
		expiresAt: new Date(Date.now() + storyDuration),
	});

	// 5. Create Collections (Albums)
	console.log("Creating collections...");
	const collection1Id = crypto.randomUUID();
	const collection2Id = crypto.randomUUID();

	await db.insert(schema.journey).values({
		id: collection1Id,
		userId,
		title: "Himalayan Solo Trip",
		description: "Three weeks documenting silence, high altitudes, and clear nights.",
		coverUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop",
	});

	await db.insert(schema.journey).values({
		id: collection2Id,
		userId,
		title: "Late Night Self-Talks",
		description: "Private voice logs, vlogs, and texts about life.",
		coverUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=800&auto=format&fit=crop",
	});

	// Link posts to collections
	await db.insert(schema.journeyPost).values({
		id: crypto.randomUUID(),
		journeyId: collection1Id,
		postId: post2Id,
		order: 1,
	});

	await db.insert(schema.journeyPost).values({
		id: crypto.randomUUID(),
		journeyId: collection1Id,
		postId: post3Id,
		order: 2,
	});

	await db.insert(schema.journeyPost).values({
		id: crypto.randomUUID(),
		journeyId: collection2Id,
		postId: post4Id,
		order: 1,
	});

	// 6. Add some mock comments
	console.log("Adding mock comments...");
	const comment1Id = crypto.randomUUID();
	await db.insert(schema.comment).values({
		id: comment1Id,
		postId: post2Id,
		userId,
		content: "Looking back at this, I remember how cold it was right after the sunset. Absolutely worth it.",
		parentId: null,
	});

	await db.insert(schema.comment).values({
		id: crypto.randomUUID(),
		postId: post2Id,
		userId,
		content: "True, the colors were changing so fast!",
		parentId: comment1Id,
	});

	console.log("✅ Seeding completed successfully!");
}

main().catch((err) => {
	console.error("❌ Seeding failed:", err);
	process.exit(1);
});
