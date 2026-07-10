"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
	{ href: "/home", label: "Home", icon: HomeIcon },
	{ href: "/timeline", label: "Timeline", icon: TimelineIcon },
	{ href: "/stories", label: "Stories", icon: StoriesIcon },
	{ href: "/journeys", label: "Journeys", icon: JourneyIcon },
	{ href: "/profile", label: "Profile", icon: ProfileIcon },
] as const;

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="hidden sm:flex flex-col w-[240px] h-screen border-r border-border bg-card fixed left-0 top-0">
			{/* Logo */}
			<div className="flex items-center gap-2.5 px-5 py-5">
				<Image
					src="/logo.png"
					alt="Solus"
					width={32}
					height={32}
					className="rounded-[10px]"
				/>
				<span className="text-base font-semibold tracking-tight text-text-primary">
					Solus
				</span>
			</div>

			{/* Nav links */}
			<nav className="flex-1 px-3 mt-4 space-y-1" aria-label="Main navigation">
				{NAV_ITEMS.map((item) => {
					const isActive = pathname === item.href;
					const Icon = item.icon;

					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm transition-colors duration-200 ease-out ${
								isActive
									? "bg-surface text-text-primary font-medium"
									: "text-text-secondary hover:text-text-primary hover:bg-surface"
							}`}
							aria-current={isActive ? "page" : undefined}
						>
							<Icon size={20} />
							{item.label}
						</Link>
					);
				})}
			</nav>

			{/* Create button */}
			<div className="px-3 pb-5">
				<Link
					href="/create"
					className="flex items-center justify-center gap-2 h-11 rounded-[12px] bg-text-primary text-background text-sm font-medium transition-opacity duration-200 ease-out hover:opacity-85"
				>
					<PlusIcon size={18} />
					Create Memory
				</Link>
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
