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
		<div className="py-8 sm:py-12">
			<header className="mb-10">
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
					Capture a moment.
				</h1>
				<p className="mt-1 text-sm text-text-muted">
					Nobody will see this unless you decide to share it.
				</p>
			</header>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Photo / Video upload */}
				<div>
					{preview ? (
						<div className="relative rounded-[20px] overflow-hidden bg-surface">
							<Image
								src={preview}
								alt="Preview"
								width={760}
								height={760}
								className="w-full aspect-square object-cover"
							/>
							<button
								type="button"
								onClick={() => {
									setFile(null);
									setPreview(null);
								}}
								className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center text-sm cursor-pointer"
								aria-label="Remove photo"
							>
								✕
							</button>
						</div>
					) : (
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="w-full aspect-video rounded-[20px] border-2 border-dashed border-border bg-card flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors duration-200 ease-out hover:border-text-muted"
						>
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
								<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
								<circle cx="9" cy="9" r="2" />
								<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
							</svg>
							<span className="text-sm text-text-muted">
								Add a photo or video
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
				<div>
					<label htmlFor="caption" className="block text-sm font-medium text-text-primary mb-2">
						Caption
					</label>
					<textarea
						id="caption"
						value={caption}
						onChange={(e) => setCaption(e.target.value)}
						placeholder="What's on your mind?"
						rows={3}
						maxLength={2000}
						className="w-full px-4 py-3 rounded-[14px] border border-border bg-card text-text-primary text-base placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors duration-200 ease-out"
					/>
				</div>

				{/* Location */}
				<div>
					<label htmlFor="location" className="block text-sm font-medium text-text-primary mb-2">
						Location
						<span className="text-text-muted font-normal ml-1">(optional)</span>
					</label>
					<input
						id="location"
						type="text"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						placeholder="Where are you?"
						maxLength={200}
						className="w-full h-12 px-4 rounded-[14px] border border-border bg-card text-text-primary text-base placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors duration-200 ease-out"
					/>
				</div>

				{/* Mood */}
				<div>
					<span className="block text-sm font-medium text-text-primary mb-3">
						Mood
						<span className="text-text-muted font-normal ml-1">(optional)</span>
					</span>
					<div className="flex flex-wrap gap-2">
						{MOODS.map((m) => (
							<button
								key={m}
								type="button"
								onClick={() => setMood(mood === m ? "" : m)}
								className={`px-4 py-2 rounded-[12px] text-sm transition-colors duration-200 ease-out cursor-pointer ${
									mood === m
										? "bg-accent text-white"
										: "border border-border text-text-secondary hover:border-text-muted"
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
					className="w-full h-12 rounded-[12px] bg-text-primary text-background text-sm font-medium transition-opacity duration-200 ease-out hover:opacity-85 disabled:opacity-50 cursor-pointer"
				>
					{isSubmitting ? "Saving..." : "Save Memory"}
				</button>
			</form>
		</div>
	);
}
