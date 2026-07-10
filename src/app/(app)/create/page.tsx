"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

const MOODS = ["Happy", "Calm", "Grateful", "Reflective", "Tired", "Excited", "Peaceful"] as const;

export default function CreatePage() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [caption, setCaption] = useState("");
	const [location, setLocation] = useState("");
	const [mood, setMood] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files?.[0];
		if (!selected) return;

		setFile(selected);
		const url = URL.createObjectURL(selected);
		setPreview(url);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			let mediaUrl: string | undefined;
			let mediaType: "image" | "video" | undefined;

			// Upload file to R2 if selected
			if (file) {
				mediaType = file.type.startsWith("video/") ? "video" : "image";

				// Step 1: Get upload key
				const presignRes = await fetch("/api/upload/presign", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({
						filename: file.name,
						contentType: file.type,
						size: file.size,
					}),
				});
				const presignData = await presignRes.json() as { data: { uploadUrl: string } };

				// Step 2: Upload binary
				await fetch(presignData.data.uploadUrl, {
					method: "PUT",
					headers: { "Content-Type": file.type },
					credentials: "include",
					body: file,
				});

				mediaUrl = presignData.data.uploadUrl;
			}

			// Step 3: Create post
			await fetch("/api/posts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					caption: caption || undefined,
					mediaUrl,
					mediaType,
					location: location || undefined,
					mood: mood || undefined,
				}),
			});

			// Revalidate SWR cache
			await mutate("/api/posts");

			router.push("/home");
		} catch {
			// Silently handle — could add toast later
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="py-10 sm:py-16 max-w-[560px] mx-auto animate-slide-up">
			<header className="mb-10">
				<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary font-serif">
					Capture a moment
				</h1>
				<p className="mt-1.5 text-xs sm:text-sm text-text-muted leading-relaxed">
					This entry is entirely private and saved securely for you.
				</p>
			</header>

			<form onSubmit={handleSubmit} className="space-y-8">
				{/* Photo / Video upload */}
				<div className="space-y-2">
					<span className="block text-xs uppercase tracking-wider font-mono text-text-muted">
						Media
					</span>
					{preview ? (
						<div className="relative rounded-[24px] overflow-hidden bg-surface border border-border/30 group">
							<Image
								src={preview}
								alt="Preview"
								width={560}
								height={420}
								className="w-full aspect-[4/3] object-cover"
							/>
							<button
								type="button"
								onClick={() => {
									setFile(null);
									setPreview(null);
								}}
								className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 hover:bg-background text-text-primary shadow-md flex items-center justify-center text-sm cursor-pointer transition-all active:scale-90"
								aria-label="Remove media"
							>
								✕
							</button>
						</div>
					) : (
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="w-full aspect-[16/10] rounded-[24px] border border-dashed border-border/60 bg-card hover:bg-surface/50 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 ease-out hover:border-text-muted"
						>
							<div className="w-10 h-10 rounded-full bg-surface border border-border/40 flex items-center justify-center text-text-muted">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
									<polyline points="17 8 12 3 7 8" />
									<line x1="12" y1="3" x2="12" y2="15" />
								</svg>
							</div>
							<span className="text-xs text-text-secondary font-medium">
								Upload a photo or video
							</span>
						</button>
					)}
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*,video/*"
						onChange={handleFileSelect}
						className="hidden"
					/>
				</div>

				{/* Caption */}
				<div className="space-y-2">
					<label htmlFor="caption" className="block text-xs uppercase tracking-wider font-mono text-text-muted">
						Reflection
					</label>
					<textarea
						id="caption"
						value={caption}
						onChange={(e) => setCaption(e.target.value)}
						placeholder="Write down your thoughts, feelings, or memories..."
						rows={5}
						maxLength={2000}
						className="w-full px-4 py-3.5 rounded-[16px] border border-border/40 bg-card text-text-primary text-sm placeholder:text-text-muted/60 resize-none focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent transition-all duration-200 ease-out leading-relaxed"
					/>
				</div>

				{/* Location */}
				<div className="space-y-2">
					<label htmlFor="location" className="block text-xs uppercase tracking-wider font-mono text-text-muted">
						Location
					</label>
					<input
						id="location"
						type="text"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						placeholder="Where are you writing this from?"
						maxLength={200}
						className="w-full h-11 px-4 rounded-[14px] border border-border/40 bg-card text-text-primary text-sm placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent transition-all duration-200 ease-out"
					/>
				</div>

				{/* Mood */}
				<div className="space-y-3">
					<span className="block text-xs uppercase tracking-wider font-mono text-text-muted">
						Current Mood
					</span>
					<div className="flex flex-wrap gap-2">
						{MOODS.map((m) => (
							<button
								key={m}
								type="button"
								onClick={() => setMood(mood === m ? "" : m)}
								className={`px-3.5 py-1.5 rounded-[10px] text-xs font-medium transition-all duration-200 ease-out cursor-pointer active:scale-95 ${
									mood === m
										? "bg-accent/15 text-accent border border-accent/30"
										: "border border-border/40 text-text-secondary bg-card hover:bg-surface hover:border-border"
								}`}
							>
								{m}
							</button>
						))}
					</div>
				</div>

				{/* Submit */}
				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full h-11 rounded-[12px] bg-text-primary text-background text-sm font-medium transition-all duration-200 ease-out hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
				>
					{isSubmitting ? "Saving entry..." : "Save Private Entry"}
				</button>
			</form>
		</div>
	);
}
