"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
	const pathname = usePathname();

	return (
		<nav
			className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/40 sm:hidden"
			aria-label="Main navigation"
		>
			<div className="flex items-center justify-around h-16 px-6">
				{/* Home Link */}
				<Link
					href="/home"
					className={`flex flex-col items-center justify-center w-12 h-12 rounded-[12px] transition-colors duration-200 ease-out ${
						pathname === "/home" ? "text-accent" : "text-text-muted hover:text-text-secondary"
					}`}
					aria-label="Home"
				>
					<HomeIcon size={20} />
				</Link>

				{/* Center Create Button */}
				<Link
					href="/create"
					className="flex items-center justify-center w-11 h-11 rounded-full bg-accent text-background transition-all duration-300 hover:scale-105 active:scale-95 shadow-md -translate-y-2.5 border-4 border-card"
					aria-label="Create Entry"
				>
					<PlusIcon size={20} />
				</Link>

				{/* Profile Link */}
				<Link
					href="/profile"
					className={`flex flex-col items-center justify-center w-12 h-12 rounded-[12px] transition-colors duration-200 ease-out ${
						pathname === "/profile" ? "text-accent" : "text-text-muted hover:text-text-secondary"
					}`}
					aria-label="Profile"
				>
					<ProfileIcon size={20} />
				</Link>
			</div>
		</nav>
	);
}

/* ── Minimal Icons ── */

function HomeIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			<polyline points="9 22 9 12 15 12 15 22" />
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

function ProfileIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
			<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</svg>
	);
}
