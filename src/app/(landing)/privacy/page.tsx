import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
	return (
		<div className="min-h-screen bg-background text-text-primary flex flex-col justify-between">
			{/* Nav */}
			<nav className="flex items-center justify-between px-4 sm:px-6 py-5 max-w-[960px] mx-auto w-full">
				<Link href="/" className="flex items-center gap-2.5">
					<Image
						src="/logo.png"
						alt="Solus logo"
						width={32}
						height={32}
						className="rounded-[10px]"
					/>
					<span className="text-base font-semibold tracking-tight">Solus</span>
				</Link>
				<Link
					href="/"
					className="text-sm text-text-muted hover:text-text-primary transition-colors"
				>
					← Back
				</Link>
			</nav>

			{/* Content */}
			<div className="max-w-[640px] mx-auto px-6 py-16 flex-1 w-full animate-slide-up">
				<header className="mb-12">
					<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight font-serif text-text-primary">
						Privacy Policy
					</h1>
					<p className="mt-2 text-xs font-mono text-text-muted">
						Last updated: July 10, 2026
					</p>
				</header>

				<article className="prose prose-invert max-w-none space-y-8 text-sm text-text-secondary leading-relaxed font-sans">
					<section className="space-y-3">
						<h2 className="text-lg font-bold text-text-primary font-serif">1. Privacy is Our Core Product</h2>
						<p>
							Unlike traditional networks that build profiles of your behavior for advertiser targeting, Solus is designed for self-reflection. We do not sell, license, or monetize your journal entries, photos, videos, or voice logs.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-bold text-text-primary font-serif">2. What We Collect</h2>
						<p>
							We keep data collections minimal:
						</p>
						<ul className="list-disc pl-5 space-y-2">
							<li><strong>Account Information:</strong> Account data verified via Google Social Sign-In (email, name, profile image URL).</li>
							<li><strong>Journal Content:</strong> Your captions, locations, moods, uploaded media files (images, vlogs, voice notes), and private replies.</li>
							<li><strong>Analytics:</strong> We do not track page scrolls, click-stream coordinates, or attention metrics. We only track minimal crash reports to keep the app working.</li>
						</ul>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-bold text-text-primary font-serif">3. Storage & Safety</h2>
						<p>
							All content is stored in secure database structures and cloud storage instances (Neon PostgreSQL and Cloudflare R2). No one can follow your profile, view your posts, or scrape your private data.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-bold text-text-primary font-serif">4. Optional Sharing</h2>
						<p>
							If you choose to create a shareable collection (Collection) or schedule a public link, that specific selected content will be made visible on a unique URL. Sharing is always optional and disabled by default.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-bold text-text-primary font-serif">5. Contact</h2>
						<p>
							For any data removal requests or queries, please submit a feedback note via our <Link href="/contact" className="text-accent hover:underline">Contact Page</Link>.
						</p>
					</section>
				</article>
			</div>

			{/* Footer spacer */}
			<div className="py-8 shrink-0" />
		</div>
	);
}
