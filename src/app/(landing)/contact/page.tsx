import type { Metadata } from "next";
import ContactPageClient from "@/components/pages/ContactPageClient";

import { APP_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
	title: "Solus — Contact Us",
	description: "Get in touch with the Solus support and feedback team.",
	alternates: {
		canonical: `${APP_CONFIG.siteUrl}/contact`,
	},
};

export default function ContactPage() {
	return <ContactPageClient />;
}
