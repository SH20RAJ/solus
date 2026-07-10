import {
	pgTable,
	text,
	timestamp,
	boolean,
	integer,
} from "drizzle-orm/pg-core";

/* ─── Better Auth Tables ─── */

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(false),
	image: text("image"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/* ─── Solus Application Tables ─── */

export const post = pgTable("post", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	caption: text("caption"),
	mediaUrl: text("media_url"),
	mediaType: text("media_type", { enum: ["image", "video", "audio"] }),
	location: text("location"),
	mood: text("mood"),
	isPublic: boolean("is_public").notNull().default(false),
	publishAt: timestamp("publish_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const story = pgTable("story", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	mediaUrl: text("media_url").notNull(),
	mediaType: text("media_type", { enum: ["image", "video", "audio"] }).notNull(),
	caption: text("caption"),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const journey = pgTable("journey", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	description: text("description"),
	coverUrl: text("cover_url"),
	isPublic: boolean("is_public").notNull().default(false),
	publishAt: timestamp("publish_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const journeyPost = pgTable("journey_post", {
	id: text("id").primaryKey(),
	journeyId: text("journey_id")
		.notNull()
		.references(() => journey.id, { onDelete: "cascade" }),
	postId: text("post_id")
		.notNull()
		.references(() => post.id, { onDelete: "cascade" }),
	order: integer("order").notNull().default(0),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const comment = pgTable("comment", {
	id: text("id").primaryKey(),
	postId: text("post_id")
		.notNull()
		.references(() => post.id, { onDelete: "cascade" }),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	content: text("content").notNull(),
	parentId: text("parent_id").references((): any => comment.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

