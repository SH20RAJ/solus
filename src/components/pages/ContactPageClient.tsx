"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ContactPageClient() {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !message) return;
		setSubmitted(true);
	};

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

			{/* Contact Content */}
			<div className="max-w-[440px] mx-auto px-6 py-12 flex-1 flex flex-col justify-center w-full animate-slide-up">
				<header className="mb-8 text-center sm:text-left">
					<h1 className="text-3xl font-semibold tracking-tight font-serif text-text-primary">
						Get in Touch
					</h1>
					<p className="mt-2 text-sm text-text-secondary leading-relaxed">
						Have ideas, feedback, or questions? Send us a message anonymously or with your email.
					</p>
				</header>

				{submitted ? (
					<div className="p-6 rounded-[24px] border border-accent/20 bg-accent/5 text-center space-y-3">
						<div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center mx-auto text-accent text-lg">
							✓
						</div>
						<h3 className="text-sm font-semibold text-text-primary">Message Received</h3>
						<p className="text-xs text-text-secondary leading-relaxed">
							Thank you for reaching out. We read every message and prioritize your privacy.
						</p>
						<button
							onClick={() => {
								setSubmitted(false);
								setEmail("");
								setMessage("");
							}}
							className="mt-2 text-xs font-semibold text-accent hover:underline"
						>
							Send another note
						</button>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-1.5">
							<label htmlFor="email" className="block text-xs uppercase tracking-wider font-mono text-text-muted">
								Your Email
							</label>
							<input
								id="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								className="w-full h-11 px-4 rounded-[12px] border border-border bg-card text-sm placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent transition-all duration-200"
							/>
						</div>

						<div className="space-y-1.5">
							<label htmlFor="message" className="block text-xs uppercase tracking-wider font-mono text-text-muted">
								Message
							</label>
							<textarea
								id="message"
								required
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder="Tell us what you think..."
								rows={5}
								maxLength={1000}
								className="w-full px-4 py-3 rounded-[12px] border border-border bg-card text-sm placeholder:text-text-muted/60 resize-none focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent transition-all duration-200 leading-relaxed"
							/>
						</div>

						<button
							type="submit"
							className="w-full h-11 rounded-[12px] bg-text-primary text-background text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center"
						>
							Send message
						</button>
					</form>
				)}

				<p className="mt-8 text-[11px] text-text-muted text-center leading-relaxed">
					🔒 Privacy Promise: Messages are stored securely and never linked to advertising profiles or shared with third parties.
				</p>
			</div>

			{/* Footer spacer */}
			<div className="py-6 shrink-0" />
		</div>
	);
}
