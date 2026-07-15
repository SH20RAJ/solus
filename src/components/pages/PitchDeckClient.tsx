"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function PitchDeckClient() {
	const [activeSlide, setActiveSlide] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);

	const totalSlides = 7;

	// Keyboard navigation support
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight" || e.key === "Space") {
				setActiveSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
			} else if (e.key === "ArrowLeft") {
				setActiveSlide((prev) => (prev > 0 ? prev - 1 : prev));
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	// Listen to fullscreen changes
	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};
		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
	}, []);

	const handleToggleFullscreen = () => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch(() => {});
		} else {
			document.exitFullscreen().catch(() => {});
		}
	};

	const handlePrint = () => {
		window.print();
	};

	return (
		<div className="min-h-screen bg-[#09090B] text-white flex flex-col font-sans select-none overflow-x-hidden relative print:bg-black">
			{/* Style overrides for standard print-to-PDF formatting */}
			<style dangerouslySetInnerHTML={{ __html: `
				@media print {
					nav, header, footer, .controls-ui, .no-print {
						display: none !important;
					}
					body, html, #__next {
						background: black !important;
						color: white !important;
						width: 297mm !important;
						height: 210mm !important;
						overflow: hidden !important;
					}
					.slide-print-block {
						display: flex !important;
						page-break-after: always !important;
						break-after: page !important;
						height: 210mm !important;
						width: 297mm !important;
						padding: 20mm !important;
						box-sizing: border-box !important;
						position: relative !important;
						flex-direction: column !important;
						justify-content: center !important;
						background: black !important;
					}
				}
				@page {
					size: A4 landscape;
					margin: 0;
				}
			`}} />

			{/* Slide Manager Top Bar */}
			<header className="px-6 py-4 border-b border-border/10 flex items-center justify-between bg-card/10 backdrop-blur-md sticky top-0 z-50 no-print">
				<div className="flex items-center gap-3">
					<Link href="/pitch" className="flex items-center gap-2">
						<Image src="/logo.png" alt="logo" width={24} height={24} className="rounded-md" />
						<span className="text-xs font-bold tracking-wider uppercase font-mono text-text-muted hover:text-text-primary transition-all">Solus Deck</span>
					</Link>
					<span className="text-[10px] font-mono bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-accent uppercase">Investor Pitch</span>
				</div>

				<div className="flex items-center gap-3">
					<span className="text-[10px] font-mono text-text-muted hidden md:inline">
						Press Left/Right Arrow or Space
					</span>
					<button
						onClick={handlePrint}
						className="h-8 px-3 rounded-lg border border-border/30 bg-card hover:bg-surface/50 text-[10px] font-semibold font-mono tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5"
						title="Save presentation as PITCH.pdf using browser print preview"
					>
						<span>📥</span> Export PDF
					</button>
					<button
						onClick={handleToggleFullscreen}
						className="h-8 px-3 rounded-lg border border-border/30 bg-card hover:bg-surface/50 text-[10px] font-semibold font-mono tracking-wider uppercase transition-all cursor-pointer"
					>
						{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
					</button>
				</div>
			</header>

			{/* Slides Container */}
			<main className="flex-1 flex flex-col justify-center items-center p-4 md:p-8 print:p-0 print:block">
				{/* Slide 1: Cover Slide */}
				<div className={`slide-print-block w-full max-w-[960px] aspect-[16/10] bg-card/25 border border-border/20 rounded-3xl p-8 sm:p-16 flex flex-col justify-between backdrop-blur-md shadow-2xl relative overflow-hidden print:border-none print:bg-black print:rounded-none print:shadow-none ${activeSlide === 0 ? "flex" : "hidden print:flex"}`}>
					<div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-transparent pointer-events-none" />
					<div className="text-left space-y-4">
						<span className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent font-semibold bg-accent/5 border border-accent/20 px-3 py-1.5 rounded-full">
							Introducing Solus
						</span>
						<h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight font-serif mt-2">
							Live first.<br />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-300">Share later.</span>
						</h1>
					</div>

					<div className="border-t border-border/20 pt-8 mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h3 className="text-sm font-bold text-text-primary font-mono">The Personal Social Network</h3>
							<p className="text-xs text-text-muted mt-1 leading-normal max-w-sm">
								Document life privately, styled with the visual familiarity of modern social networks. Sharing is entirely optional.
							</p>
						</div>
						<div className="text-right">
							<span className="text-xs font-bold text-text-primary font-mono">Slide 01 // 07</span>
						</div>
					</div>
				</div>

				{/* Slide 2: Market Pain & Scientific Context */}
				<div className={`slide-print-block w-full max-w-[960px] aspect-[16/10] bg-card/25 border border-border/20 rounded-3xl p-8 sm:p-16 flex flex-col justify-between backdrop-blur-md shadow-2xl relative overflow-hidden print:border-none print:bg-black print:rounded-none print:shadow-none ${activeSlide === 1 ? "flex" : "hidden print:flex"}`}>
					<div className="text-left">
						<span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">02 // The Market Pain</span>
						<h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white font-serif mt-2">
							The Validation Loop Toll
						</h2>
						<p className="text-xs text-text-muted mt-2 leading-relaxed max-w-xl">
							Social networks force a performance loop: curating photos for validation clicks rather than preserving raw memories.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
						<div className="p-5 rounded-2xl bg-card border border-border/20 text-left relative overflow-hidden group">
							<div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
							<span className="block text-3xl font-extrabold text-white font-mono tracking-tight">16.1%</span>
							<h4 className="text-[11px] font-bold text-text-primary font-mono mt-2 uppercase tracking-wide">Anxiety reduction</h4>
							<p className="text-[10px] text-text-muted mt-1 leading-normal">Observed in clinical studies when users stop social validation routines for a single week.</p>
						</div>

						<div className="p-5 rounded-2xl bg-card border border-border/20 text-left relative overflow-hidden group">
							<div className="absolute top-0 left-0 w-1.5 h-full bg-[#38bdf8]" />
							<span className="block text-3xl font-extrabold text-white font-mono tracking-tight">24.8%</span>
							<h4 className="text-[11px] font-bold text-text-primary font-mono mt-2 uppercase tracking-wide">Depression decrease</h4>
							<p className="text-[10px] text-text-muted mt-1 leading-normal">Recorded drop in depressive symptoms when social metrics and feedback triggers are paused.</p>
						</div>

						<div className="p-5 rounded-2xl bg-card border border-border/20 text-left relative overflow-hidden group">
							<div className="absolute top-0 left-0 w-1.5 h-full bg-[#34d399]" />
							<span className="block text-3xl font-extrabold text-white font-mono tracking-tight">86.0%</span>
							<h4 className="text-[11px] font-bold text-text-primary font-mono mt-2 uppercase tracking-wide">Audience Pressure</h4>
							<p className="text-[10px] text-text-muted mt-1 leading-normal">Of young adults report feeling intense, constant pressure to curate their profiles for observers.</p>
						</div>
					</div>

					<div className="flex justify-between items-center text-[10px] font-mono text-text-muted border-t border-border/10 pt-4">
						<span>Clinical study references: World Health Organization & NIH</span>
						<span>Slide 02 // 07</span>
					</div>
				</div>

				{/* Slide 3: The Solution */}
				<div className={`slide-print-block w-full max-w-[960px] aspect-[16/10] bg-card/25 border border-border/20 rounded-3xl p-8 sm:p-16 flex flex-col justify-between backdrop-blur-md shadow-2xl relative overflow-hidden print:border-none print:bg-black print:rounded-none print:shadow-none ${activeSlide === 2 ? "flex" : "hidden print:flex"}`}>
					<div className="text-left">
						<span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">03 // Our Solution</span>
						<h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white font-serif mt-2">
							The Quiet Social Shell
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-auto">
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<span className="text-lg">🔒</span>
								<div>
									<h4 className="text-xs font-bold text-text-primary font-mono uppercase tracking-wide">Privacy is Default</h4>
									<p className="text-xs text-text-muted mt-1 leading-relaxed">No likes, no followers, and no comments. Memories are saved strictly for personal introspection.</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<span className="text-lg">🤳</span>
								<div>
									<h4 className="text-xs font-bold text-text-primary font-mono uppercase tracking-wide">Familiar Visual Formats</h4>
									<p className="text-xs text-text-muted mt-1 leading-relaxed">Styled like modern feeds, postcards, and 24h stories, making digital archiving effortless and highly intuitive.</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<span className="text-lg">🔗</span>
								<div>
									<h4 className="text-xs font-bold text-text-primary font-mono uppercase tracking-wide">Selective Sharing</h4>
									<p className="text-xs text-text-muted mt-1 leading-relaxed">Easily export selective diary memories as clean, public web links only when you want to invite others.</p>
								</div>
							</div>
						</div>

						<div className="rounded-2xl border border-border/20 bg-surface/20 p-6 flex flex-col justify-center text-center backdrop-blur-sm relative">
							<div className="text-4xl mb-3">📓</div>
							<blockquote className="text-sm font-serif italic text-text-secondary leading-relaxed">
								&ldquo;A digital sanctuary that helps users record their lives without a performing stage. Reflection over attention.&rdquo;
							</blockquote>
						</div>
					</div>

					<div className="flex justify-between items-center text-[10px] font-mono text-text-muted border-t border-border/10 pt-4">
						<span>Solus Product Principles</span>
						<span>Slide 03 // 07</span>
					</div>
				</div>

				{/* Slide 4: System Architecture */}
				<div className={`slide-print-block w-full max-w-[960px] aspect-[16/10] bg-card/25 border border-border/20 rounded-3xl p-8 sm:p-16 flex flex-col justify-between backdrop-blur-md shadow-2xl relative overflow-hidden print:border-none print:bg-black print:rounded-none print:shadow-none ${activeSlide === 3 ? "flex" : "hidden print:flex"}`}>
					<div className="text-left">
						<span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">04 // Product Architecture</span>
						<h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white font-serif mt-2">
							Secure Flow Pipeline
						</h2>
					</div>

					<div className="my-auto py-4">
						<div className="grid grid-cols-4 gap-3 text-center">
							<div className="p-4 rounded-xl border border-border/20 bg-card">
								<span className="text-2xl block">📱</span>
								<h4 className="text-[10px] font-mono uppercase tracking-wider font-bold mt-2 text-white">Client Device</h4>
								<p className="text-[9px] text-text-muted mt-1 leading-normal">Google Social auth & uploads text/media content.</p>
							</div>
							<div className="p-4 rounded-xl border border-border/20 bg-card">
								<span className="text-2xl block">🛡️</span>
								<h4 className="text-[10px] font-mono uppercase tracking-wider font-bold mt-2 text-white">Better Auth</h4>
								<p className="text-[9px] text-text-muted mt-1 leading-normal">Generates session tokens and secures database writes.</p>
							</div>
							<div className="p-4 rounded-xl border border-border/20 bg-card">
								<span className="text-2xl block">📦</span>
								<h4 className="text-[10px] font-mono uppercase tracking-wider font-bold mt-2 text-white">R2 Storage</h4>
								<p className="text-[9px] text-text-muted mt-1 leading-normal">Handles raw media binary files via presigned S3 URLs.</p>
							</div>
							<div className="p-4 rounded-xl border border-border/20 bg-card">
								<span className="text-2xl block">🗄️</span>
								<h4 className="text-[10px] font-mono uppercase tracking-wider font-bold mt-2 text-white">PostgreSQL DB</h4>
								<p className="text-[9px] text-text-muted mt-1 leading-normal">Stores metadata, tags, mood indexes via Drizzle ORM.</p>
							</div>
						</div>

						{/* Connectors flow visualization */}
						<div className="hidden md:flex justify-around items-center px-8 mt-4 text-text-muted/40 font-mono text-[10px]">
							<span>Google Sign-In ───▶</span>
							<span>Secure Session ───▶</span>
							<span>S3 Presigned ───▶</span>
							<span>Drizzle Write</span>
						</div>
					</div>

					<div className="flex justify-between items-center text-[10px] font-mono text-text-muted border-t border-border/10 pt-4">
						<span>Security Sandbox Integration Flow</span>
						<span>Slide 04 // 07</span>
					</div>
				</div>

				{/* Slide 5: Competitive Advantage */}
				<div className={`slide-print-block w-full max-w-[960px] aspect-[16/10] bg-card/25 border border-border/20 rounded-3xl p-8 sm:p-16 flex flex-col justify-between backdrop-blur-md shadow-2xl relative overflow-hidden print:border-none print:bg-black print:rounded-none print:shadow-none ${activeSlide === 4 ? "flex" : "hidden print:flex"}`}>
					<div className="text-left">
						<span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">05 // Market Positioning</span>
						<h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white font-serif mt-2">
							Competitive Matrix
						</h2>
					</div>

					<div className="my-auto overflow-hidden border border-border/20 rounded-2xl bg-card/40">
						<table className="w-full text-left border-collapse text-xs font-mono">
							<thead>
								<tr className="border-b border-border/20 bg-surface/30 text-text-primary">
									<th className="p-3 font-semibold">Features</th>
									<th className="p-3 font-semibold text-accent text-center">Solus</th>
									<th className="p-3 font-semibold text-center">Instagram</th>
									<th className="p-3 font-semibold text-center">Day One (Diary)</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border/10 text-text-secondary">
								<tr>
									<td className="p-3 font-sans font-medium text-white">Social Engagement Loops</td>
									<td className="p-3 text-center text-emerald-400">❌ None (Private)</td>
									<td className="p-3 text-center text-red-400">⚠️ Core Hook</td>
									<td className="p-3 text-center text-emerald-400">❌ None (Private)</td>
								</tr>
								<tr>
									<td className="p-3 font-sans font-medium text-white">Familiar Feed / UI Layout</td>
									<td className="p-3 text-center text-emerald-400">✅ Modern Feed</td>
									<td className="p-3 text-center text-emerald-400">✅ Modern Feed</td>
									<td className="p-3 text-center text-red-400">❌ Plain list list</td>
								</tr>
								<tr>
									<td className="p-3 font-sans font-medium text-white">Integrated Voice Notes</td>
									<td className="p-3 text-center text-emerald-400">✅ Built-in</td>
									<td className="p-3 text-center text-red-400">⚠️ Group chat only</td>
									<td className="p-3 text-center text-red-400">⚠️ Premium only</td>
								</tr>
								<tr>
									<td className="p-3 font-sans font-medium text-white">Selective Web Export</td>
									<td className="p-3 text-center text-emerald-400">✅ Opt-in Link</td>
									<td className="p-3 text-center text-red-400">⚠️ Forced public</td>
									<td className="p-3 text-center text-red-400">❌ App locked</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="flex justify-between items-center text-[10px] font-mono text-text-muted border-t border-border/10 pt-4">
						<span>Competitive Landscape Comparison</span>
						<span>Slide 05 // 07</span>
					</div>
				</div>

				{/* Slide 6: Business Model */}
				<div className={`slide-print-block w-full max-w-[960px] aspect-[16/10] bg-card/25 border border-border/20 rounded-3xl p-8 sm:p-16 flex flex-col justify-between backdrop-blur-md shadow-2xl relative overflow-hidden print:border-none print:bg-black print:rounded-none print:shadow-none ${activeSlide === 5 ? "flex" : "hidden print:flex"}`}>
					<div className="text-left">
						<span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">06 // Business Model</span>
						<h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white font-serif mt-2">
							Subscription Architecture
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
						<div className="p-6 rounded-2xl border border-border/20 bg-card/30 text-left">
							<span className="text-xs font-mono uppercase text-text-muted font-bold">Free Plan</span>
							<h3 className="text-xl font-bold text-white mt-1">Private Archiving</h3>
							<ul className="text-xs text-text-secondary mt-3 space-y-2 font-mono">
								<li>• Unlimited personal feed postings</li>
								<li>• Local location & mood check-ins</li>
								<li>• Dynamic 24h stories uploads</li>
								<li>• Private folder locker manager</li>
							</ul>
						</div>

						<div className="p-6 rounded-2xl border border-accent/40 bg-accent/[0.02] text-left relative">
							<div className="absolute top-4 right-4 bg-accent/15 border border-accent/30 text-accent text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
								Premium
							</div>
							<span className="text-xs font-mono uppercase text-accent font-bold">Paid Tier ($4.99/mo)</span>
							<h3 className="text-xl font-bold text-white mt-1">Cognitive Copilot</h3>
							<ul className="text-xs text-text-secondary mt-3 space-y-2 font-mono">
								<li>• <strong className="text-accent font-semibold">Lyra Assistant</strong> (AI journaling copilot)</li>
								<li>• Automatic memory compilation & highlight sorting</li>
								<li>• Private database backups & cloud vaults</li>
								<li>• PDF Journal book layout exports</li>
							</ul>
						</div>
					</div>

					<div className="flex justify-between items-center text-[10px] font-mono text-text-muted border-t border-border/10 pt-4">
						<span>Subscription monetization strategy</span>
						<span>Slide 06 // 07</span>
					</div>
				</div>

				{/* Slide 7: Technology Stack */}
				<div className={`slide-print-block w-full max-w-[960px] aspect-[16/10] bg-card/25 border border-border/20 rounded-3xl p-8 sm:p-16 flex flex-col justify-between backdrop-blur-md shadow-2xl relative overflow-hidden print:border-none print:bg-black print:rounded-none print:shadow-none ${activeSlide === 6 ? "flex" : "hidden print:flex"}`}>
					<div className="text-left">
						<span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">07 // Technology Stack</span>
						<h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white font-serif mt-2">
							Solid & Modern Stack
						</h2>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-auto text-left">
						<div className="p-4 rounded-xl border border-border/10 bg-card/20">
							<h4 className="text-xs font-bold text-accent font-mono">Frontend</h4>
							<p className="text-sm font-semibold text-white mt-1">Next.js 16</p>
							<p className="text-[9px] text-text-muted mt-1 leading-normal font-mono">React 19, Turbopack, App Router structure</p>
						</div>

						<div className="p-4 rounded-xl border border-border/10 bg-card/20">
							<h4 className="text-xs font-bold text-[#38bdf8] font-mono">Database</h4>
							<p className="text-sm font-semibold text-white mt-1">Neon Postgres</p>
							<p className="text-[9px] text-text-muted mt-1 leading-normal font-mono">Serverless Postgres, Drizzle ORM queries</p>
						</div>

						<div className="p-4 rounded-xl border border-border/10 bg-card/20">
							<h4 className="text-xs font-bold text-[#34d399] font-mono">Storage</h4>
							<p className="text-sm font-semibold text-white mt-1">Cloudflare R2</p>
							<p className="text-[9px] text-text-muted mt-1 leading-normal font-mono">S3 API compatible serverless blob uploads</p>
						</div>

						<div className="p-4 rounded-xl border border-border/10 bg-card/20">
							<h4 className="text-xs font-bold text-amber-400 font-mono">Security</h4>
							<p className="text-sm font-semibold text-white mt-1">Better Auth</p>
							<p className="text-[9px] text-text-muted mt-1 leading-normal font-mono">Session token verification server-side</p>
						</div>
					</div>

					<div className="flex justify-between items-center text-[10px] font-mono text-text-muted border-t border-border/10 pt-4">
						<span>Engineering design overview</span>
						<span>Slide 07 // 07</span>
					</div>
				</div>
			</main>

			{/* Slide Manager Navigation Controls */}
			<footer className="px-6 py-4 border-t border-border/10 flex items-center justify-between bg-card/10 backdrop-blur-md sticky bottom-0 z-50 no-print">
				<button
					onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : prev))}
					disabled={activeSlide === 0}
					className={`h-9 px-4 rounded-xl text-xs font-semibold font-mono tracking-wider uppercase border border-border/20 transition-all cursor-pointer ${
						activeSlide === 0
							? "opacity-40 cursor-not-allowed"
							: "bg-card hover:bg-surface/50 text-white"
					}`}
				>
					◀ Prev Slide
				</button>

				{/* Progress Dots */}
				<div className="flex items-center gap-2">
					{Array.from({ length: totalSlides }).map((_, idx) => (
						<button
							key={idx}
							onClick={() => setActiveSlide(idx)}
							className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
								activeSlide === idx
									? "bg-accent scale-110 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
									: "bg-border/40 hover:bg-border/60"
							}`}
							title={`Slide ${idx + 1}`}
						/>
					))}
				</div>

				<button
					onClick={() => setActiveSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev))}
					disabled={activeSlide === totalSlides - 1}
					className={`h-9 px-4 rounded-xl text-xs font-semibold font-mono tracking-wider uppercase border border-border/20 transition-all cursor-pointer ${
						activeSlide === totalSlides - 1
							? "opacity-40 cursor-not-allowed"
							: "bg-card hover:bg-surface/50 text-white"
					}`}
				>
					Next Slide ▶
				</button>
			</footer>
		</div>
	);
}
