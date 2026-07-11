import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

const DATABASE_URL =
	process.env.DATABASE_URL ||
	"postgresql://neondb_owner:npg_OkHz8e6Dldgn@ep-broad-dream-aokhdt5q-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function main() {
	console.log("🌱 Seeding database with 42 posts and 20+ collections...");
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

	// 2. Clear old application data
	await db.delete(schema.journeyPost);
	await db.delete(schema.journey).where(eq(schema.journey.userId, userId));
	await db.delete(schema.story).where(eq(schema.story.userId, userId));
	await db.delete(schema.comment);
	await db.delete(schema.post).where(eq(schema.post.userId, userId));

	// 3. Define 42 Posts
	const postsData = [
		{
			caption: "Leave everyone. Don't leave yourself. The quiet moments are where we rediscover who we are when nobody is watching. Solus is becoming my digital sanctuary. #detox #peaceful #mindful",
			mediaUrl: null,
			mediaType: null,
			location: "Home Studio",
			mood: "Reflective",
			offsetDays: 0
		},
		{
			caption: "Quiet mornings in Japan. Walking through the bamboo groves before the world wakes up. #travel #nature #morning",
			mediaUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Kyoto, Japan",
			mood: "Peaceful",
			offsetDays: 1
		},
		{
			caption: "Escaping into the wild. Let your mind wander and align with the frequency of the trees. #nature #wilderness #growth",
			mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
			mediaType: "video",
			location: "Yosemite Park",
			mood: "Inspired",
			offsetDays: 2
		},
		{
			caption: "Midnight self-talk. Recorded a quick voice note about the importance of digital detox and taking time off social media. #detox #growth",
			mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
			mediaType: "audio",
			location: "Home Studio",
			mood: "Calm",
			offsetDays: 3
		},
		{
			caption: "Deep inside the forests of Bavaria. Three-part gallery: Forest pathways, sunrays filtering through green leaves, and the deep woods. #nature #peaceful #mindful",
			mediaUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop,https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Bavaria, Germany",
			mood: "Grateful",
			offsetDays: 4
		},
		{
			caption: "Sometimes, the most productive thing you can do is absolutely nothing. Let the mind rest. #mindful #detox",
			mediaUrl: null,
			mediaType: null,
			location: "Home Studio",
			mood: "Calm",
			offsetDays: 5
		},
		{
			caption: "First coffee of the day, smelling the freshly ground beans. A ritual that keeps me grounded. #morning #journal",
			mediaUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Coffee Shop",
			mood: "Grateful",
			offsetDays: 6
		},
		{
			caption: "Watching the rain filter through the windows. Recorded the soft thunder claps. #rain #calm #nature",
			mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
			mediaType: "audio",
			location: "Home Studio",
			mood: "Calm",
			offsetDays: 7
		},
		{
			caption: "Running through the fog at dawn. The crisp air in my lungs feels amazing. #morning #fitness #growth",
			mediaUrl: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Lake Geneva",
			mood: "Energized",
			offsetDays: 8
		},
		{
			caption: "A view of the Eiffel Tower from a quiet alleyway. Paris is beautiful when you step away from the tourist crowds. #travel #peaceful",
			mediaUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Paris, France",
			mood: "Inspired",
			offsetDays: 9
		},
		{
			caption: "A simple note to self: You are allowed to take up space. You are allowed to say no. #growth #journal",
			mediaUrl: null,
			mediaType: null,
			location: "Home Studio",
			mood: "Reflective",
			offsetDays: 10
		},
		{
			caption: "Stargazing in the desert. No light pollution, just millions of stars mapping the cosmic canvas. #nature #stargazing #peaceful",
			mediaUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Yosemite Park",
			mood: "Awe",
			offsetDays: 11
		},
		{
			caption: "Warm tea, open book, and the sunset coloring the sky amber. Perfect evening. #evening #journal #peaceful",
			mediaUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Coffee Shop",
			mood: "Peaceful",
			offsetDays: 12
		},
		{
			caption: "Exploring local vinyl records. The crackle of an old record player has a soul that digital streaming cannot match. #creative #music",
			mediaUrl: "https://images.unsplash.com/photo-1484755560693-a4074577af3a?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Paris, France",
			mood: "Inspired",
			offsetDays: 13
		},
		{
			caption: "A voice note reflecting on today's breakthroughs in my coding project. Figured out an elegant way to handle route lifecycles! #creative #growth",
			mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
			mediaType: "audio",
			location: "Home Studio",
			mood: "Excited",
			offsetDays: 14
		},
		{
			caption: "The majesty of Yosemite's waterfalls. Water always finds its way down. #nature #waterfalls",
			mediaUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Yosemite Park",
			mood: "Peaceful",
			offsetDays: 15
		},
		{
			caption: "Cooking a slow, traditional meal from scratch. The chopping, the simmering, the aroma — a sensory meditation. #creative #mindful",
			mediaUrl: null,
			mediaType: null,
			location: "Home Studio",
			mood: "Calm",
			offsetDays: 16
		},
		{
			caption: "Sunrays hitting the flowers in the garden. Spring is finally here. #nature #morning",
			mediaUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Lake Geneva",
			mood: "Joyful",
			offsetDays: 17
		},
		{
			caption: "Walking around Kyoto at dusk. The lanterns are beginning to glow. #travel #evening",
			mediaUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Kyoto, Japan",
			mood: "Reflective",
			offsetDays: 18
		},
		{
			caption: "A short clip of the forest wind. Close your eyes and listen. #nature #peaceful #calm",
			mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
			mediaType: "video",
			location: "Bavaria, Germany",
			mood: "Calm",
			offsetDays: 19
		},
		{
			caption: "Reflections on turning a year older today. Grateful for the lessons, the errors, and the quiet growth. #growth #journal #reflection",
			mediaUrl: null,
			mediaType: null,
			location: "Home Studio",
			mood: "Grateful",
			offsetDays: 20
		},
		{
			caption: "Ending the day with a walk by the lake. The water is perfectly still. #evening #nature #peaceful",
			mediaUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Lake Geneva",
			mood: "Calm",
			offsetDays: 21
		},
		{
			caption: "Reflecting on digital minimalism. Deleting major social apps was the best design decision I ever made for my brain. #detox #mentalhealth",
			mediaUrl: null,
			mediaType: null,
			location: "Home Studio",
			mood: "Peaceful",
			offsetDays: 22
		},
		{
			caption: "A misty morning hike up Yosemite. The path is steep, but the fog adds a sense of magic. #nature #travel #morning",
			mediaUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Yosemite Park",
			mood: "Inspired",
			offsetDays: 23
		},
		{
			caption: "Exploring old alleyways in Rome. History speaks through these cobblestones. #travel #journal",
			mediaUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Rome, Italy",
			mood: "Inspired",
			offsetDays: 24
		},
		{
			caption: "Quiet studio recording sessions. The microphone captures everything — even the silence between notes. #creative #music",
			mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
			mediaType: "audio",
			location: "Home Studio",
			mood: "Reflective",
			offsetDays: 25
		},
		{
			caption: "Sunset overlooking the Amalfi Coast. Absolute visual bliss. #travel #sunset #peaceful",
			mediaUrl: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Amalfi Coast, Italy",
			mood: "Grateful",
			offsetDays: 26
		},
		{
			caption: "A walk through the botanic gardens in winter. Greenhouses are like capsules of warm life in the cold. #nature #mindful",
			mediaUrl: null,
			mediaType: null,
			location: "Bavaria, Germany",
			mood: "Calm",
			offsetDays: 27
		},
		{
			caption: "Freshly brewed green tea and some light journaling. Putting thoughts into words makes them tangible. #morning #journal",
			mediaUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Home Studio",
			mood: "Peaceful",
			offsetDays: 28
		},
		{
			caption: "Listening to the sound of waves hitting the cliffs. A raw demonstration of nature's power. #nature #travel #reels",
			mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
			mediaType: "video",
			location: "Amalfi Coast, Italy",
			mood: "Awe",
			offsetDays: 29
		},
		{
			caption: "Late night code push. Clean refactoring always feels like playing a perfect game of tetris. #creative #thoughts",
			mediaUrl: null,
			mediaType: null,
			location: "Home Studio",
			mood: "Excited",
			offsetDays: 30
		},
		{
			caption: "Sunset at the lake dock. The colors fade from orange to deep royal blue. #evening #nature #peaceful",
			mediaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Lake Geneva",
			mood: "Calm",
			offsetDays: 31
		},
		{
			caption: "Audio log: Thinking out loud about my goals for the upcoming quarter. Time is moving fast, must align priorities. #growth #thoughts",
			mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
			mediaType: "audio",
			location: "Home Studio",
			mood: "Reflective",
			offsetDays: 32
		},
		{
			caption: "The stillness of the alpine meadows. The snow is melting slowly. #nature #mountains",
			mediaUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Swiss Alps",
			mood: "Peaceful",
			offsetDays: 33
		},
		{
			caption: "Reading under an old oak tree. The wind rustling through the leaves is the best ambient sound. #mindful #nature",
			mediaUrl: null,
			mediaType: null,
			location: "Bavaria, Germany",
			mood: "Grateful",
			offsetDays: 34
		},
		{
			caption: "Fresh market fruits in Rome. Colors, sounds, smells — a vivid sensory experience. #travel #Rome",
			mediaUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Rome, Italy",
			mood: "Joyful",
			offsetDays: 35
		},
		{
			caption: "Exploring the geishas' historic district at night. The wood architecture is stunning. #travel #Kyoto",
			mediaUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Kyoto, Japan",
			mood: "Inspired",
			offsetDays: 36
		},
		{
			caption: "Waking up early to catch the mountain sunrise. The cold air keeps you fully awake. #morning #nature",
			mediaUrl: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Swiss Alps",
			mood: "Awe",
			offsetDays: 37
		},
		{
			caption: "A short text reflection: Be kind to your past self. You did the best you could with the tools you had. #growth #mindful",
			mediaUrl: null,
			mediaType: null,
			location: "Home Studio",
			mood: "Reflective",
			offsetDays: 38
		},
		{
			caption: "Rain tapping on the roof. Perfect day to stay inside, drink tea, and work on creative ideas. #rain #creative",
			mediaUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Home Studio",
			mood: "Calm",
			offsetDays: 39
		},
		{
			caption: "A walk around the city canals at dusk. The lights are starting to blink. #evening #travel",
			mediaUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
			mediaType: "image",
			location: "Paris, France",
			mood: "Calm",
			offsetDays: 40
		},
		{
			caption: "Final entry of the travel cycle. Grateful for the people I met, the places I saw, and the silence I documented. #travel #gratitude #growth",
			mediaUrl: null,
			mediaType: null,
			location: "Home Studio",
			mood: "Grateful",
			offsetDays: 41
		},
		{
			caption: "A late night drive through city tunnels capturing the dynamic light streaks. Meditative state of wheels. #creative #night #reels",
			mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
			mediaType: "video",
			location: "Tokyo, Japan",
			mood: "Excited",
			offsetDays: 0
		},
		{
			caption: "Staring out the window during transit. Tunnels, lights, tracks. An abstract visual journal. #travel #transit #reels",
			mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
			mediaType: "video",
			location: "Seoul, South Korea",
			mood: "Reflective",
			offsetDays: 1
		}
	];

	// Insert all posts in order
	const postIds: string[] = [];
	for (const data of postsData) {
		const id = crypto.randomUUID();
		postIds.push(id);
		const createdAt = new Date(Date.now() - data.offsetDays * 24 * 60 * 60 * 1000 - 2000);
		await db.insert(schema.post).values({
			id,
			userId,
			caption: data.caption,
			mediaUrl: data.mediaUrl,
			mediaType: data.mediaType as typeof schema.post.$inferInsert["mediaType"],
			location: data.location,
			mood: data.mood,
			createdAt,
		});
	}

	console.log(`Inserted ${postIds.length} posts successfully.`);

	// 4. Create Active Stories
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

	// 5. Create 22 Collections (Journeys)
	console.log("Creating 22 collections...");
	const collectionsConfig = [
		{ title: "Japan Travels", desc: "Documenting Kyoto bamboo forests and temples.", cover: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop" },
		{ title: "Yosemite Walks", desc: "Cliffs, forest hikes, mist and high streams.", cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop" },
		{ title: "Daily Groundings", desc: "Small morning rituals like coffee and self-talk.", cover: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop" },
		{ title: "Parisian Dusks", desc: "Walks along the Seine and quiet city lights.", cover: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop" },
		{ title: "Alpine Silence", desc: "Climbing snow caps and resting in green valleys.", cover: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop" },
		{ title: "Italian Alleys", desc: "Cobblestones of Rome and Amalfi coastline.", cover: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop" },
		{ title: "Digital Detox Notes", desc: "Reflections on leaving social media distractions.", cover: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&auto=format&fit=crop" },
		{ title: "Bavarian Woods", desc: "Sunrays hitting forest pathways and mossy roots.", cover: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop" },
		{ title: "Creative Loops", desc: "Vinyl record shop finds, studio audio, and code.", cover: "https://images.unsplash.com/photo-1484755560693-a4074577af3a?w=800&auto=format&fit=crop" },
		{ title: "Morning Dews", desc: "Running through lakeside fog and early tea brews.", cover: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&auto=format&fit=crop" },
		{ title: "Grateful Heart Log", desc: "Documenting lessons, mistakes, and inner peace.", cover: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop" },
		{ title: "Stargazing Nights", desc: "Desert sky maps and dark mountain horizons.", cover: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&auto=format&fit=crop" },
		{ title: "Soundscapes of Rain", desc: "Audio claps of thunder and window raindrops.", cover: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop" },
		{ title: "Waterfalls & Valleys", desc: "Rivers finding their path in rocky landscapes.", cover: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop" },
		{ title: "Solus App Milestones", desc: "The journey of building this private digital haven.", cover: "https://images.unsplash.com/photo-1484755560693-a4074577af3a?w=800&auto=format&fit=crop" },
		{ title: "Cooking Meditations", desc: "Chop, simmer, smell. Slow meals from scratch.", cover: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop" },
		{ title: "Rome Market Sensory", desc: "Smells, colors, and textures of fresh foods.", cover: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop" },
		{ title: "Spring Greenhouses", desc: "Glass-domed warm gardens keeping winter cold out.", cover: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop" },
		{ title: "Mental Recharge Log", desc: "Short logs on mental rest and slow living.", cover: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop" },
		{ title: "Alleyway Coffee Spots", desc: "Finding hidden small spots with rich coffee cups.", cover: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop" },
		{ title: "Bouldering & Paths", desc: "Steep mountain paths and climbing achievements.", cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop" },
		{ title: "Quiet Library Rooms", desc: "Paperbacks, wooden chairs, and ticking wall clocks.", cover: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop" },
	];

	for (const config of collectionsConfig) {
		const collectionId = crypto.randomUUID();
		await db.insert(schema.journey).values({
			id: collectionId,
			userId,
			title: config.title,
			description: config.desc,
			coverUrl: config.cover,
		});

		// Staggered linking: Link 2 random posts to each collection
		const idx1 = Math.floor(Math.random() * postIds.length);
		let idx2 = Math.floor(Math.random() * postIds.length);
		if (idx1 === idx2) idx2 = (idx2 + 1) % postIds.length;

		await db.insert(schema.journeyPost).values({
			id: crypto.randomUUID(),
			journeyId: collectionId,
			postId: postIds[idx1],
			order: 1,
		});

		await db.insert(schema.journeyPost).values({
			id: crypto.randomUUID(),
			journeyId: collectionId,
			postId: postIds[idx2],
			order: 2,
		});
	}

	console.log("✅ Seeding completed successfully!");
}

main().catch((err) => {
	console.error("❌ Seeding failed:", err);
	process.exit(1);
});
