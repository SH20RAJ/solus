import type { Metadata } from "next";
import ContactPageClient from "@/components/pages/ContactPageClient";

export const metadata: Metadata = {
	title: "Solus — Contact Us",
	description: "Get in touch with the Solus support and feedback team.",
};

export default function ContactPage() {
	return <ContactPageClient />;
}
