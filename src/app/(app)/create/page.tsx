import type { Metadata } from "next";
import CreateSelectPageClient from "@/components/pages/CreateSelectPageClient";

export const metadata: Metadata = {
	title: "Solus — Create",
	description: "Record a new memory, write a reflection, upload a story, or save a voice note.",
};

export default function CreatePage() {
	return <CreateSelectPageClient />;
}
