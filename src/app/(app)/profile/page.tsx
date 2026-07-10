import type { Metadata } from "next";
import ProfilePageClient from "@/components/pages/ProfilePageClient";

export const metadata: Metadata = {
	title: "Solus — Profile",
	description: "View your personal reflections timeline, diary stats, and memory map.",
};

export default function ProfilePage() {
	return <ProfilePageClient />;
}
