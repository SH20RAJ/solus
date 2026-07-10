import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
	return (
		<div className="min-h-screen bg-background text-text-primary flex flex-col justify-between">
			{/* Nav */}
			<nav className="flex items-center justify-between px-4 sm:px-6 py-5 max-w-[960px] mx-auto w-full">
				<Link href="/" className="flex items-center gap-2.5">
					<Image
						src="/logo.png"
						alt="Solus logo"
						width={32}
						height={32}
						className="rounded-[10px]"
					/>
					<span className="text-base font-semibold tracking-tight">Solus</span>
				</Link>
				<Link
					href="/"
					className="text-sm text-text-muted hover:text-text-primary transition-colors"
				>
					← Back
				</Link>
			</nav>

			{/* Content */}
			<div className="max-w-[640px] mx-auto px-6 py-16 flex-1 w-full animate-slide-up">
				<header className="mb-12">
					<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight font-serif text-text-primary">
						Terms of Service
					</h1>
					<p className="mt-2 text-xs font-mono text-text-muted">
						Last updated: July 10, 2026
					</p>
				</header>

				<article className="prose prose-invert max-w-none space-y-8 text-sm text-text-secondary leading-relaxed font-sans">
					<section className="space-y-3">
						<h2 className="text-lg font-bold text-text-primary font-serif">1. Acceptance of Terms</h2>
						<p>
							By accessing or using Solus, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the application.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-bold text-text-primary font-serif">2. Account Responsibility</h2>
						<p>
							Solus is a personal space. You are responsible for keeping your login credentials safe (via Google sign-in) and for all content uploaded to your private journal workspace.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-bold text-text-primary font-serif">3. Acceptable Use</h2>
						<p>
							We respect the private nature of Solus. You retain 100% ownership of your uploaded files (photos, videos, voice notes). However, if you choose to make collections public, you must ensure that public links do not contain illegal material or copyright infringements.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-bold text-text-primary font-serif">4. Termination of Services</h2>
						<p>
							You can delete your posts or sign out at any time. We reserve the right to suspend or block access to accounts that violate platform policies or abuse API endpoints.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-bold text-text-primary font-serif">5. Changes to Terms</h2>
						<p>
							We may update these terms from time to time. Your continued use of Solus after any changes constitutes acceptance of the new terms.
						</p>
					</section>
				</article>
			</div>

			{/* Footer spacer */}
			<div className="py-8 shrink-0" />
		</div>
	);
}
