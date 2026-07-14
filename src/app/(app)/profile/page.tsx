import type { Metadata } from "next";
import ProfilePageClient from "@/components/pages/ProfilePageClient";

import { APP_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
	title: "Solus — Profile",
	description: "View your personal reflections timeline, diary stats, and memory map.",
	alternates: {
		canonical: `${APP_CONFIG.siteUrl}/profile`,
	},
};

export default function ProfilePage() {
	return <ProfilePageClient />;
}
