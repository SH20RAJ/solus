import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const viewport: Viewport = {
	themeColor: "#09090B",
	width: "device-width",
	initialScale: 1,
};

export const metadata: Metadata = {
	title: "Solus — Leave everyone. Don't leave yourself.",
	description:
		"A private social network where you document your life without an audience and share your story only when you're ready.",
	manifest: "/manifest.json",
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
		],
		apple: "/apple-touch-icon.png",
	},
	openGraph: {
		title: "Solus — Leave everyone. Don't leave yourself.",
		description:
			"A private social network where you document your life without an audience.",
		url: "https://solus.shraj.workers.dev",
		siteName: "Solus",
		images: [
			{
				url: "https://solus.shraj.workers.dev/og-image.png",
				width: 1200,
				height: 630,
				alt: "Solus — Leave everyone. Don't leave yourself.",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Solus — Leave everyone. Don't leave yourself.",
		description:
			"A private social network where you document your life without an audience.",
		images: ["https://solus.shraj.workers.dev/og-image.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	);
}
