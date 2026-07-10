import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { APP_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
	title: "Solus — Pitch",
	description:
		"The world's first Personal Social Network. Document your life without an audience, share your story when you're ready.",
};

export default function PitchPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "ItemPage",
		"name": "Solus Pitch — The Personal Social Network",
		"description": "Document your life without an audience, share your story when you're ready.",
		"url": `${APP_CONFIG.siteUrl}/pitch`,
		"mainEntity": {
			"@type": "Product",
			"name": "Solus",
			"description": "The world's first Personal Social Network."
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
				<Link href="/" className="flex items-center gap-2.5">
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
				</Link>
				<Link
					href="/"
					className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200 ease-out"
				>
					← Back
				</Link>
			</nav>

			{/* ── Hero ── */}
			<section className="px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-24 max-w-[680px] mx-auto animate-slide-up">
				<p className="text-sm text-text-muted mb-6 tracking-wide">
					Pitch
				</p>
				<h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.15] text-text-primary">
					The Personal
					<br />
					Social Network.
				</h1>
				<p className="mt-6 text-lg text-text-secondary leading-relaxed">
					Leave everyone. Don&apos;t leave yourself.
				</p>
			</section>

			{/* ── Divider ── */}
			<Divider />

			{/* ── Imagine This ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[680px] mx-auto">
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-text-primary mb-8">
					Imagine this.
				</h2>
				<div className="space-y-4">
					{[
						"A young professional quits Instagram.",
						"A founder disappears for six months to build a company.",
						"A student deletes every social app before an important exam.",
						"A traveler spends three months alone in the Himalayas.",
						"A person recovering from heartbreak needs space to heal.",
					].map((line, i) => (
						<p
							key={i}
							className="text-base text-text-secondary leading-relaxed"
						>
							{line}
						</p>
					))}
				</div>
				<div className="mt-10 space-y-3">
					<p className="text-base text-text-secondary leading-relaxed">
						Today, they have only two choices.
					</p>
					<p className="text-base text-text-secondary leading-relaxed">
						Either continue posting for an audience...
					</p>
					<p className="text-base text-text-secondary leading-relaxed">
						...or stop documenting their life entirely.
					</p>
				</div>
				<p className="mt-8 text-lg font-semibold text-text-primary">
					There should be a third option.
				</p>
			</section>

			<Divider />

			{/* ── The Problem ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[680px] mx-auto">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					The problem
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-text-primary mb-8">
					Social media promised connection.
					<br />
					<span className="text-text-muted">
						Instead, it created performance.
					</span>
				</h2>
				<div className="space-y-4 text-base text-text-secondary leading-relaxed">
					<p>Every photo becomes a decision.</p>
					<p>Every moment becomes content.</p>
					<p>Every experience is filtered through one question:</p>
				</div>
				<blockquote className="mt-8 pl-5 border-l-2 border-border">
					<p className="text-lg font-semibold text-text-primary italic">
						&ldquo;What will people think?&rdquo;
					</p>
				</blockquote>
				<div className="mt-8 space-y-4 text-base text-text-secondary leading-relaxed">
					<p>People don&apos;t just share their lives anymore. They perform them.</p>
					<p>
						Millions delete Instagram, Facebook, Snapchat, and X every year
						in search of peace. But when they leave, they also stop
						recording their lives.
					</p>
					<p>
						Their memories disappear into camera rolls, scattered notes,
						and forgotten folders.
					</p>
				</div>
				<div className="mt-10 p-6 rounded-[20px] bg-card border border-border">
					<p className="text-sm text-text-secondary leading-relaxed">
						The internet has perfected sharing.
					</p>
					<p className="mt-2 text-sm font-semibold text-text-primary">
						It has never perfected remembering.
					</p>
				</div>
			</section>

			<Divider />

			{/* ── Our Belief ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[680px] mx-auto">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					Our belief
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-text-primary">
					People don&apos;t need another social network.
				</h2>
				<p className="mt-4 text-lg text-text-secondary leading-relaxed">
					They need a place where they can simply exist.
				</p>
			</section>

			<Divider />

			{/* ── Introducing Solus ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[680px] mx-auto">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					Introducing
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-text-primary mb-8">
					Solus
				</h2>
				<p className="text-base text-text-secondary leading-relaxed mb-8">
					The world&apos;s first <span className="font-semibold text-text-primary">Personal Social Network</span>.
				</p>
				<p className="text-base text-text-secondary leading-relaxed mb-6">
					It looks familiar. You can:
				</p>
				<ul className="space-y-3 mb-8">
					{[
						"Post photos",
						"Upload videos",
						"Write captions",
						"Create stories",
						"Build a timeline",
					].map((item, i) => (
						<li
							key={i}
							className="flex items-center gap-3 text-base text-text-secondary"
						>
							<span className="shrink-0 w-1.5 h-1.5 rounded-full bg-accent" />
							{item}
						</li>
					))}
				</ul>
				<p className="text-base text-text-secondary leading-relaxed mb-6">
					But there is one fundamental difference.
				</p>
				<p className="text-lg font-semibold text-text-primary mb-8">
					There is no audience.
				</p>

				<div className="flex flex-wrap gap-3">
					{[
						"No followers",
						"No likes",
						"No comments",
						"No algorithm",
						"No pressure",
					].map((item, i) => (
						<span
							key={i}
							className="px-4 py-2 rounded-[12px] border border-border text-sm text-text-secondary"
						>
							{item}
						</span>
					))}
				</div>

				<p className="mt-10 text-base text-text-secondary leading-relaxed">
					Every post is for one person.
				</p>
				<p className="mt-2 text-lg font-semibold text-text-primary">
					You.
				</p>
			</section>

			<Divider />

			{/* ── A New Category ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[680px] mx-auto">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					A new category
				</p>
				<div className="space-y-4 text-base text-text-secondary leading-relaxed mb-8">
					<p>Social Media was built for broadcasting.</p>
					<p>Journaling apps were built for writing.</p>
					<p>Photo galleries were built for storage.</p>
				</div>
				<p className="text-base text-text-secondary leading-relaxed mb-2">
					Solus is different. It combines the emotional familiarity
					of social media with the privacy of a journal.
				</p>
				<div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
					{[
						{ label: "Not social media", muted: true },
						{ label: "Not journaling", muted: true },
						{ label: "Personal Media", muted: false },
					].map((item, i) => (
						<div
							key={i}
							className={`p-5 rounded-[20px] border text-center ${
								item.muted
									? "border-border bg-card"
									: "border-accent/30 bg-card"
							}`}
						>
							<p
								className={`text-sm font-semibold ${
									item.muted ? "text-text-muted" : "text-accent"
								}`}
							>
								{item.label}
							</p>
						</div>
					))}
				</div>
			</section>

			<Divider />

			{/* ── Sarah's Story ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[680px] mx-auto">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					The user journey
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-text-primary mb-8">
					Sarah&apos;s story.
				</h2>
				<div className="space-y-4 text-base text-text-secondary leading-relaxed">
					<p>Sarah decides to disconnect for ninety days.</p>
					<p>She deletes Instagram. She doesn&apos;t want attention. She wants clarity.</p>
					<p>
						Every morning she uploads a photo. Every evening she writes
						a few thoughts. She creates stories. Records videos. Captures
						sunsets. Documents difficult days.
					</p>
					<p>Nothing is optimized for engagement.</p>
					<p className="font-semibold text-text-primary">
						Everything is optimized for memory.
					</p>
					<p>
						Three months later she returns. She doesn&apos;t just have photos.
					</p>
					<p className="font-semibold text-text-primary">
						She has the story of who she became.
					</p>
				</div>
			</section>

			<Divider />

			{/* ── Live First, Share Later ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[680px] mx-auto">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					Live first. Share later.
				</p>
				<div className="space-y-4 text-base text-text-secondary leading-relaxed">
					<p>
						Months later Sarah decides her journey might help someone
						else. With one click she publishes it.
					</p>
					<p>Now people can read:</p>
				</div>
				<p className="mt-6 text-xl font-bold text-text-primary">
					&ldquo;90 Days Offline.&rdquo;
				</p>
				<div className="mt-6 space-y-4 text-base text-text-secondary leading-relaxed">
					<p>The story wasn&apos;t created for an audience.</p>
					<p>It was shared because it became meaningful.</p>
					<p className="font-semibold text-text-primary">
						That changes everything.
					</p>
				</div>
			</section>

			<Divider />

			{/* ── Why Now ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[680px] mx-auto">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					Why now
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-text-primary mb-8">
					People are exhausted.
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{[
						"Digital detoxes are growing",
						"Mindfulness is growing",
						"Journaling is growing",
						"Mental wellness is growing",
					].map((trend, i) => (
						<div
							key={i}
							className="p-5 rounded-[20px] bg-card border border-border"
						>
							<p className="text-sm text-text-secondary">{trend}</p>
						</div>
					))}
				</div>
				<p className="mt-8 text-base text-text-secondary leading-relaxed">
					People are looking for healthier relationships with technology.
					Solus sits at the intersection of all of these trends.
				</p>
			</section>

			<Divider />

			{/* ── Business Model ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[680px] mx-auto">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					Business model
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-text-primary mb-8">
					Simple and honest.
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="p-6 rounded-[20px] bg-card border border-border">
						<p className="text-xs font-medium text-text-muted mb-4 uppercase tracking-wider">
							Free
						</p>
						<p className="text-sm text-text-secondary leading-relaxed">
							Unlimited personal memories.
						</p>
					</div>
					<div className="p-6 rounded-[20px] bg-card border border-accent/30">
						<p className="text-xs font-medium text-accent mb-4 uppercase tracking-wider">
							Premium
						</p>
						<ul className="space-y-2 text-sm text-text-secondary">
							<li>AI memory organization</li>
							<li>Beautiful exports</li>
							<li>Private backups</li>
							<li>Journey books</li>
							<li>Extra cloud storage</li>
							<li>Family vaults</li>
						</ul>
					</div>
				</div>
				<p className="mt-8 text-base text-text-secondary leading-relaxed">
					People don&apos;t pay to become viral. They pay to preserve their lives.
				</p>
			</section>

			<Divider />

			{/* ── Vision ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[680px] mx-auto">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					Vision
				</p>
				<div className="space-y-4 text-base text-text-secondary leading-relaxed">
					<p>Instagram became the place where people shared their lives.</p>
					<p className="font-semibold text-text-primary">
						Solus becomes the place where people keep them.
					</p>
					<p>
						Every meaningful moment. Every lesson. Every journey. Every
						version of yourself. Organized into one private timeline.
					</p>
					<p>
						Over years, Solus becomes something far more valuable than
						another app.
					</p>
					<p className="font-semibold text-text-primary">
						It becomes a person&apos;s digital autobiography.
					</p>
				</div>
			</section>

			<Divider />

			{/* ── Why Solus Wins ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[680px] mx-auto">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					Why Solus wins
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="p-6 rounded-[20px] bg-card border border-border">
						<p className="text-sm text-text-muted mb-2">
							Every major social platform
						</p>
						<p className="text-base font-semibold text-text-primary">
							Competes for attention.
						</p>
					</div>
					<div className="p-6 rounded-[20px] bg-card border border-accent/30">
						<p className="text-sm text-accent mb-2">Solus</p>
						<p className="text-base font-semibold text-text-primary">
							Competes for trust.
						</p>
					</div>
				</div>
				<div className="mt-8 space-y-2 text-base text-text-secondary leading-relaxed">
					<p>Attention is rented.</p>
					<p>Trust is earned.</p>
					<p className="font-semibold text-text-primary">
						And trust compounds.
					</p>
				</div>
			</section>

			<Divider />

			{/* ── Mission ── */}
			<section className="px-4 sm:px-6 py-24 sm:py-32 max-w-[680px] mx-auto">
				<p className="text-sm text-text-muted mb-4 tracking-wide">
					Our mission
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-text-primary mb-6">
					Technology should help people remember who they are.
				</h2>
				<p className="text-base text-text-secondary leading-relaxed mb-6">
					Not convince them to become someone else.
				</p>
				<p className="text-base text-text-secondary leading-relaxed mb-2">
					We are building a world where documenting your life no longer
					requires performing it.
				</p>
				<p className="text-lg font-semibold text-text-primary mt-6">
					We are building Solus.
				</p>
			</section>

			<Divider />

			{/* ── One-Line Pitch ── */}
			<section className="px-4 sm:px-6 py-20 sm:py-24 max-w-[680px] mx-auto text-center">
				<p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-[560px] mx-auto">
					Solus is the first personal social network — a private place to
					document your life without an audience, and share your story
					only when you&apos;re ready.
				</p>
				<div className="mt-10">
					<Link
						href="/"
						className="inline-flex h-11 px-6 items-center rounded-[12px] bg-text-primary text-background text-sm font-medium transition-opacity duration-200 ease-out hover:opacity-85"
					>
						Visit Solus
					</Link>
				</div>
			</section>

			{/* ── Footer ── */}
			<footer className="border-t border-border px-4 sm:px-6 py-8 max-w-[960px] mx-auto">
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
					<p className="text-xs text-text-muted">
						Live first. Share later.
					</p>
					<div className="flex items-center gap-4 text-xs text-text-muted">
						<a
							href="https://github.com/SH20RAJ/solus"
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

function Divider() {
	return (
		<div className="max-w-[680px] mx-auto px-4 sm:px-6">
			<div className="h-px bg-border" />
		</div>
	);
}
