import type { Metadata } from "next";
import LocationPageClient from "@/components/pages/LocationPageClient";

export const metadata: Metadata = {
	title: "Solus — Explore Location",
	description: "Browse related private diary entries for the selected location.",
};

export default function LocationPage() {
	return <LocationPageClient />;
}
