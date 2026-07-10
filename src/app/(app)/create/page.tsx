import type { Metadata } from "next";
import CreatePageClient from "@/components/pages/CreatePageClient";

export const metadata: Metadata = {
	title: "Solus — Create",
	description: "Record a new memory, write a reflection, upload a story, or save a voice note.",
};

export default function CreatePage() {
	return <CreatePageClient />;
}
