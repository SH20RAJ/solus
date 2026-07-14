import type { Metadata } from "next";
import LocationPageClient from "@/components/pages/LocationPageClient";
import { APP_CONFIG } from "@/lib/config";

interface PageProps {
	params: Promise<{
		location: string;
	}>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { location } = await params;
	const decoded = decodeURIComponent(location);
	return {
		title: `Memories in ${decoded} | Solus`,
		description: `Browse related private diary entries for ${decoded}.`,
		alternates: {
			canonical: `${APP_CONFIG.siteUrl}/locations/${location}`,
		},
	};
}

export default function LocationPage() {
	return <LocationPageClient />;
}
