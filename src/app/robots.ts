import { MetadataRoute } from "next";
import { APP_CONFIG } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: [
				"/",
				"/pitch",
				"/contact",
				"/login",
			],
			disallow: [
				"/api/",
				"/_next/",
				"/home",
				"/profile",
				"/timeline",
				"/calendar",
				"/collections",
				"/reels",
				"/stories",
				"/day/",
				"/posts/",
				"/locations/",
				"/tags/",
				"/create",
				"/create/",
			],
		},
		sitemap: `${APP_CONFIG.siteUrl}/sitemap.xml`,
	};
}
