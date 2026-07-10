"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

const PERSONAL_NAV_ITEMS = [
	{ href: "/home", label: "Dashboard", icon: HomeIcon },
	{ href: "/timeline", label: "Timeline", icon: TimelineIcon },
	{ href: "/stories", label: "Stories", icon: StoriesIcon },
	{ href: "/collections", label: "Collections", icon: JourneyIcon },
	{ href: "/profile", label: "Profile", icon: ProfileIcon },
] as const;

const LYRA_NAV_ITEMS = [
	{ href: "/home?lyra=true", label: "Lyra Chat", icon: ChatIcon },
	{ href: "/profile", label: "Mind Map", icon: MindIcon },
	{ href: "/pitch", label: "Premium AI", icon: SparklesIcon },
] as const;

export default function Sidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const { data: session } = useSession();
	const [searchQuery, setSearchQuery] = useState("");
	const [sidebarMode, setSidebarMode] = useState<"personal" | "lyra">("personal");
	const [showUserMenu, setShowUserMenu] = useState(false);

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!searchQuery.trim()) return;

		const query = searchQuery.trim();
		if (query.startsWith("#")) {
			router.push(`/tags/${query.substring(1).toLowerCase()}`);
		} else {
			router.push(`/locations/${encodeURIComponent(query)}`);
		}
		setSearchQuery("");
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

	const activeItems = sidebarMode === "personal" ? PERSONAL_NAV_ITEMS : LYRA_NAV_ITEMS;

	return (
		<aside className="hidden sm:flex flex-col w-[260px] h-screen border-r border-border/40 bg-background fixed left-0 top-0 z-40 select-none font-sans justify-between">
			{/* Top Block: macOS Window Controls, Brand Header, Mode Switcher */}
			<div className="flex flex-col">
				{/* ── macOS Style Window Control Dots ── */}
				<div className="flex items-center gap-1.5 px-6 pt-5 pb-2">
					<span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 shadow-sm" />
					<span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#df9b14]/40 shadow-sm" />
					<span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]/40 shadow-sm" />
				</div>

				{/* ── Logo & Title ── */}
				<div className="flex items-center justify-between px-6 py-4">
					<div className="flex items-center gap-3">
						<div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center shadow-inner">
							<Image
								src="/logo.png"
								alt="Solus"
								width={18}
								height={18}
								className="rounded"
							/>
						</div>
						<div className="flex flex-col text-left">
							<span className="text-xs font-bold tracking-tight text-text-primary">
								Solus
							</span>
							<span className="text-[8px] font-mono text-text-muted/70">v1.0.0</span>
						</div>
					</div>
					<button 
						onClick={() => router.push("/timeline")} 
						className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
						title="Timeline Index"
					>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<circle cx="11" cy="11" r="8" />
							<line x1="21" y1="21" x2="16.65" y2="16.65" />
						</svg>
					</button>
				</div>

				{/* ── Segmented Control Switcher (Mockup style) ── */}
				<div className="px-4 mb-4">
					<div className="flex rounded-lg bg-surface/85 p-0.5 border border-border/20 shadow-inner">
						<button
							onClick={() => setSidebarMode("personal")}
							className={`flex-1 py-1.5 text-[9px] uppercase tracking-wider font-bold rounded-md transition-all duration-200 cursor-pointer ${
								sidebarMode === "personal"
									? "bg-[#0c0c0e] text-accent border border-accent/25 shadow-sm font-semibold"
									: "text-text-secondary hover:text-text-primary"
							}`}
						>
							Personal
						</button>
						<button
							onClick={() => setSidebarMode("lyra")}
							className={`flex-1 py-1.5 text-[9px] uppercase tracking-wider font-bold rounded-md transition-all duration-200 cursor-pointer ${
								sidebarMode === "lyra"
									? "bg-[#0c0c0e] text-accent border border-accent/25 shadow-sm font-semibold"
									: "text-text-secondary hover:text-text-primary"
							}`}
						>
							Lyra AI
						</button>
					</div>
				</div>

				{/* ── Search Input ── */}
				<form onSubmit={handleSearchSubmit} className="px-4 mb-2">
					<div className="relative">
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search tags or locations..."
							className="w-full h-8 pl-8 pr-3 text-[10px] rounded-lg border border-border/30 bg-card text-text-primary placeholder:text-text-muted/65 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent transition-all duration-200 shadow-inner"
						/>
						<span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted">
							<SearchIcon size={12} />
						</span>
					</div>
				</form>

				{/* ── Primary Links ── */}
				<nav className="px-4 mt-2 space-y-1.5" aria-label="Main navigation">
					{activeItems.map((item) => {
						const isActive = pathname === item.href.split("?")[0];
						const Icon = item.icon;

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`flex items-center gap-3 px-3 py-2 rounded-[10px] text-xs transition-all duration-200 ease-out border ${
									isActive
										? "bg-accent/5 text-accent border-accent/20 font-semibold"
										: "text-text-secondary hover:text-text-primary hover:bg-card/50 border-transparent"
								}`}
								aria-current={isActive ? "page" : undefined}
							>
								<span className={isActive ? "text-accent" : "text-text-muted"}>
									<Icon size={16} />
								</span>
								{item.label}
							</Link>
						);
					})}
				</nav>
			</div>

			{/* Bottom Block: Quick Add & User Account Capsule Card */}
			<div className="px-4 pb-6 space-y-4 relative">
				<Link
					href="/create"
					className="flex items-center justify-center gap-2 w-full h-10 rounded-[10px] bg-accent text-background text-xs font-semibold transition-all duration-200 ease-out hover:opacity-90 active:scale-[0.98] shadow-sm shadow-accent/10"
				>
					<PlusIcon size={14} />
					Create Entry
				</Link>

				{session?.user && (
					<div className="relative">
						{/* User Account Capsule Card */}
						<div 
							onClick={() => setShowUserMenu(!showUserMenu)}
							className="flex items-center justify-between p-2.5 rounded-full bg-card/65 border border-border/30 hover:border-border/60 transition-all duration-300 cursor-pointer shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]"
						>
							<div className="flex items-center gap-2.5 min-w-0">
								{session.user.image ? (
									<Image
										src={session.user.image}
										alt={session.user.name ?? "User"}
										width={28}
										height={28}
										className="rounded-full shrink-0 border border-border/50"
									/>
								) : (
									<div className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-semibold text-text-muted shrink-0">
										{session.user.name?.charAt(0).toUpperCase()}
									</div>
								)}
								<div className="min-w-0 text-left">
									<p className="text-[11px] font-bold text-text-primary truncate">
										{session.user.name}
									</p>
									<p className="text-[9px] text-text-muted truncate">
										{session.user.email}
									</p>
								</div>
							</div>
							<div className="p-1 text-text-muted hover:text-text-primary shrink-0 transition-colors">
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
									<circle cx="12" cy="12" r="1" />
									<circle cx="19" cy="12" r="1" />
									<circle cx="5" cy="12" r="1" />
								</svg>
							</div>
						</div>

						{/* Dropdown Menu */}
						{showUserMenu && (
							<>
								<div 
									className="fixed inset-0 z-10" 
									onClick={() => setShowUserMenu(false)}
								/>
								<div className="absolute bottom-14 left-0 right-0 z-20 p-1.5 rounded-xl border border-border/40 bg-[#0c0c0e]/95 backdrop-blur-md shadow-xl animate-slide-up flex flex-col gap-0.5">
									<Link 
										href="/create" 
										onClick={() => setShowUserMenu(false)}
										className="w-full text-left px-3 py-2 rounded-lg text-[10px] text-text-secondary hover:text-text-primary hover:bg-card transition-colors flex items-center gap-2 font-mono uppercase tracking-wider"
									>
										<PlusIcon size={12} />
										New Reflection
									</Link>
									<Link 
										href="/pitch" 
										onClick={() => setShowUserMenu(false)}
										className="w-full text-left px-3 py-2 rounded-lg text-[10px] text-text-secondary hover:text-text-primary hover:bg-card transition-colors flex items-center gap-2 font-mono uppercase tracking-wider"
									>
										<SparklesIcon size={12} />
										AI Lyra Premium
									</Link>
									<div className="h-px bg-border/20 my-1" />
									<button 
										onClick={() => {
											setShowUserMenu(false);
											handleSignOut();
										}}
										className="w-full text-left px-3 py-2 rounded-lg text-[10px] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2 font-mono uppercase tracking-wider cursor-pointer"
									>
										<LogOutIcon size={12} />
										Sign Out
									</button>
								</div>
							</>
						)}
					</div>
				)}
			</div>
		</aside>
	);
}

/* ── Minimal SVG Icons matching Design mock ── */

function HomeIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			<polyline points="9 22 9 12 15 12 15 22" />
		</svg>
	);
}

function TimelineIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<line x1="12" y1="2" x2="12" y2="22" />
			<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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

function JourneyIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
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

function SearchIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
		</svg>
	);
}

function ChatIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
		</svg>
	);
}

function MindIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
			<path d="M12 6v12" />
			<path d="M6 12h12" />
		</svg>
	);
}

function SparklesIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
			<path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z" />
			<path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
		</svg>
	);
}
