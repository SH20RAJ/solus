import type { Metadata } from "next";
import CreateJournalPageClient from "@/components/pages/CreateJournalPageClient";

export const metadata: Metadata = {
	title: "Solus — New Journal",
	description: "Create a new book, diary, or memory album collection.",
};

export default function CreateJournalPage() {
	return <CreateJournalPageClient />;
}
