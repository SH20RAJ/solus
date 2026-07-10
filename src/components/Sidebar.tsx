"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

const NAV_ITEMS = [
	{ href: "/home", label: "Home", icon: HomeIcon },
	{ href: "/timeline", label: "Timeline", icon: TimelineIcon },
	{ href: "/stories", label: "Stories", icon: StoriesIcon },
	{ href: "/journeys", label: "Collections", icon: JourneyIcon },
	{ href: "/profile", label: "Profile", icon: ProfileIcon },
] as const;

export default function Sidebar() {
	const pathname = usePathname();
	const { data: session } = useSession();

	const handleSignOut = () => {
		signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.assign("/login");
				},
			},
		});
	};

	return (
		<aside className="hidden sm:flex flex-col w-[260px] h-screen border-r border-border/40 bg-background fixed left-0 top-0 z-40 select-none">
			{/* Logo */}
			<div className="flex items-center gap-3 px-6 py-6">
				<Image
					src="/logo.png"
					alt="Solus"
					width={28}
					height={28}
					className="rounded-lg"
				/>
				<span className="text-base font-semibold tracking-tight text-text-primary font-serif">
					Solus
				</span>
			</div>

			{/* Nav links */}
			<nav className="flex-1 px-4 mt-6 space-y-1.5" aria-label="Main navigation">
				{NAV_ITEMS.map((item) => {
					const isActive = pathname === item.href;
					const Icon = item.icon;

					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm transition-all duration-200 ease-out ${
								isActive
									? "bg-card text-text-primary font-medium shadow-sm border border-border/50"
									: "text-text-secondary hover:text-text-primary hover:bg-card/50"
							}`}
							aria-current={isActive ? "page" : undefined}
						>
							<span className={isActive ? "text-accent" : "text-text-muted"}>
								<Icon size={18} />
							</span>
							{item.label}
						</Link>
					);
				})}
			</nav>

			{/* Action & User Info */}
			<div className="px-4 pb-6 space-y-4">
				<Link
					href="/create"
					className="flex items-center justify-center gap-2 w-full h-10 rounded-[10px] bg-text-primary text-background text-sm font-medium transition-all duration-200 ease-out hover:opacity-90 active:scale-[0.98]"
				>
					<PlusIcon size={16} />
					Create Entry
				</Link>

				{session?.user && (
					<div className="flex items-center justify-between p-2 rounded-[12px] bg-card/40 border border-border/30">
						<div className="flex items-center gap-2.5 min-w-0">
							{session.user.image ? (
								<Image
									src={session.user.image}
									alt={session.user.name ?? "User"}
									width={32}
									height={32}
									className="rounded-full shrink-0 border border-border/50"
								/>
							) : (
								<div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-semibold text-text-muted shrink-0">
									{session.user.name?.charAt(0).toUpperCase()}
								</div>
							)}
							<div className="min-w-0">
								<p className="text-xs font-semibold text-text-primary truncate">
									{session.user.name}
								</p>
								<p className="text-[10px] text-text-muted truncate">
									{session.user.email}
								</p>
							</div>
						</div>
						<button
							onClick={handleSignOut}
							className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer shrink-0"
							title="Sign Out"
							type="button"
						>
							<LogOutIcon size={14} />
						</button>
					</div>
				)}
			</div>
		</aside>
	);
}

/* ── Minimal SVG Icons ── */

function HomeIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			<polyline points="9 22 9 12 15 12 15 22" />
		</svg>
	);
}

function TimelineIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<line x1="12" y1="2" x2="12" y2="22" />
			<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
		</svg>
	);
}

function StoriesIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);
}

function JourneyIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
		</svg>
	);
}

function ProfileIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</svg>
	);
}

function PlusIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</svg>
	);
}

function LogOutIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<polyline points="16 17 21 12 16 7" />
			<line x1="21" y1="12" x2="9" y2="12" />
		</svg>
	);
}

