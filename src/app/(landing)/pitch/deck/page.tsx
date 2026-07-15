import type { Metadata } from "next";
import PitchDeckClient from "@/components/pages/PitchDeckClient";
import { APP_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
	title: "Solus — Pitch Deck",
	description: "Interactive investor pitch presentation deck. Live first. Share later.",
	alternates: {
		canonical: `${APP_CONFIG.siteUrl}/pitch/deck`,
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function PitchDeckPage() {
	return <PitchDeckClient />;
}
