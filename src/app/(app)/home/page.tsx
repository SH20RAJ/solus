import type { Metadata } from "next";
import HomePageClient from "@/components/pages/HomePageClient";

export const metadata: Metadata = {
	title: "Solus — Home",
	description: "Your private home feed to record reflections, stories, and collections.",
};

export default function HomePage() {
	return <HomePageClient />;
}
