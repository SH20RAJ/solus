"use client";

import { useState } from "react";
import { usePosts } from "@/lib/api-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MOOD_TYPES = [
	{ name: "Happy", color: "bg-amber-500", glow: "shadow-[0_0_12px_rgba(245,158,11,0.4)] border-amber-500/40 text-amber-300 bg-amber-500/10" },
	{ name: "Calm", color: "bg-sky-500", glow: "shadow-[0_0_12px_rgba(14,165,233,0.4)] border-sky-500/40 text-sky-300 bg-sky-500/10" },
	{ name: "Grateful", color: "bg-emerald-500", glow: "shadow-[0_0_12px_rgba(16,185,129,0.4)] border-emerald-500/40 text-emerald-300 bg-emerald-500/10" },
	{ name: "Reflective", color: "bg-indigo-500", glow: "shadow-[0_0_12px_rgba(99,102,241,0.4)] border-indigo-500/40 text-indigo-300 bg-indigo-500/10" },
	{ name: "Tired", color: "bg-zinc-500", glow: "shadow-[0_0_12px_rgba(115,115,115,0.4)] border-zinc-500/40 text-zinc-300 bg-zinc-500/10" },
] as const;

export default function CalendarPageClient() {
	const router = useRouter();
	const { data: postsData, isLoading } = usePosts();
	const posts = postsData?.data ?? [];

	// Local state for selected year/month
	const today = new Date();
	const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();

	// Month naming
	const monthLabel = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

	// Calendar calculation
	const firstDayOfMonth = new Date(year, month, 1).getDay(); // Day of week (0-6)
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	const prevMonth = () => {
		setCurrentDate(new Date(year, month - 1, 1));
	};

	const nextMonth = () => {
		setCurrentDate(new Date(year, month + 1, 1));
	};

	// Generate day cells
	const cells = [];
	// Fill previous month padding slots
	for (let i = 0; i < firstDayOfMonth; i++) {
		cells.push({ day: null, dateStr: null, posts: [] });
	}
	// Fill current month slots
	for (let d = 1; d <= daysInMonth; d++) {
		const cellDate = new Date(year, month, d);
		const cellDateStr = cellDate.toDateString();
		const dayPosts = posts.filter((p) => new Date(p.createdAt).toDateString() === cellDateStr);

		cells.push({
			day: d,
			dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
			posts: dayPosts,
		});
	}

	return (
		<div className="max-w-3xl mx-auto px-4 py-8 pb-24 sm:py-12 select-none min-h-screen">
			{/* Navigation Header */}
			<header className="flex items-center justify-between mb-8">
				<Link
					href="/profile"
					className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors flex items-center gap-1.5"
				>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<line x1="19" y1="12" x2="5" y2="12" />
						<polyline points="12 19 5 12 12 5" />
					</svg>
					Back to Profile
				</Link>

				<span className="text-[10px] font-mono text-text-muted uppercase tracking-widest bg-card px-2.5 py-1 rounded-full border border-border/20">
					Vibe Calendar
				</span>
			</header>

			{/* Month Selector Title */}
			<div className="flex items-center justify-between mb-8 bg-card/40 border border-border/20 rounded-2xl p-4 backdrop-blur-sm">
				<button
					onClick={prevMonth}
					className="p-2 text-text-muted hover:text-text-primary hover:bg-surface/50 rounded-xl transition-all cursor-pointer"
					title="Previous Month"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
						<polyline points="15 18 9 12 15 6" />
					</svg>
				</button>

				<h1 className="text-base font-bold font-sans text-text-primary tracking-tight">
					{monthLabel}
				</h1>

				<button
					onClick={nextMonth}
					className="p-2 text-text-muted hover:text-text-primary hover:bg-surface/50 rounded-xl transition-all cursor-pointer"
					title="Next Month"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
						<polyline points="9 18 15 12 9 6" />
					</svg>
				</button>
			</div>

			{/* Calendar Grid Container */}
			<div className="bg-card/25 border border-border/20 rounded-3xl p-5 backdrop-blur-md">
				{/* Weekdays Row */}
				<div className="grid grid-cols-7 gap-2 mb-4 text-center">
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
						<span key={dayName} className="text-[10px] font-mono uppercase tracking-wider text-text-muted font-semibold">
							{dayName}
						</span>
					))}
				</div>

				{/* Grid Cells */}
				{isLoading ? (
					<div className="grid grid-cols-7 gap-2">
						{Array.from({ length: 35 }).map((_, idx) => (
							<div
								key={idx}
								className="aspect-square w-full rounded-xl bg-card/40 animate-pulse border border-border/10"
							/>
						))}
					</div>
				) : (
					<div className="grid grid-cols-7 gap-2.5">
						{cells.map((cell, idx) => {
							if (cell.day === null) {
								return <div key={`empty-${idx}`} className="aspect-square" />;
							}

							// Find if there is a primary mood
							const primaryMoodPost = cell.posts.find((p) => p.mood);
							const cellMood = primaryMoodPost?.mood;
							const moodStyle = cellMood
								? MOOD_TYPES.find((m) => m.name.toLowerCase() === cellMood.toLowerCase())
								: null;

							const isToday =
								cell.day === today.getDate() &&
								month === today.getMonth() &&
								year === today.getFullYear();

							return (
								<button
									key={cell.dateStr}
									onClick={() => router.push(`/day/${cell.dateStr}`)}
									className={`aspect-square w-full rounded-2xl border flex flex-col justify-between p-2.5 relative group transition-all duration-300 ease-out cursor-pointer hover:border-accent hover:scale-[1.03] ${
										moodStyle
											? `${moodStyle.glow} border-border/20`
											: isToday
											? "border-accent bg-accent/5 text-accent"
											: "border-border/10 hover:bg-card text-text-secondary"
									}`}
								>
									{/* Date Number */}
									<span className={`text-xs font-mono font-medium ${isToday ? "font-bold" : ""}`}>
										{cell.day}
									</span>

									{/* Ambient Indicator dots / previews */}
									<div className="flex gap-1 items-center justify-end w-full">
										{cell.posts.length > 0 && (
											<span className="text-[8px] font-mono text-text-muted opacity-80 group-hover:opacity-100">
												{cell.posts.length} {cell.posts.length === 1 ? "entry" : "entries"}
											</span>
										)}
										{cellMood && (
											<span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 animate-ping absolute top-2.5 right-2.5" />
										)}
									</div>

									{/* Hover Details Preview Tooltip */}
									{cell.posts.length > 0 && (
										<div className="absolute bottom-[115%] left-1/2 -translate-x-1/2 bg-card/95 border border-border/60 p-3 rounded-xl shadow-xl w-48 text-left opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-all duration-200 z-50 backdrop-blur-md scale-95 group-hover:scale-100">
											<div className="text-[8px] font-mono text-text-muted uppercase tracking-wider mb-1.5">
												Logged Memories
											</div>
											<div className="space-y-1.5 max-h-24 overflow-y-auto scrollbar-none">
												{cell.posts.map((p, pIdx) => (
													<div key={p.id} className="text-[10px] leading-tight text-text-primary truncate">
														{pIdx + 1}. {p.caption || "Logged moment"}
													</div>
												))}
											</div>
										</div>
									)}
								</button>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
