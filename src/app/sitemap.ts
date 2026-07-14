import { MetadataRoute } from "next";
import { APP_CONFIG } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const routes = [
		"",
		"/pitch",
		"/contact",
		"/login",
	].map((route) => ({
		url: `${APP_CONFIG.siteUrl}${route}`,
		lastModified: new Date(),
		changeFrequency: "daily" as const,
		priority: route === "" ? 1.0 : 0.8,
	}));

	return routes;
}
