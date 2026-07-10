import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import { APP_CONFIG } from "@/lib/config";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const lora = Lora({
	variable: "--font-serif",
	subsets: ["latin"],
});

export const viewport: Viewport = {
	themeColor: "#09090B",
	width: "device-width",
	initialScale: 1,
};

export const metadata: Metadata = {
	title: APP_CONFIG.title,
	description: APP_CONFIG.description,
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
		title: APP_CONFIG.title,
		description: APP_CONFIG.description,
		url: APP_CONFIG.siteUrl,
		siteName: "Solus",
		images: [
			{
				url: `${APP_CONFIG.siteUrl}${APP_CONFIG.ogImage}`,
				width: 1200,
				height: 630,
				alt: APP_CONFIG.title,
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: APP_CONFIG.title,
		description: APP_CONFIG.description,
		images: [`${APP_CONFIG.siteUrl}${APP_CONFIG.ogImage}`],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Solus",
		"url": APP_CONFIG.siteUrl,
		"description": APP_CONFIG.description,
		"image": `${APP_CONFIG.siteUrl}${APP_CONFIG.ogImage}`
	};

	return (
		<html lang="en">
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} antialiased`}>{children}</body>
		</html>
	);
}
