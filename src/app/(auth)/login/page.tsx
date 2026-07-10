import type { Metadata } from "next";
import LoginPageClient from "@/components/pages/LoginPageClient";

export const metadata: Metadata = {
	title: "Solus — Login",
	description: "Sign in securely using Google social auth.",
};

export default function LoginPage() {
	return <LoginPageClient />;
}
