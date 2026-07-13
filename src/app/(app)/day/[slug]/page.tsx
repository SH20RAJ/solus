import { Metadata } from "next";
import DayPageClient from "@/components/pages/DayPageClient";

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	// Formats YYYY-MM-DD into a nicer display date
	const date = new Date(slug);
	const formatted = isNaN(date.getTime())
		? slug
		: date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

	return {
		title: `Reflections on ${formatted} | Solus`,
		description: `Browse private reflections, journals, and visual stories captured on ${formatted}.`,
	};
}

export default async function DayPage({ params }: PageProps) {
	const { slug } = await params;
	return <DayPageClient slug={slug} />;
}
