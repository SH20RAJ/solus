import type { Metadata } from "next";
import HomePageClient from "@/components/pages/HomePageClient";

import { APP_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
	title: "Solus — Home",
	description: "Your private home feed to record reflections, stories, and collections.",
	alternates: {
		canonical: `${APP_CONFIG.siteUrl}/home`,
	},
};

export default function HomePage() {
	return <HomePageClient />;
}
