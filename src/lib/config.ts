export const APP_CONFIG = {
	siteUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://solus.shraj.workers.dev",
	title: "Solus — Leave everyone. Don't leave yourself.",
	description:
		"A private social network where you document your life without an audience and share your story only when you're ready.",
	githubUrl: "https://github.com/SH20RAJ/solus",
	ogImage: "/og-image.png",
} as const;
