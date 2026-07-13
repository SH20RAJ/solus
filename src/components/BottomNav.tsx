"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
	{ href: "/home", label: "Home", icon: HomeIcon },
	{ href: "/timeline", label: "Timeline", icon: TimelineIcon },
	{ href: "/reels", label: "Reels", icon: ReelsIcon },
	{ href: "/create", label: "Create", icon: PlusIcon },
	{ href: "/stories", label: "Stories", icon: StoriesIcon },
	{ href: "/profile", label: "Profile", icon: ProfileIcon },
] as const;

export default function BottomNav() {
	const pathname = usePathname();

	return (
		<nav
			className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border sm:hidden"
			aria-label="Main navigation"
		>
			<div className="flex items-center justify-around h-14">
				{NAV_ITEMS.map((item) => {
					const isActive = pathname === item.href;
					const Icon = item.icon;
					const isCreate = item.href === "/create";

					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex flex-col items-center justify-center w-12 h-12 rounded-[12px] transition-colors duration-200 ease-out ${
								isCreate
									? "bg-text-primary text-background"
									: isActive
										? "text-text-primary"
										: "text-text-muted hover:text-text-secondary"
							}`}
							aria-label={item.label}
							aria-current={isActive ? "page" : undefined}
						>
							<Icon size={20} />
						</Link>
					);
				})}
			</div>
		</nav>
	);
}

/* ── Minimal SVG Icons (Lucide-style, stroke 1.75) ── */

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

function PlusIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
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

function ProfileIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</svg>
	);
}

function ReelsIcon({ size = 24 }: { size?: number }) {
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
