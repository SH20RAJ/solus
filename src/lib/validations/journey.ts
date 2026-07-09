import { z } from "zod/v4";

export const createJourneySchema = z.object({
	title: z.string().min(1).max(200),
	description: z.string().max(2000).optional(),
	coverUrl: z.string().url().optional(),
});

export const updateJourneySchema = z.object({
	title: z.string().min(1).max(200).optional(),
	description: z.string().max(2000).optional(),
	coverUrl: z.string().url().optional(),
	isPublic: z.boolean().optional(),
	publishAt: z.string().datetime().optional(),
});

export const addJourneyPostSchema = z.object({
	postId: z.string(),
	order: z.number().int().min(0).optional(),
});

export type CreateJourneyInput = z.infer<typeof createJourneySchema>;
export type UpdateJourneyInput = z.infer<typeof updateJourneySchema>;
export type AddJourneyPostInput = z.infer<typeof addJourneyPostSchema>;
