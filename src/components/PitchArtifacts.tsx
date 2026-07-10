"use client";

import { useState } from "react";

type TabType = "architecture" | "matrix" | "tech";

export default function PitchArtifacts() {
	const [activeTab, setActiveTab] = useState<TabType>("architecture");
	const [hoveredNode, setHoveredNode] = useState<string | null>(null);

	return (
		<div className="w-full bg-[#0c0c0e] border border-border/30 rounded-[24px] overflow-hidden shadow-2xl select-none font-sans">
			{/* Claude-like Artifact Header */}
			<div className="flex items-center justify-between px-5 py-4 border-b border-border/20 bg-card/60">
				<div className="flex items-center gap-3">
					<div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
					<span className="text-xs font-mono font-medium text-text-secondary">
						solus_pitch_deck.md
					</span>
				</div>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => setActiveTab("architecture")}
						className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
							activeTab === "architecture"
								? "bg-accent/10 text-accent font-semibold border border-accent/20"
								: "text-text-muted hover:text-text-primary"
						}`}
					>
						Architecture
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("matrix")}
						className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
							activeTab === "matrix"
								? "bg-accent/10 text-accent font-semibold border border-accent/20"
								: "text-text-muted hover:text-text-primary"
						}`}
					>
						Matrix
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("tech")}
						className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
							activeTab === "tech"
								? "bg-accent/10 text-accent font-semibold border border-accent/20"
								: "text-text-muted hover:text-text-primary"
						}`}
					>
						Stack
					</button>
				</div>
			</div>

			{/* Preview Panel Body */}
			<div className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-between">
				{activeTab === "architecture" && (
					<div className="space-y-6 animate-fade-in">
						<div className="text-center sm:text-left">
							<h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider font-mono">
								System Architecture Flow
							</h3>
							<p className="text-xs text-text-muted mt-1">
								How Solus handles authentication, entry uploads, and private storage securely.
							</p>
						</div>

						{/* Interactive SVG / Nodes */}
						<div className="relative py-4 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
							{/* Node 1 */}
							<div
								onMouseEnter={() => setHoveredNode("client")}
								onMouseLeave={() => setHoveredNode(null)}
								className={`p-4 rounded-2xl border text-center transition-all duration-300 ${
									hoveredNode === "client"
										? "bg-accent/5 border-accent scale-105 shadow-md shadow-accent/5"
										: "bg-card/40 border-border/40"
								}`}
							>
								<div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center mx-auto mb-2 text-xs font-bold font-mono">
									01
								</div>
								<h4 className="text-xs font-semibold text-text-primary">Client App</h4>
								<p className="text-[10px] text-text-muted mt-1 leading-relaxed">
									Reflections, Voice Notes, and Stories collected in browser.
								</p>
							</div>

							{/* Connection Arrow 1 */}
							<div className="hidden sm:block absolute left-[31%] top-1/2 -translate-y-1/2 w-[8%] border-t border-dashed border-border/50 text-center text-text-muted text-[10px] font-mono">
								➜
							</div>

							{/* Node 2 */}
							<div
								onMouseEnter={() => setHoveredNode("server")}
								onMouseLeave={() => setHoveredNode(null)}
								className={`p-4 rounded-2xl border text-center transition-all duration-300 ${
									hoveredNode === "server"
										? "bg-accent/5 border-accent scale-105 shadow-md shadow-accent/5"
										: "bg-card/40 border-border/40"
								}`}
							>
								<div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center mx-auto mb-2 text-xs font-bold font-mono">
									02
								</div>
								<h4 className="text-xs font-semibold text-text-primary">Server Actions</h4>
								<p className="text-[10px] text-text-muted mt-1 leading-relaxed">
									Hono API & Better Auth validations running on Cloudflare.
								</p>
							</div>

							{/* Connection Arrow 2 */}
							<div className="hidden sm:block absolute left-[64%] top-1/2 -translate-y-1/2 w-[8%] border-t border-dashed border-border/50 text-center text-text-muted text-[10px] font-mono">
								➜
							</div>

							{/* Node 3 */}
							<div
								onMouseEnter={() => setHoveredNode("storage")}
								onMouseLeave={() => setHoveredNode(null)}
								className={`p-4 rounded-2xl border text-center transition-all duration-300 ${
									hoveredNode === "storage"
										? "bg-accent/5 border-accent scale-105 shadow-md shadow-accent/5"
										: "bg-card/40 border-border/40"
								}`}
							>
								<div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center mx-auto mb-2 text-xs font-bold font-mono">
									03
								</div>
								<h4 className="text-xs font-semibold text-text-primary">Secure Storage</h4>
								<p className="text-[10px] text-text-muted mt-1 leading-relaxed">
									Neon Postgres DB (Drizzle) + Cloudflare R2 media bucket.
								</p>
							</div>
						</div>

						{/* Dynamic Explainer Alert */}
						<div className="p-4 rounded-2xl bg-card border border-border/25 min-h-[70px] flex items-center text-xs text-text-secondary leading-relaxed transition-all duration-300">
							{hoveredNode === "client" && (
								<span>
									🔒 **Client Layer**: Encrypted local states handle double-taps, voice recording, and files drops, preparing request payloads for secure dispatch.
								</span>
							)}
							{hoveredNode === "server" && (
								<span>
									🛡️ **Server Actions**: Direct secure bindings prevent API keys exposure on the client. Auth verification checks sessions server-side.
								</span>
							)}
							{hoveredNode === "storage" && (
								<span>
									💾 **Storage Layer**: Your journal records reside inside an isolated Neon DB. Media assets are uploaded to Cloudflare R2 using pre-signed headers.
								</span>
							)}
							{!hoveredNode && (
								<span className="text-text-muted italic">
									Hover over any node in the architecture to view technical details.
								</span>
							)}
						</div>
					</div>
				)}

				{activeTab === "matrix" && (
					<div className="space-y-6 animate-fade-in">
						<div className="text-center sm:text-left">
							<h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider font-mono">
								Comparative Value Matrix
							</h3>
							<p className="text-xs text-text-muted mt-1">
								How Solus compares against commercial social networks and classic journal tools.
							</p>
						</div>

						{/* Comparative Table */}
						<div className="overflow-x-auto border border-border/25 rounded-2xl bg-card/25">
							<table className="w-full border-collapse text-left text-xs">
								<thead>
									<tr className="border-b border-border/25 bg-surface/50 text-text-muted font-mono uppercase tracking-wider text-[10px]">
										<th className="p-4 font-semibold">Dimension</th>
										<th className="p-4 font-semibold text-accent">Solus</th>
										<th className="p-4 font-semibold">Instagram</th>
										<th className="p-4 font-semibold">Day One</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border/20 text-text-secondary">
									<tr>
										<td className="p-4 font-medium text-text-primary">Familiar Social UI</td>
										<td className="p-4 text-accent font-bold">✓ Yes</td>
										<td className="p-4">✓ Yes</td>
										<td className="p-4 text-text-muted">✗ List Only</td>
									</tr>
									<tr>
										<td className="p-4 font-medium text-text-primary">Public Validation (Likes)</td>
										<td className="p-4 text-accent font-bold">✗ None</td>
										<td className="p-4 text-danger font-medium">⚠️ Core Loop</td>
										<td className="p-4 text-text-muted">✗ None</td>
									</tr>
									<tr>
										<td className="p-4 font-medium text-text-primary">Data Ad-Scraping</td>
										<td className="p-4 text-accent font-bold">✗ Zero</td>
										<td className="p-4 text-danger font-medium">⚠️ Full Target</td>
										<td className="p-4 text-text-muted">✗ None</td>
									</tr>
									<tr>
										<td className="p-4 font-medium text-text-primary">Opt-in Public Links</td>
										<td className="p-4 text-accent font-bold">✓ Guided</td>
										<td className="p-4 text-danger font-medium">⚠️ Default Public</td>
										<td className="p-4 text-text-muted">✗ Local Locked</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				)}

				{activeTab === "tech" && (
					<div className="space-y-6 animate-fade-in">
						<div className="text-center sm:text-left">
							<h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider font-mono">
								Modern Server-First Tech Stack
							</h3>
							<p className="text-xs text-text-muted mt-1">
								Our choices guarantee privacy, fast cold-starts, and minimal client weight.
							</p>
						</div>

						{/* Stack cards */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="p-4 rounded-xl border border-border/25 bg-card/45 hover:border-accent/40 transition-colors">
								<h4 className="text-xs font-bold text-text-primary">Next.js 16 & Server Actions</h4>
								<p className="text-[10px] text-text-muted mt-1 leading-relaxed">
									Eliminates client-side API fetches by doing direct secure database queries on the server.
								</p>
							</div>

							<div className="p-4 rounded-xl border border-border/25 bg-card/45 hover:border-accent/40 transition-colors">
								<h4 className="text-xs font-bold text-text-primary">Better Auth</h4>
								<p className="text-[10px] text-text-muted mt-1 leading-relaxed">
									Secure social login handles validation server-side without cookie tampering risks.
								</p>
							</div>

							<div className="p-4 rounded-xl border border-border/25 bg-card/45 hover:border-accent/40 transition-colors">
								<h4 className="text-xs font-bold text-text-primary">Neon PostgreSQL (Drizzle)</h4>
								<p className="text-[10px] text-text-muted mt-1 leading-relaxed">
									Serverless PostgreSQL with connection pooling for rapid, light-weight queries.
								</p>
							</div>

							<div className="p-4 rounded-xl border border-border/25 bg-card/45 hover:border-accent/40 transition-colors">
								<h4 className="text-xs font-bold text-text-primary">Cloudflare R2 Bucket</h4>
								<p className="text-[10px] text-text-muted mt-1 leading-relaxed">
									Zero-egress fee media storage keeps user images and voice recordings fully isolated.
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Footer note */}
				<div className="mt-8 pt-4 border-t border-border/10 flex items-center justify-between text-[10px] text-text-muted">
					<span>Interactive Pitch Deck v1.0</span>
					<a
						href="/solus_pitch_deck.md"
						download
						className="text-accent hover:underline flex items-center gap-1"
					>
						📥 Download markdown source
					</a>
				</div>
			</div>
		</div>
	);
}
