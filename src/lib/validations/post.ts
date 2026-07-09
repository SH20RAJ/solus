import { z } from "zod/v4";

export const createPostSchema = z.object({
	caption: z.string().max(2000).optional(),
	mediaUrl: z.string().url().optional(),
	mediaType: z.enum(["image", "video"]).optional(),
	location: z.string().max(200).optional(),
	mood: z.string().max(50).optional(),
});

export const updatePostSchema = z.object({
	caption: z.string().max(2000).optional(),
	mediaUrl: z.string().url().optional(),
	mediaType: z.enum(["image", "video"]).optional(),
	location: z.string().max(200).optional(),
	mood: z.string().max(50).optional(),
	isPublic: z.boolean().optional(),
	publishAt: z.string().datetime().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
