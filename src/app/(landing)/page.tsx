import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Solus — Leave everyone. Don't leave yourself.",
	description:
		"A private social network where you document your life without an audience and share your story only when you're ready. No followers, no likes, no algorithms — just your memories.",
	keywords: [
		"private social network",
		"personal journal",
		"digital detox",
		"private memories",
		"life documentation",
		"solus",
	],
	openGraph: {
		title: "Solus — Leave everyone. Don't leave yourself.",
		description:
			"A private social network where you document your life without an audience.",
		type: "website",
		url: "https://solus.shraj.workers.dev",
	},
	twitter: {
		card: "summary_large_image",
		title: "Solus — Leave everyone. Don't leave yourself.",
		description:
			"A private social network where you document your life without an audience.",
	},
};

/* ─── Icon Components ─── */

function ShieldIcon() {
	return (
		<svg
			className="w-7 h-7"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
			/>
		</svg>
	);
}

function CameraIcon() {
	return (
		<svg
			className="w-7 h-7"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
			/>
		</svg>
	);
}

function ClockIcon() {
	return (
		<svg
			className="w-7 h-7"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
			/>
		</svg>
	);
}

function ShareIcon() {
	return (
		<svg
			className="w-7 h-7"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Z"
			/>
		</svg>
	);
}

function HeartIcon() {
	return (
		<svg
			className="w-7 h-7"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
			/>
		</svg>
	);
}

function SparklesIcon() {
	return (
		<svg
			className="w-7 h-7"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
			/>
		</svg>
	);
}

function MapIcon() {
	return (
		<svg
			className="w-6 h-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
			/>
		</svg>
	);
}

function RocketIcon() {
	return (
		<svg
			className="w-6 h-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
			/>
		</svg>
	);
}

function BookIcon() {
	return (
		<svg
			className="w-6 h-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
			/>
		</svg>
	);
}

function MusicIcon() {
	return (
		<svg
			className="w-6 h-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V4.846A2.25 2.25 0 0 0 17.25 2.7l-6.38 1.823a2.25 2.25 0 0 0-1.632 2.163v8.326M6.75 19.5a2.25 2.25 0 0 1-2.25-2.25V9.387a2.25 2.25 0 0 1 1.632-2.163l1.32-.377"
			/>
		</svg>
	);
}

function BabyIcon() {
	return (
		<svg
			className="w-6 h-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
			/>
		</svg>
	);
}

function FitnessIcon() {
	return (
		<svg
			className="w-6 h-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
			/>
		</svg>
	);
}

function HealIcon() {
	return (
		<svg
			className="w-6 h-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
			/>
		</svg>
	);
}

