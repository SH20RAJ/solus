"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

const MOODS = ["Happy", "Calm", "Grateful", "Reflective", "Tired", "Excited", "Peaceful"] as const;

export default function CreatePage() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [entryType, setEntryType] = useState<"post" | "story">("post");
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
		if (entryType === "story" && !file) {
			alert("Stories require an image or video.");
			return;
		}

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
				const presignData = (await presignRes.json()) as { data: { uploadUrl: string } };

				// Step 2: Upload binary
				await fetch(presignData.data.uploadUrl, {
					method: "PUT",
					headers: { "Content-Type": file.type },
					credentials: "include",
					body: file,
				});

				mediaUrl = presignData.data.uploadUrl;
			}

			if (entryType === "story") {
				// Create story
				await fetch("/api/stories", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({
						mediaUrl: mediaUrl!,
						mediaType: mediaType!,
						caption: caption || undefined,
					}),
				});
				await mutate("/api/stories");
			} else {
				// Create post
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
				await mutate("/api/posts");
			}

			router.push("/home");
		} catch {
			// Silently handle
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="py-10 sm:py-16 max-w-[800px] mx-auto animate-slide-up select-none">
			{/* Header */}
			<header className="mb-10 text-center sm:text-left">
				<h1 className="text-3xl font-semibold tracking-tight text-text-primary font-serif">
					Unified Creator
				</h1>
				<p className="mt-1.5 text-xs text-text-muted leading-relaxed">
					Keep moments private or publish them to journeys later.
				</p>
			</header>

			{/* Post vs Story Switcher Tabs */}
			<div className="flex justify-center sm:justify-start border-b border-border/20 mb-10">
				<button
					type="button"
					onClick={() => {
						setEntryType("post");
						setFile(null);
						setPreview(null);
					}}
					className={`flex items-center gap-2 py-4 px-6 text-xs uppercase font-mono tracking-wider transition-colors cursor-pointer border-b -mt-[1px] ${
						entryType === "post"
							? "border-accent text-accent font-semibold"
							: "border-transparent text-text-muted hover:text-text-primary"
					}`}
				>
					Reflection Post
				</button>
				<button
					type="button"
					onClick={() => {
						setEntryType("story");
						setFile(null);
						setPreview(null);
					}}
					className={`flex items-center gap-2 py-4 px-6 text-xs uppercase font-mono tracking-wider transition-colors cursor-pointer border-b -mt-[1px] ${
						entryType === "story"
							? "border-accent text-accent font-semibold"
							: "border-transparent text-text-muted hover:text-text-primary"
					}`}
				>
					24H Story
				</button>
			</div>

			<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
				{/* Column 1: Media selector */}
				<div className="space-y-3">
					<span className="block text-xs uppercase tracking-wider font-mono text-text-muted">
						Media Attachment
					</span>
					{preview ? (
						<div className="relative rounded-[24px] overflow-hidden bg-surface border border-border/30 group shadow-md transition-shadow hover:shadow-lg">
							<Image
								src={preview}
								alt="Selected Preview"
								width={400}
								height={300}
								className="w-full aspect-[4/3] object-cover"
							/>
							<button
								type="button"
								onClick={() => {
									setFile(null);
									setPreview(null);
								}}
								className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 hover:bg-background text-text-primary shadow-md flex items-center justify-center text-sm cursor-pointer transition-transform active:scale-90"
								aria-label="Remove media"
							>
								✕
							</button>
						</div>
					) : (
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="w-full aspect-[4/3] rounded-[24px] border border-dashed border-border/60 bg-card hover:bg-surface/50 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 ease-out hover:border-text-muted"
						>
							<div className="w-10 h-10 rounded-full bg-surface border border-border/40 flex items-center justify-center text-text-muted">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
									<polyline points="17 8 12 3 7 8" />
									<line x1="12" y1="3" x2="12" y2="15" />
								</svg>
							</div>
							<span className="text-xs text-text-secondary font-medium">
								Upload a photo or video
							</span>
							{entryType === "story" && (
								<span className="text-[10px] text-danger font-medium">
									* Required for Stories
								</span>
							)}
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

				{/* Column 2: Form Details */}
				<div className="space-y-6">
					{/* Caption */}
					<div className="space-y-2">
						<label htmlFor="caption" className="block text-xs uppercase tracking-wider font-mono text-text-muted">
							Reflection Text
						</label>
						<textarea
							id="caption"
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
							placeholder={
								entryType === "story"
									? "Add a short caption to your story..."
									: "Write down your thoughts, feelings, or memories..."
							}
							rows={entryType === "story" ? 3 : 5}
							maxLength={2000}
							className="w-full px-4 py-3.5 rounded-[16px] border border-border/40 bg-card text-text-primary text-sm placeholder:text-text-muted/60 resize-none focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent transition-all duration-200 ease-out leading-relaxed"
						/>
					</div>

					{/* Location (Post only) */}
					{entryType === "post" && (
						<div className="space-y-2">
							<label htmlFor="location" className="block text-xs uppercase tracking-wider font-mono text-text-muted">
								Location
							</label>
							<input
								id="location"
								type="text"
								value={location}
								onChange={(e) => setLocation(e.target.value)}
								placeholder="Where did this happen?"
								maxLength={200}
								className="w-full h-11 px-4 rounded-[14px] border border-border/40 bg-card text-text-primary text-sm placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent transition-all duration-200 ease-out"
							/>
						</div>
					)}

					{/* Mood (Post only) */}
					{entryType === "post" && (
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
										className={`px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all duration-200 ease-out cursor-pointer active:scale-95 ${
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
					)}

					{/* Story Info Alert */}
					{entryType === "story" && (
						<div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 text-xs text-text-secondary leading-relaxed">
							📝 Stories will disappear automatically from your feed 24 hours after publication, but remain saved in your private archives.
						</div>
					)}

					{/* Submit button */}
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full h-11 rounded-[12px] bg-text-primary text-background text-sm font-medium transition-all duration-200 ease-out hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
					>
						{isSubmitting
							? "Publishing..."
							: entryType === "story"
								? "Share to Stories"
								: "Save Private Entry"}
					</button>
				</div>
			</form>
		</div>
	);
}
