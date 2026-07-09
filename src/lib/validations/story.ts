import { z } from "zod/v4";

export const createStorySchema = z.object({
	mediaUrl: z.string().url(),
	mediaType: z.enum(["image", "video"]),
	caption: z.string().max(500).optional(),
});

export type CreateStoryInput = z.infer<typeof createStorySchema>;
