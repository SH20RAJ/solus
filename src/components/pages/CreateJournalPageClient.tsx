"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import TiptapEditor from "@/components/TiptapEditor";

export default function CreateJournalPageClient() {
	const router = useRouter();
	const coverInputRef = useRef<HTMLInputElement>(null);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [coverFile, setCoverFile] = useState<File | null>(null);
	const [coverPreview, setCoverPreview] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showCeremony, setShowCeremony] = useState(false);

	const handleCoverSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files?.[0];
		if (!selected) return;

		setCoverFile(selected);
		const url = URL.createObjectURL(selected);
		setCoverPreview(url);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) {
			alert("Journals require a title.");
			return;
		}

		setIsSubmitting(true);

		try {
			let coverUrl: string | undefined;

			if (coverFile) {
				const presignRes = await fetch("/api/upload/presign", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({
						filename: coverFile.name,
						contentType: coverFile.type,
						size: coverFile.size,
					}),
				});
				const presignData = (await presignRes.json()) as { data: { uploadUrl: string } };

				await fetch(presignData.data.uploadUrl, {
					method: "PUT",
					headers: { "Content-Type": coverFile.type },
					credentials: "include",
					body: coverFile,
				});

				coverUrl = presignData.data.uploadUrl;
			}

			// Create journal
			await fetch("/api/collections", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					title,
					description: description || undefined,
					coverUrl,
				}),
			});

			await mutate("/api/collections");
			setShowCeremony(true);
		} catch {
			alert("Failed to create Journal Book.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (showCeremony) {
		return (
			<div className="py-16 sm:py-24 px-4 sm:px-6 w-full max-w-[500px] mx-auto text-center animate-fade-in font-sans">
				<div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent text-2xl mb-6 shadow-sm">
					✓
				</div>
				<h1 className="text-2xl font-semibold tracking-tight text-text-primary font-serif">
					Journal book created
				</h1>
				<p className="text-xs text-text-muted mt-2">
					Your new diary log is ready. You can now add posts to this collection.
				</p>

				<button
					type="button"
					onClick={() => router.push("/profile")}
					className="w-full h-11 rounded-[14px] bg-text-primary text-background text-xs font-bold transition-all duration-300 hover:opacity-95 active:scale-[0.98] cursor-pointer mt-10 shadow-lg"
				>
					Go to Profile
				</button>
			</div>
		);
	}

	return (
		<div className="py-6 sm:py-12 px-4 sm:px-6 w-full max-w-[560px] mx-auto animate-slide-up select-none font-sans text-left">
			<header className="mb-8 flex items-center justify-between">
				<div>
					<span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-mono text-accent font-semibold">
						Sanctuary Journal
					</span>
					<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary font-serif mt-1">
						New Journal Book
					</h1>
				</div>
				<Link href="/create" className="text-xs text-text-muted hover:text-text-primary">
					← Back
				</Link>
			</header>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Title input */}
				<div className="space-y-2">
					<label htmlFor="title" className="block text-[10px] uppercase tracking-wider font-mono text-text-muted">
						Journal Title
					</label>
					<input
						id="title"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="e.g. Travel Reflections 2026..."
						required
						className="w-full h-11 px-4 rounded-[14px] border border-border/40 bg-card text-text-primary text-xs placeholder:text-text-muted/50 focus:outline-none"
					/>
				</div>

				{/* Cover photo */}
				<div className="space-y-2">
					<label className="block text-[10px] uppercase tracking-wider font-mono text-text-muted">
						Cover Photo
					</label>
					{coverPreview ? (
						<div className="relative rounded-xl overflow-hidden bg-surface border border-border/20 p-1 flex items-center justify-center">
							<div className="relative w-full h-44">
								<Image src={coverPreview} alt="Cover preview" fill className="object-contain" />
							</div>
							<button
								type="button"
								onClick={() => {
									setCoverFile(null);
									setCoverPreview(null);
								}}
								className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/85 hover:bg-black text-white text-xs flex items-center justify-center cursor-pointer shadow"
							>
								✕
							</button>
						</div>
					) : (
						<div
							onClick={() => coverInputRef.current?.click()}
							className="w-full aspect-[21/9] border-2 border-dashed border-border/50 rounded-xl flex flex-col items-center justify-center gap-2 bg-surface/50 hover:bg-surface hover:border-accent cursor-pointer transition-all duration-200"
						>
							<span className="text-2xl">🖼️</span>
							<span className="text-xs text-text-secondary font-semibold">Upload cover photo</span>
						</div>
					)}
					<input
						ref={coverInputRef}
						type="file"
						accept="image/*"
						onChange={handleCoverSelect}
						className="hidden"
					/>
				</div>

				{/* Description */}
				<div className="space-y-2">
					<label className="block text-[10px] uppercase tracking-wider font-mono text-text-muted">
						Introduction / description
					</label>
					<TiptapEditor onChange={setDescription} placeholder="Write introductory words or details for this journal..." />
				</div>

				{/* Save button */}
				<button
					type="submit"
					disabled={isSubmitting || !title.trim()}
					className="w-full h-11 rounded-[14px] bg-accent text-background text-xs font-bold transition-all duration-300 hover:opacity-95 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-lg shadow-accent/5 font-mono uppercase tracking-wider"
				>
					{isSubmitting ? "Creating Journal..." : "Create Journal"}
				</button>
			</form>
		</div>
	);
}
