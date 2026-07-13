"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import ThemeToggle from "@/components/ThemeToggle";
import { usePosts } from "@/lib/api-client";

const MOOD_TYPES = [
	{ name: "Grateful", color: "bg-[#f59e0b]", activeRing: "ring-[#f59e0b]/50" },
	{ name: "Calm", color: "bg-[#10b981]", activeRing: "ring-[#10b981]/50" },
	{ name: "Reflective", color: "bg-[#6366f1]", activeRing: "ring-[#6366f1]/50" },
	{ name: "Excited", color: "bg-[#ec4899]", activeRing: "ring-[#ec4899]/50" },
	{ name: "Tired", color: "bg-[#84cc16]", activeRing: "ring-[#84cc16]/50" },
] as const;

const NAV_ITEMS = [
	{ href: "/home", label: "Home", icon: HomeIcon },
	{ href: "/profile", label: "Profile", icon: ProfileIcon },
] as const;

export default function Sidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const { data: session } = useSession();
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [submittingMood, setSubmittingMood] = useState<string | null>(null);

	const { data: postsData, mutate: mutatePosts } = usePosts();
	const posts = postsData?.data ?? [];

	// Load initial collapsed state
	useEffect(() => {
		const stored = localStorage.getItem("solus-sidebar-collapsed");
		if (stored === "true") {
			setIsCollapsed(true);
		}
	}, []);

	// Dynamic offset for main page content
	useEffect(() => {
		const mainElement = document.querySelector("main");
		if (!mainElement) return;

		if (isCollapsed) {
			mainElement.classList.add("sm:ml-[72px]");
			mainElement.classList.remove("sm:ml-[260px]");
		} else {
			mainElement.classList.add("sm:ml-[260px]");
			mainElement.classList.remove("sm:ml-[72px]");
		}
	}, [isCollapsed]);

	const toggleCollapse = () => {
		const next = !isCollapsed;
		setIsCollapsed(next);
		localStorage.setItem("solus-sidebar-collapsed", String(next));
	};

	const handleSignOut = () => {
		signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.assign("/login");
				},
			},
		});
	};

	// Log a mood check-in directly
	const handleMoodCheckIn = async (moodName: string) => {
		setSubmittingMood(moodName);
		try {
			await fetch("/api/posts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					mood: moodName,
					caption: `Logged today as a ${moodName.toLowerCase()} day.`,
				}),
			});
			mutatePosts();
		} catch (e) {
			console.error("Mood log failed:", e);
		} finally {
			setSubmittingMood(null);
		}
	};

	// Get last 4 entries with mood to draw the Heartbeat Day-Thread timeline ribbon
	const dayThreadItems = posts
		.filter((p) => p.mood)
		.slice(0, 4)
		.map((p) => {
			const date = new Date(p.createdAt);
			const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
			const moodConfig = MOOD_TYPES.find((m) => m.name.toLowerCase() === p.mood?.toLowerCase());
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			const slug = `${year}-${month}-${day}`;
			return {
				id: p.id,
				date: formattedDate,
				mood: p.mood,
				color: moodConfig?.color ?? "bg-text-secondary",
				slug,
			};
		});

	const dateStr = new Date().toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
	});

	if (!session?.user) return null;

	return (
		<aside
			className={`hidden sm:flex flex-col h-screen border-r border-border/40 bg-card/95 backdrop-blur-md fixed left-0 top-0 z-40 select-none font-sans justify-between transition-all duration-300 ease-in-out ${
				isCollapsed ? "w-[72px]" : "w-[260px]"
			}`}
		>
			{/* Top Block: Mood Check-In / Day Thread */}
			<div className="flex flex-col flex-1 overflow-y-auto scrollbar-none">
				{/* macOS Style Window Controls */}
				<div className={`flex items-center gap-1.5 px-6 pt-5 pb-2 ${isCollapsed ? "justify-center" : ""}`}>
					<span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 shadow-sm" />
					{!isCollapsed && (
						<>
							<span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#df9b14]/40 shadow-sm" />
							<span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]/40 shadow-sm" />
						</>
					)}
				</div>

				{/* Header / Collapse Toggle */}
				<div className={`flex items-center justify-between px-6 py-4 ${isCollapsed ? "justify-center" : ""}`}>
					{!isCollapsed && (
						<div className="flex items-center gap-2.5">
							<Image
								src="/logo.png"
								alt="Solus"
								width={18}
								height={18}
								className="rounded"
							/>
							<span className="text-lg font-bold tracking-tight text-text-primary">
								Solus
							</span>
						</div>
					)}
					<div className="flex items-center gap-2">
						<ThemeToggle />
						<button
							onClick={toggleCollapse}
							className="text-text-muted hover:text-text-primary transition-colors cursor-pointer p-1 rounded hover:bg-surface/50"
							title={isCollapsed ? "Expand" : "Collapse"}
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
								{isCollapsed ? (
									<polyline points="9 18 15 12 9 6" />
								) : (
									<polyline points="15 18 9 12 15 6" />
								)}
							</svg>
						</button>
					</div>
				</div>

				{/* ONE-TAP MOOD CHECK-IN */}
				{!isCollapsed ? (
					<div className="px-6 py-4 border-b border-border/20 text-left">
						<p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">{dateStr}</p>
						<h3 className="text-sm font-semibold text-text-primary mt-0.5">How&apos;s today feeling?</h3>
						<div className="flex gap-2.5 mt-3">
							{MOOD_TYPES.map((m) => (
								<button
									key={m.name}
									onClick={() => handleMoodCheckIn(m.name)}
									disabled={!!submittingMood}
									className={`w-6 h-6 rounded-full ${m.color} hover:scale-110 active:scale-95 transition-all cursor-pointer shadow border border-white/5 focus:outline-none focus:ring-2 ${m.activeRing} disabled:opacity-50`}
									title={`Log mood as ${m.name}`}
								/>
							))}
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-2 items-center py-4 border-b border-border/20">
						{MOOD_TYPES.map((m) => (
							<button
								key={m.name}
								onClick={() => handleMoodCheckIn(m.name)}
								disabled={!!submittingMood}
								className={`w-4 h-4 rounded-full ${m.color} hover:scale-110 active:scale-95 transition-all cursor-pointer shadow border border-white/5 disabled:opacity-50`}
								title={`Log mood: ${m.name}`}
							/>
						))}
					</div>
				)}

				{/* HEARTBEAT DAY-THREAD RIBBON */}
				{!isCollapsed && dayThreadItems.length > 0 && (
					<div className="px-6 py-5 text-left flex-1">
						<p className="text-[10px] text-text-muted font-mono uppercase tracking-wider mb-4">Your last days</p>
						<div className="relative pl-3 flex flex-col gap-6">
							{/* Connecting heartbeat vertical line */}
							<div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-border/40" />

							{dayThreadItems.map((item) => (
								<Link
									key={item.id}
									href={`/day/${item.slug}`}
									className="flex items-center gap-3.5 group relative hover:opacity-80 transition-opacity"
								>
									{/* Heartbeat pulse dot */}
									<div className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0 ring-4 ring-background border border-white/5 relative z-10 transition-transform group-hover:scale-110`} />
									<div className="text-[11px] leading-none">
										<span className="font-semibold text-text-secondary group-hover:text-text-primary transition-colors">{item.date}</span>
										<span className="text-text-muted mx-1.5">&middot;</span>
										<span className="text-text-muted lowercase font-mono">{item.mood}</span>
									</div>
								</Link>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Bottom Block: Floating Circular Plus & Nav Icon Rail */}
			<div className="px-4 pb-6 pt-3 border-t border-border/20 bg-card space-y-4 flex flex-col items-center">
				
				{/* FLOATING CIRCULAR PLUS BUTTON */}
				<Link
					href="/create"
					className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-background hover:bg-accent/90 transition-all duration-300 ease-out hover:scale-105 active:scale-[0.95] shadow-lg cursor-pointer shrink-0"
					title="New Entry"
				>
					<PlusIcon size={20} />
				</Link>

				{/* COLLAPSED NAVIGATION ICON RAIL */}
				<nav
					className={`flex gap-1.5 w-full items-center justify-center ${
						isCollapsed ? "flex-col" : "flex-row flex-wrap"
					}`}
					aria-label="Main navigation"
				>
					{NAV_ITEMS.map((item) => {
						const isActive = pathname === item.href;
						const Icon = item.icon;

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`flex items-center justify-center rounded-xl transition-all duration-200 ease-out border ${
									isActive
										? "bg-accent/5 text-accent border-accent/20"
										: "text-text-secondary hover:text-text-primary hover:bg-surface border-transparent"
								} p-2`}
								title={item.label}
								aria-current={isActive ? "page" : undefined}
							>
								<Icon size={16} />
							</Link>
						);
					})}
				</nav>

				{/* USER PROFILE CAPSULE */}
				<div className="relative w-full">
					<div
						onClick={() => setShowUserMenu(!showUserMenu)}
						className="flex items-center bg-surface/50 hover:bg-surface border border-border/30 hover:border-border/60 transition-all duration-300 cursor-pointer p-2 rounded-xl justify-between gap-2.5 shadow-sm"
					>
						<div className="flex items-center gap-2 min-w-0">
							{session.user.image ? (
								<Image
									src={session.user.image}
									alt={session.user.name ?? "User"}
									width={24}
									height={24}
									className="rounded-full shrink-0 border border-border/50"
								/>
							) : (
								<div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-[10px] font-semibold text-text-muted shrink-0">
									{session.user.name?.charAt(0).toUpperCase()}
								</div>
							)}
							{!isCollapsed && (
								<div className="min-w-0 text-left">
									<p className="text-[10px] font-bold text-text-primary truncate leading-none">
										{session.user.name}
									</p>
								</div>
							)}
						</div>
						{!isCollapsed && (
							<div className="text-text-muted hover:text-text-primary shrink-0 transition-colors">
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
									<circle cx="12" cy="12" r="1" />
									<circle cx="19" cy="12" r="1" />
									<circle cx="5" cy="12" r="1" />
								</svg>
							</div>
						)}
					</div>

					{/* Dropdown Menu */}
					{showUserMenu && (
						<>
							<div
								className="fixed inset-0 z-10"
								onClick={() => setShowUserMenu(false)}
							/>
							<div
								className={`absolute z-20 p-1.5 rounded-xl border border-border/40 bg-card/95 backdrop-blur-md shadow-xl animate-slide-up flex flex-col gap-0.5 ${
									isCollapsed ? "bottom-14 left-1 w-44" : "bottom-14 left-0 right-0"
								}`}
							>
								<Link
									href="/pitch"
									onClick={() => setShowUserMenu(false)}
									className="w-full text-left px-3 py-2 rounded-lg text-[9px] text-text-secondary hover:text-text-primary hover:bg-card transition-colors flex items-center gap-2 font-mono uppercase tracking-wider"
								>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
									</svg>
									Solus Pitch Deck
								</Link>
								<div className="h-px bg-border/20 my-1" />
								<button
									onClick={() => {
										setShowUserMenu(false);
										handleSignOut();
									}}
									className="w-full text-left px-3 py-2 rounded-lg text-[9px] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2 font-mono uppercase tracking-wider cursor-pointer"
								>
									<LogOutIcon size={12} />
									Sign Out
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</aside>
	);
}

/* ── Minimal SVG Icons ── */

function HomeIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			<polyline points="9 22 9 12 15 12 15 22" />
		</svg>
	);
}

function ClockIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>
	);
}

function StoriesIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);
}

function CollectionsIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
		</svg>
	);
}

function ProfileIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</svg>
	);
}

function PlusIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</svg>
	);
}

function LogOutIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<polyline points="16 17 21 12 16 7" />
			<line x1="21" y1="12" x2="9" y2="12" />
		</svg>
	);
}

function ReelsIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18" />
			<line x1="7" x2="7" y1="2" y2="22" />
			<line x1="17" x2="17" y1="2" y2="22" />
			<line x1="2" x2="22" y1="12" y2="12" />
			<line x1="2" x2="7" y1="7" y2="7" />
			<line x1="2" x2="7" y1="17" y2="17" />
			<line x1="17" x2="22" y1="7" y2="7" />
			<line x1="17" x2="22" y1="17" y2="17" />
		</svg>
	);
}
