import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { APP_CONFIG } from "@/lib/config";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
	alternates: {
		canonical: APP_CONFIG.siteUrl,
	},
};

export default async function LandingPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const isLogged = !!session;
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"name": "Solus",
		"operatingSystem": "Web",
		"applicationCategory": "SocialNetworkingApplication",
		"description": "A private-first social platform where people document their lives without an audience.",
		"offers": {
			"@type": "Offer",
			"price": "0",
			"priceCurrency": "USD"
		}
	};

	return (
		<div className="min-h-screen bg-background text-text-primary">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			{/* ── Nav ── */}
			<nav className="flex items-center justify-between px-4 sm:px-6 py-5 max-w-[960px] mx-auto">
				<div className="flex items-center gap-2.5">
					<Image
						src="/logo.png"
						alt="Solus logo"
						width={32}
						height={32}
						className="rounded-[10px]"
					/>
					<span className="text-base font-semibold tracking-tight">
						Solus
					</span>
				</div>
				<div className="flex items-center gap-5">
					{isLogged ? (
						<Link
							href="/home"
							className="text-xs uppercase font-mono tracking-wider font-semibold text-accent px-3 py-1.5 rounded-lg border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors"
						>
							Go to Feed
						</Link>
					) : (
						<Link
							href="/login"
							className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200 ease-out"
						>
							Sign In
						</Link>
					)}
					<a
						href={APP_CONFIG.githubUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200 ease-out"
						aria-label="View Solus on GitHub"
					>
						GitHub
					</a>
				</div>
			</nav>

			{/* ── Hero ── */}
			<section className="px-4 sm:px-6 pt-16 pb-24 sm:pt-24 sm:pb-32 max-w-[760px] mx-auto animate-slide-up">
				<p className="text-sm text-text-muted mb-6 tracking-wide">
					A private social network
				</p>
				<h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.15] text-text-primary">
					Leave everyone.
					<br />
					Don&apos;t leave yourself.
				</h1>
				<p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-[560px]">
					Document your life without an audience. Post photos, stories,
					and memories — everything stays private. Share your story only
					when you&apos;re ready.
				</p>
				<div className="mt-10">
					<div className="flex flex-wrap gap-4">
						<Link
							id="hero-cta"
							href={isLogged ? "/home" : "/login"}
							className="inline-flex h-11 px-6 items-center justify-center rounded-[12px] bg-text-primary text-background text-sm font-semibold transition-opacity duration-200 ease-out hover:opacity-85 cursor-pointer"
						>
							{isLogged ? "Go to Feed" : "Start Your Timeline"}
						</Link>
						<Link
							id="hero-pitch-cta"
							href="/pitch"
							className="inline-flex h-11 px-6 items-center justify-center rounded-[12px] border border-border/40 text-text-primary text-sm font-medium transition-colors duration-200 ease-out hover:bg-card cursor-pointer"
						>
							Read the Pitch
						</Link>
					</div>
					<p className="mt-3.5 text-xs text-text-muted">
						Free forever for personal use. No ads. No algorithm.
					</p>
				</div>
			</section>

			{/* ── Divider ── */}
			<div className="max-w-[760px] mx-auto px-4 sm:px-6">
				<div className="h-px bg-border" />
			</div>

			{/* ── Problem ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[760px] mx-auto">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					The problem
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-text-primary">
					Social media turned self-expression into performance.
				</h2>
				<p className="mt-5 text-base text-text-secondary leading-relaxed max-w-[560px]">
					Every post is influenced by likes, comments, followers, and
					algorithms. People stopped living moments naturally and started
					creating moments for an audience.
				</p>

				<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
					{[
						"Will this get likes?",
						"Is this aesthetic enough?",
						"What will people think?",
						"Should I even post this?",
					].map((question, i) => (
						<div
							key={i}
							className="p-6 rounded-[20px] bg-card border border-border"
						>
							<p className="text-sm text-text-secondary italic leading-relaxed">
								&ldquo;{question}&rdquo;
							</p>
						</div>
					))}
				</div>
			</section>

			{/* ── Divider ── */}
			<div className="max-w-[760px] mx-auto px-4 sm:px-6">
				<div className="h-px bg-border" />
			</div>

			{/* ── Solution ── */}
			<section
				id="features"
				className="px-4 sm:px-6 py-20 sm:py-24 max-w-[760px] mx-auto"
			>
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					The solution
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-text-primary">
					Everything you love about social media.
					<br />
					<span className="text-text-muted">Minus the audience.</span>
				</h2>

				<div className="mt-12 space-y-4">
					{[
						{
							title: "Private by default",
							desc: "Nobody can discover, follow, like, comment, or message. Your timeline is yours alone.",
						},
						{
							title: "Post freely",
							desc: "Photos, videos, captions, stories — everything works like the social media you know.",
						},
						{
							title: "Personal timeline",
							desc: "A chronological record of your life. Scroll through memories anytime.",
						},
						{
							title: "Share when ready",
							desc: "Publish a single post, a collection as a journey, or your whole profile. Always optional.",
						},
						{
							title: "Scheduled publishing",
							desc: "Set a future date. Until then, visitors see \"This page will become public on [date].\"",
						},
						{
							title: "Journey mode",
							desc: "Group posts into themed journeys like \"30 Days in Ladakh\" or \"Building My Startup.\"",
						},
					].map((feature, i) => (
						<div
							key={i}
							className="flex gap-4 p-6 rounded-[20px] bg-card border border-border"
						>
							<div className="shrink-0 w-2 h-2 rounded-full bg-accent mt-2" />
							<div>
								<h3 className="text-base font-semibold text-text-primary">
									{feature.title}
								</h3>
								<p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
									{feature.desc}
								</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* ── Divider ── */}
			<div className="max-w-[760px] mx-auto px-4 sm:px-6">
				<div className="h-px bg-border" />
			</div>

			{/* ── How It Works ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[760px] mx-auto">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					How it works
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-text-primary">
					Three simple steps.
				</h2>

				<div className="mt-12 space-y-8">
					{[
						{
							step: "1",
							title: "Capture",
							desc: "Post photos, videos, stories, and thoughts — without thinking about an audience.",
						},
						{
							step: "2",
							title: "Reflect",
							desc: "Build a personal timeline. Revisit memories. Discover patterns in your life.",
						},
						{
							step: "3",
							title: "Share",
							desc: "When your journey is complete, publish it. Or keep it private forever. The choice is yours.",
						},
					].map((item, i) => (
						<div key={i} className="flex gap-5">
							<span className="shrink-0 text-sm font-medium text-text-muted w-6 pt-0.5 text-right">
								{item.step}
							</span>
							<div>
								<h3 className="text-base font-semibold text-text-primary">
									{item.title}
								</h3>
								<p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
									{item.desc}
								</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* ── Divider ── */}
			<div className="max-w-[760px] mx-auto px-4 sm:px-6">
				<div className="h-px bg-border" />
			</div>

			{/* ── Use Cases ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[760px] mx-auto">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					Who it&apos;s for
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-text-primary">
					For people who live deliberately.
				</h2>

				<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
					{[
						{
							title: "Solo travelers",
							desc: "Document your journey privately. Publish \"45 Days Across Nepal\" when you return.",
						},
						{
							title: "Founders",
							desc: "Record wins and failures. Publish \"Building XYZ from Day 1\" at launch.",
						},
						{
							title: "Students",
							desc: "Track your UPSC or JEE prep privately. Share the journey after selection.",
						},
						{
							title: "Learners",
							desc: "Piano Day 1 → Day 300. One beautiful timeline of quiet growth.",
						},
						{
							title: "Parents",
							desc: "Baby milestones — private forever, or publish years later.",
						},
						{
							title: "Digital detox",
							desc: "Leave Instagram for 30 days. Keep documenting your life on Solus.",
						},
					].map((item, i) => (
						<div
							key={i}
							className="p-6 rounded-[20px] bg-card border border-border"
						>
							<h3 className="text-sm font-semibold text-text-primary">
								{item.title}
							</h3>
							<p className="mt-2 text-sm text-text-secondary leading-relaxed">
								{item.desc}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* ── Divider ── */}
			<div className="max-w-[760px] mx-auto px-4 sm:px-6">
				<div className="h-px bg-border" />
			</div>

			{/* ── Trust & Privacy ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[760px] mx-auto text-left">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					Trust & Privacy
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-text-primary">
					Your data, actually private.
				</h2>
				<p className="mt-4 text-base text-text-secondary leading-relaxed max-w-[560px]">
					We build for individual reflection, not data monetization. Here is how we guarantee your privacy:
				</p>
				<div className="mt-8 space-y-4 max-w-[560px]">
					<div className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
						<span className="text-accent shrink-0 mt-1">✓</span>
						<span><strong>No public access by default:</strong> No public API exposes your entries. You control exactly what gets shared.</span>
					</div>
					<div className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
						<span className="text-accent shrink-0 mt-1">✓</span>
						<span><strong>Complete data ownership:</strong> Export or delete your entire history at any time. We do not keep shadow backups.</span>
					</div>
					<div className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
						<span className="text-accent shrink-0 mt-1">✓</span>
						<span><strong>Zero ads or algorithms:</strong> We don&apos;t sell your data to advertisers or profile your personality traits.</span>
					</div>
					<div className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
						<span className="text-accent shrink-0 mt-1">✓</span>
						<span><strong>Open source transparency:</strong> The entire application code is open for anyone to inspect and audit on <a href={APP_CONFIG.githubUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80">GitHub</a>.</span>
					</div>
				</div>
			</section>

			{/* ── Divider ── */}
			<div className="max-w-[760px] mx-auto px-4 sm:px-6">
				<div className="h-px bg-border" />
			</div>

			{/* ── Philosophy ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[760px] mx-auto">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					Philosophy
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-text-primary mb-12">
					A different kind of social.
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="p-6 rounded-[20px] bg-card border border-border">
						<p className="text-xs font-medium text-text-muted mb-5 uppercase tracking-wider">
							Instagram
						</p>
						<ul className="space-y-3 text-sm text-text-secondary text-left">
							<li>Designed for attention</li>
							<li>Rewards engagement</li>
							<li>Public by default</li>
							<li>&ldquo;What will people think?&rdquo;</li>
						</ul>
					</div>

					<div className="p-6 rounded-[20px] bg-card border border-accent/30">
						<p className="text-xs font-medium text-accent mb-5 uppercase tracking-wider">
							Solus
						</p>
						<ul className="space-y-3 text-sm text-text-primary text-left">
							<li>Designed for reflection</li>
							<li>Rewards authenticity</li>
							<li>Private by default</li>
							<li>&ldquo;What do you think?&rdquo;</li>
						</ul>
					</div>
				</div>
			</section>

			{/* ── Divider ── */}
			<div className="max-w-[760px] mx-auto px-4 sm:px-6">
				<div className="h-px bg-border" />
			</div>

			{/* ── Principles ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[760px] mx-auto text-center">
				<div className="flex flex-wrap justify-center gap-3">
					{[
						"Private by default",
						"No followers",
						"No likes",
						"No comments",
						"No algorithms",
						"No pressure",
						"Just memories",
					].map((principle, i) => (
						<span
							key={i}
							className="px-4 py-2 rounded-[12px] border border-border text-sm text-text-secondary"
						>
							{principle}
						</span>
					))}
				</div>
			</section>

			{/* ── Divider ── */}
			<div className="max-w-[760px] mx-auto px-4 sm:px-6">
				<div className="h-px bg-border" />
			</div>

			{/* ── FAQ ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[760px] mx-auto text-left">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					FAQ
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-text-primary mb-10">
					Frequently Asked Questions
				</h2>
				<div className="space-y-8 max-w-[600px]">
					<div>
						<h3 className="text-base font-semibold text-text-primary">Is Solus really free?</h3>
						<p className="mt-2 text-sm text-text-secondary leading-relaxed">
							Yes, Solus is free forever for personal journaling and memory storage. We plan to introduce optional paid tiers in the future for large-scale storage and premium features like automated book printing.
						</p>
					</div>
					<div>
						<h3 className="text-base font-semibold text-text-primary">Can anyone see my posts?</h3>
						<p className="mt-2 text-sm text-text-secondary leading-relaxed">
							No. By default, every reflection, story, and image is completely private and only viewable by you when you log in. You can choose to generate public links for specific collections, but that is entirely optional.
						</p>
					</div>
					<div>
						<h3 className="text-base font-semibold text-text-primary">What happens if I want to leave?</h3>
						<p className="mt-2 text-sm text-text-secondary leading-relaxed">
							You can download a complete archive of all your posts, images, and metadata at any time, or request the permanent deletion of your account and files from our servers.
						</p>
					</div>
					<div>
						<h3 className="text-base font-semibold text-text-primary">Is my data backed up?</h3>
						<p className="mt-2 text-sm text-text-secondary leading-relaxed">
							Yes. Your data is stored securely in distributed databases with automated daily backups, ensuring you never lose your life journal.
						</p>
					</div>
					<div>
						<h3 className="text-base font-semibold text-text-primary">Is this open source?</h3>
						<p className="mt-2 text-sm text-text-secondary leading-relaxed">
							Yes, the entire codebase is open-source. Anyone can audit our code or self-host their own instance of Solus.
						</p>
					</div>
				</div>
			</section>

			{/* ── Divider ── */}
			<div className="max-w-[760px] mx-auto px-4 sm:px-6">
				<div className="h-px bg-border" />
			</div>

			{/* ── Final CTA ── */}
			<section className="px-4 sm:px-6 py-24 sm:py-32 max-w-[760px] mx-auto text-center">
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
					Your life. Your story.
				</h2>
				<p className="mt-4 text-base text-text-secondary max-w-[480px] mx-auto leading-relaxed">
					Document your life for yourself. Share your story only when
					you&apos;re ready.
				</p>
				<div className="mt-8">
					<Link
						id="cta-final"
						href={isLogged ? "/home" : "/login"}
						className="inline-flex h-11 px-6 items-center justify-center rounded-[12px] bg-text-primary text-background text-sm font-semibold transition-opacity duration-200 ease-out hover:opacity-85 cursor-pointer"
					>
						{isLogged ? "Go to Feed" : "Start Your Timeline"}
					</Link>
					<p className="mt-3.5 text-xs text-text-muted">
						Free forever for personal use. No ads. No algorithm.
					</p>
				</div>
			</section>

			{/* ── Footer ── */}
			<footer className="border-t border-border px-4 sm:px-6 py-8 max-w-[960px] mx-auto animate-fade-in">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-2.5">
						<Image
							src="/logo.png"
							alt="Solus logo"
							width={24}
							height={24}
							className="rounded-md"
						/>
						<span className="text-sm text-text-secondary">Solus</span>
					</div>
					<p className="text-xs text-text-muted text-center sm:text-left">
						Live first. Share later.
					</p>
					<div className="flex items-center gap-4 text-xs text-text-muted flex-wrap justify-center">
						<Link href="/contact" className="hover:text-text-primary transition-colors duration-200">
							Contact
						</Link>
						<Link href="/privacy" className="hover:text-text-primary transition-colors duration-200">
							Privacy
						</Link>
						<Link href="/terms" className="hover:text-text-primary transition-colors duration-200">
							Terms
						</Link>
						<Link href="/pitch" className="hover:text-text-primary transition-colors duration-200">
							Pitch Deck
						</Link>
						<a
							href={APP_CONFIG.githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-text-primary transition-colors duration-200 ease-out"
						>
							GitHub
						</a>
						<span>© {new Date().getFullYear()}</span>
					</div>
				</div>
			</footer>
		</div>
	);
}
