import type { Metadata } from "next";
import TimelinePageClient from "@/components/pages/TimelinePageClient";

export const metadata: Metadata = {
	title: "Solus — Timeline",
	description: "Your chronological private history stream.",
};

export default function TimelinePage() {
	return <TimelinePageClient />;
}
