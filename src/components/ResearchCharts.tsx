"use client";

import { useState } from "react";

export default function ResearchCharts() {
	const [activeTab, setActiveTab] = useState<"detox" | "fatigue">("detox");

	return (
		<div className="w-full bg-card border border-border/30 rounded-[24px] p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] select-none">
			{/* Switcher */}
			<div className="flex bg-surface p-1 rounded-xl mb-8 border border-border/20 max-w-sm mx-auto">
				<button
					type="button"
					onClick={() => setActiveTab("detox")}
					className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
						activeTab === "detox"
							? "bg-card text-accent font-semibold shadow-sm"
							: "text-text-muted hover:text-text-primary"
					}`}
				>
					Detox Gains
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("fatigue")}
					className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
						activeTab === "fatigue"
							? "bg-card text-accent font-semibold shadow-sm"
							: "text-text-muted hover:text-text-primary"
					}`}
				>
					Digital Fatigue
				</button>
			</div>

			{activeTab === "detox" ? (
				<div className="space-y-6 animate-fade-in">
					<div className="text-center sm:text-left mb-4">
						<h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide font-mono">
							Clinically Proven Detox Results
						</h3>
						<p className="text-xs text-text-muted mt-1">
							1-week break from social media shows measurable psychological improvements.
						</p>
					</div>

					{/* Chart 1: Anxiety */}
					<div className="space-y-2">
						<div className="flex justify-between text-xs font-semibold">
							<span className="text-text-secondary">Anxiety Symptoms</span>
							<span className="text-danger">-16.1%</span>
						</div>
						<div className="h-2 w-full bg-surface rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-danger/70 to-danger rounded-full transition-all duration-1000 ease-out"
								style={{ width: "83.9%" }}
							/>
						</div>
						<p className="text-[10px] text-text-muted leading-relaxed">
							Significant reduction in panic, social comparison fear, and constant notifications check-loop.
						</p>
					</div>

					{/* Chart 2: Depression */}
					<div className="space-y-2">
						<div className="flex justify-between text-xs font-semibold">
							<span className="text-text-secondary">Depressive Symptoms</span>
							<span className="text-danger">-24.8%</span>
						</div>
						<div className="h-2 w-full bg-surface rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-danger/70 to-danger rounded-full transition-all duration-1000 ease-out"
								style={{ width: "75.2%" }}
							/>
						</div>
						<p className="text-[10px] text-text-muted leading-relaxed">
							Notable drop in loneliness feelings and self-worth insecurity related to peer performance.
						</p>
					</div>

					{/* Chart 3: Insomnia */}
					<div className="space-y-2">
						<div className="flex justify-between text-xs font-semibold">
							<span className="text-text-secondary">Insomnia & Sleep Issues</span>
							<span className="text-danger">-14.5%</span>
						</div>
						<div className="h-2 w-full bg-surface rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-danger/70 to-danger rounded-full transition-all duration-1000 ease-out"
								style={{ width: "85.5%" }}
							/>
						</div>
						<p className="text-[10px] text-text-muted leading-relaxed">
							Better night sleep quality and natural melatonin release without blue-screen scrolling habits.
						</p>
					</div>
				</div>
			) : (
				<div className="space-y-6 animate-fade-in">
					<div className="text-center sm:text-left mb-4">
						<h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide font-mono">
							The Toll of the Attention Economy
						</h3>
						<p className="text-xs text-text-muted mt-1">
							The metrics driving traditional social feeds produce severe social pressure.
						</p>
					</div>

					{/* Bar 1: Validation Pressure */}
					<div className="space-y-2">
						<div className="flex justify-between text-xs font-semibold">
							<span className="text-text-secondary">Feel pressure to curate perfect posts</span>
							<span className="text-accent">86%</span>
						</div>
						<div className="h-2.5 w-full bg-surface rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-accent/70 to-accent rounded-full transition-all duration-1000 ease-out"
								style={{ width: "86%" }}
							/>
						</div>
						<p className="text-[10px] text-text-muted leading-relaxed">
							86% of young adults feel intense pressure to perform for their follower list.
						</p>
					</div>

					{/* Bar 2: Insecure Comparisons */}
					<div className="space-y-2">
						<div className="flex justify-between text-xs font-semibold">
							<span className="text-text-secondary">Feel insecure from negative comparison</span>
							<span className="text-accent">67%</span>
						</div>
						<div className="h-2.5 w-full bg-surface rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-accent/70 to-accent rounded-full transition-all duration-1000 ease-out"
								style={{ width: "67%" }}
							/>
						</div>
						<p className="text-[10px] text-text-muted leading-relaxed">
							Users routinely compare their worst days to others&apos; curated highlights.
						</p>
					</div>

					{/* Bar 3: Clinical Addiction */}
					<div className="space-y-2">
						<div className="flex justify-between text-xs font-semibold">
							<span className="text-text-secondary">Clinical problematic use (Addiction)</span>
							<span className="text-accent">8.4%</span>
						</div>
						<div className="h-2.5 w-full bg-surface rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-accent/70 to-accent rounded-full transition-all duration-1000 ease-out"
								style={{ width: "8.4%" }}
							/>
						</div>
						<p className="text-[10px] text-text-muted leading-relaxed">
							Unpredictable dopamine hits (likes/comments) result in clinical hook behaviors.
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