/* ─── Landing Page ─── */

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-[#050507] text-white overflow-hidden">
			{/* ── Ambient Background ── */}
			<div className="fixed inset-0 pointer-events-none z-0">
				<div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse-slow" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[100px] animate-pulse-slow animation-delay-2000" />
				<div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-cyan-500/6 blur-[80px] animate-pulse-slow animation-delay-4000" />
			</div>

			{/* ── Nav ── */}
			<nav className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-6 max-w-7xl mx-auto">
				<div className="flex items-center gap-3">
					<div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-violet-500/25">
						S
					</div>
					<span className="text-xl font-semibold tracking-tight">Solus</span>
				</div>
				<div className="hidden sm:flex items-center gap-8 text-sm text-white/50">
					<a href="#features" className="hover:text-white transition-colors duration-300">Features</a>
					<a href="#use-cases" className="hover:text-white transition-colors duration-300">Use Cases</a>
					<a href="#philosophy" className="hover:text-white transition-colors duration-300">Philosophy</a>
				</div>
				<a
					href="https://github.com/SH20RAJ/solus"
					target="_blank"
					rel="noopener noreferrer"
					className="text-sm text-white/40 hover:text-white transition-colors duration-300 border border-white/10 px-4 py-2 rounded-full hover:border-white/25"
				>
					GitHub →
				</a>
			</nav>

			{/* ── Hero ── */}
			<section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-32 sm:pt-32 sm:pb-40 max-w-5xl mx-auto">
				<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-white/50 mb-8 backdrop-blur-sm animate-fade-in">
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
					A new kind of social network
				</div>

				<h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] animate-fade-in-up">
					<span className="block">Leave everyone.</span>
					<span className="block mt-2 bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
						Don&apos;t leave yourself.
					</span>
				</h1>

				<p className="mt-8 text-lg sm:text-xl text-white/45 max-w-2xl leading-relaxed animate-fade-in-up animation-delay-200">
					A private social network where you document your life without an audience — and share your story only when you&apos;re ready.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 mt-12 animate-fade-in-up animation-delay-400">
					<button
						id="hero-cta-primary"
						className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-base transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.35)] hover:scale-105 cursor-pointer"
					>
						<span className="relative z-10">Start Your Journey</span>
						<div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
					</button>
					<a
						id="hero-cta-secondary"
						href="#features"
						className="px-8 py-4 rounded-full border border-white/10 text-white/70 font-medium text-base transition-all duration-300 hover:border-white/25 hover:text-white hover:bg-white/[0.03]"
					>
						Learn More ↓
					</a>
				</div>

				{/* Scroll indicator */}
				<div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
					<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
					</svg>
				</div>
			</section>

			{/* ── The Problem ── */}
			<section className="relative z-10 px-6 py-24 sm:py-32 max-w-6xl mx-auto">
				<div className="text-center mb-16">
					<p className="text-sm uppercase tracking-[0.2em] text-violet-400/70 mb-4 animate-fade-in">The Problem</p>
					<h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
						Social media broke<br />
						<span className="text-white/40">self-expression.</span>
					</h2>
				</div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{[
						{ emoji: "👍", text: "Will this get likes?" },
						{ emoji: "📸", text: "Is this aesthetic enough?" },
						{ emoji: "👀", text: "What will people think?" },
						{ emoji: "🤔", text: "Should I even post this?" },
					].map((item, i) => (
						<div
							key={i}
							className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500"
							style={{ animationDelay: `${i * 100}ms` }}
						>
							<span className="text-3xl mb-4 block">{item.emoji}</span>
							<p className="text-white/60 text-sm leading-relaxed italic">&ldquo;{item.text}&rdquo;</p>
						</div>
					))}
				</div>

				<p className="mt-12 text-center text-white/35 max-w-xl mx-auto text-base leading-relaxed">
					People stopped living moments naturally and started creating moments for social media. There was no product that lets you document your life without an audience.
				</p>
			</section>

			{/* ── Divider ── */}
			<div className="max-w-6xl mx-auto px-6">
				<div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
			</div>

			{/* ── Features ── */}
			<section id="features" className="relative z-10 px-6 py-24 sm:py-32 max-w-6xl mx-auto">
				<div className="text-center mb-16">
					<p className="text-sm uppercase tracking-[0.2em] text-indigo-400/70 mb-4">The Solution</p>
					<h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
						Everything you love about<br />
						<span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">social media.</span>{" "}
						<span className="text-white/40">Minus the audience.</span>
					</h2>
				</div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{[
						{
							icon: <ShieldIcon />,
							title: "Private by Default",
							desc: "Nobody can discover, follow, like, comment, or message. Your timeline is yours alone.",
							gradient: "from-violet-500/20 to-violet-600/5",
						},
						{
							icon: <CameraIcon />,
							title: "Post Freely",
							desc: "Photos, videos, captions, stories — everything works like the social media you know.",
							gradient: "from-indigo-500/20 to-indigo-600/5",
						},
						{
							icon: <ClockIcon />,
							title: "Time Capsules",
							desc: "Post today, unlock after 30 days, 1 year, or even 10 years. Letters to your future self.",
							gradient: "from-cyan-500/20 to-cyan-600/5",
						},
						{
							icon: <ShareIcon />,
							title: "Share When Ready",
							desc: "Publish a single post, a journey, or your whole profile. Sharing is always optional.",
							gradient: "from-emerald-500/20 to-emerald-600/5",
						},
						{
							icon: <HeartIcon />,
							title: "Journey Mode",
							desc: "Group posts into themed journeys like \"30 Days in Ladakh\" or \"Building My Startup.\"",
							gradient: "from-rose-500/20 to-rose-600/5",
						},
						{
							icon: <SparklesIcon />,
							title: "Scheduled Publishing",
							desc: "Set a future date. Until then, visitors see \"This page will become public on [date].\"",
							gradient: "from-amber-500/20 to-amber-600/5",
						},
					].map((feature, i) => (
						<div
							key={i}
							className={`group relative p-7 rounded-2xl border border-white/[0.06] bg-gradient-to-b ${feature.gradient} backdrop-blur-sm hover:border-white/10 transition-all duration-500 hover:-translate-y-1`}
						>
							<div className="text-white/70 mb-5 group-hover:text-white transition-colors duration-300">
								{feature.icon}
							</div>
							<h3 className="text-lg font-semibold mb-2 tracking-tight">{feature.title}</h3>
							<p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
						</div>
					))}
				</div>
			</section>

			{/* ── How It Works ── */}
			<section className="relative z-10 px-6 py-24 sm:py-32 max-w-5xl mx-auto">
				<div className="text-center mb-16">
					<p className="text-sm uppercase tracking-[0.2em] text-cyan-400/70 mb-4">How It Works</p>
					<h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
						Three simple steps.
					</h2>
				</div>

				<div className="grid sm:grid-cols-3 gap-8">
					{[
						{
							step: "01",
							title: "Capture",
							desc: "Post photos, videos, stories, and thoughts. Just like you always have — without thinking about an audience.",
						},
						{
							step: "02",
							title: "Reflect",
							desc: "Build a personal timeline. Revisit memories. Write letters to your future self. Discover patterns in your life.",
						},
						{
							step: "03",
							title: "Share (Optional)",
							desc: "When your journey is complete, publish it as a story. Or keep it private forever. The choice is always yours.",
						},
					].map((item, i) => (
						<div key={i} className="relative text-center sm:text-left">
							<span className="text-6xl sm:text-7xl font-black text-white/[0.03] absolute -top-4 -left-2 select-none">
								{item.step}
							</span>
							<div className="relative pt-8">
								<h3 className="text-xl font-semibold mb-3 tracking-tight">{item.title}</h3>
								<p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* ── Divider ── */}
			<div className="max-w-6xl mx-auto px-6">
				<div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
			</div>

			{/* ── Use Cases ── */}
			<section id="use-cases" className="relative z-10 px-6 py-24 sm:py-32 max-w-6xl mx-auto">
				<div className="text-center mb-16">
					<p className="text-sm uppercase tracking-[0.2em] text-violet-400/70 mb-4">Use Cases</p>
					<h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
						For people who<br />
						<span className="text-white/40">live deliberately.</span>
					</h2>
				</div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{[
						{ icon: <MapIcon />, title: "Solo Travelers", desc: "Document a 45-day Nepal trip privately. Publish \"45 Days Across Nepal\" later.", color: "text-violet-400" },
						{ icon: <RocketIcon />, title: "Founders", desc: "Record wins, failures, product shots. Publish \"Building XYZ from Day 1\" at launch.", color: "text-indigo-400" },
						{ icon: <FitnessIcon />, title: "Fitness Journeys", desc: "Daily selfies, weight, meals. Publish \"Lost 30 kg\" after 6 months.", color: "text-cyan-400" },
						{ icon: <BookIcon />, title: "Students", desc: "Track UPSC/JEE prep privately. Publish the journey after selection.", color: "text-emerald-400" },
						{ icon: <MusicIcon />, title: "Learners", desc: "Piano Day 1 → Day 300. One beautiful timeline of growth.", color: "text-amber-400" },
						{ icon: <BabyIcon />, title: "Parents", desc: "Baby milestones — private forever, or publish after years.", color: "text-rose-400" },
						{ icon: <HealIcon />, title: "Healing", desc: "Private voice notes & thoughts. Publish \"365 Days After\" when ready.", color: "text-purple-400" },
						{ icon: <HeartIcon />, title: "Digital Detox", desc: "Delete Instagram for 30 days. Document your life on Solus instead.", color: "text-pink-400" },
					].map((item, i) => (
						<div
							key={i}
							className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500 group"
						>
							<div className={`${item.color} mb-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300`}>
								{item.icon}
							</div>
							<h3 className="text-sm font-semibold mb-1.5">{item.title}</h3>
							<p className="text-white/35 text-xs leading-relaxed">{item.desc}</p>
						</div>
					))}
				</div>
			</section>

			{/* ── Philosophy ── */}
			<section id="philosophy" className="relative z-10 px-6 py-24 sm:py-32 max-w-5xl mx-auto">
				<div className="text-center mb-16">
					<p className="text-sm uppercase tracking-[0.2em] text-indigo-400/70 mb-4">Philosophy</p>
					<h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
						Instagram vs. Solus
					</h2>
				</div>

				<div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
					{/* Instagram */}
					<div className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
						<h3 className="text-lg font-semibold mb-6 text-white/40">Instagram</h3>
						<ul className="space-y-4 text-sm text-white/35">
							<li className="flex items-center gap-3">
								<span className="w-1.5 h-1.5 rounded-full bg-white/20" />
								Designed for attention
							</li>
							<li className="flex items-center gap-3">
								<span className="w-1.5 h-1.5 rounded-full bg-white/20" />
								Rewards engagement
							</li>
							<li className="flex items-center gap-3">
								<span className="w-1.5 h-1.5 rounded-full bg-white/20" />
								Public by default
							</li>
							<li className="flex items-center gap-3">
								<span className="w-1.5 h-1.5 rounded-full bg-white/20" />
								Share your life
							</li>
							<li className="flex items-center gap-3">
								<span className="w-1.5 h-1.5 rounded-full bg-white/20" />
								&ldquo;What will people think?&rdquo;
							</li>
						</ul>
					</div>

					{/* Solus */}
					<div className="p-8 rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-500/[0.08] to-transparent">
						<h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Solus</h3>
						<ul className="space-y-4 text-sm text-white/60">
							<li className="flex items-center gap-3">
								<span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
								Designed for reflection
							</li>
							<li className="flex items-center gap-3">
								<span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
								Rewards authenticity
							</li>
							<li className="flex items-center gap-3">
								<span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
								Private by default
							</li>
							<li className="flex items-center gap-3">
								<span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
								Keep your life
							</li>
							<li className="flex items-center gap-3">
								<span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
								&ldquo;What do you think?&rdquo;
							</li>
						</ul>
					</div>
				</div>
			</section>

			{/* ── Principles Strip ── */}
			<section className="relative z-10 px-6 py-16 max-w-6xl mx-auto">
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
							className="px-5 py-2.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-white/40 text-sm hover:border-white/15 hover:text-white/60 transition-all duration-300"
						>
							{principle}
						</span>
					))}
				</div>
			</section>

			{/* ── Final CTA ── */}
			<section className="relative z-10 px-6 py-24 sm:py-32 max-w-4xl mx-auto text-center">
				<div className="p-12 sm:p-16 rounded-3xl border border-white/[0.06] bg-gradient-to-b from-violet-500/[0.06] to-transparent backdrop-blur-sm">
					<h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
						Your life.<br />
						<span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Your story.</span>
					</h2>
					<p className="text-white/40 text-base max-w-lg mx-auto mb-10 leading-relaxed">
						Solus is a private social network where you can document your life without an audience and choose to share your story only when you&apos;re ready.
					</p>
					<button
						id="cta-final"
						className="group relative px-10 py-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-base transition-all duration-300 hover:shadow-[0_0_50px_rgba(124,58,237,0.4)] hover:scale-105 cursor-pointer"
					>
						<span className="relative z-10">Begin Your Journey</span>
					</button>
				</div>
			</section>

			{/* ── Footer ── */}
			<footer className="relative z-10 border-t border-white/[0.06] px-6 py-12 max-w-6xl mx-auto">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-6">
					<div className="flex items-center gap-3">
						<div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-xs">
							S
						</div>
						<span className="text-sm font-medium text-white/60">Solus</span>
					</div>
					<p className="text-xs text-white/25">
						The internet taught us to perform for others. It&apos;s time to live for ourselves.
					</p>
					<div className="flex items-center gap-6 text-xs text-white/30">
						<a href="https://github.com/SH20RAJ/solus" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">GitHub</a>
						<span>© {new Date().getFullYear()} Solus</span>
					</div>
				</div>
			</footer>
		</div>
	);
}
