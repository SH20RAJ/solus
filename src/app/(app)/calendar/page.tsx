import { Metadata } from "next";
import CalendarPageClient from "@/components/pages/CalendarPageClient";

export const metadata: Metadata = {
	title: "Interactive Mood Calendar | Solus",
	description: "Explore your emotional landscape and private memories organized in a visual calendar grid.",
};

export default function CalendarPage() {
	return <CalendarPageClient />;
}
