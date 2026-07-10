import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Solus — Developer Vault",
	description: "Internal developer reminder vault.",
};

export default function BuyReminderPage() {
	return (
		<div className="py-16 text-center select-none font-sans flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-slide-up">
			<span className="text-3xl animate-bounce">🌐</span>
			<div className="space-y-2">
				<h1 className="text-lg font-bold tracking-tight text-text-primary uppercase font-mono">
					Dev Reminder
				</h1>
				<p className="text-sm text-accent font-semibold tracking-wide font-serif">
					Remember to buy solusapp.io!
				</p>
			</div>
			<Link
				href="/home"
				className="mt-4 h-9 px-4 rounded-full bg-card hover:bg-surface border border-border/40 text-xs font-semibold text-text-secondary hover:text-text-primary transition-all flex items-center justify-center"
			>
				← Go Home
			</Link>
		</div>
	);
}
