import type { Metadata } from "next";
import LoginPageClient from "@/components/pages/LoginPageClient";

import { APP_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
	title: "Solus — Login",
	description: "Sign in securely using Google social auth.",
	alternates: {
		canonical: `${APP_CONFIG.siteUrl}/login`,
	},
};

export default function LoginPage() {
	return <LoginPageClient />;
}
