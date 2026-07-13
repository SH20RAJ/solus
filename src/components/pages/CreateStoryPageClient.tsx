"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

export default function CreateStoryPageClient() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [caption, setCaption] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showCeremony, setShowCeremony] = useState(false);

	const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files?.[0];
		if (!selected) return;

		setFile(selected);
		const url = URL.createObjectURL(selected);
		setPreview(url);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) {
			alert("Stories require a photo or video file.");
			return;
		}

		setIsSubmitting(true);

		try {
			let mediaType: "image" | "video" | "audio" = "image";
			if (file.type.startsWith("video/")) {
				mediaType = "video";
			} else if (file.type.startsWith("audio/")) {
				mediaType = "audio";
			}

			// presign upload
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

			await fetch(presignData.data.uploadUrl, {
				method: "PUT",
				headers: { "Content-Type": file.type },
				credentials: "include",
				body: file,
			});

			// Create story
			await fetch("/api/stories", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					mediaUrl: presignData.data.uploadUrl,
					mediaType,
					caption: caption || undefined,
				}),
			});

			await mutate("/api/stories");
			setShowCeremony(true);
		} catch {
			alert("Failed to post story.");
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
					Story moment uploaded
				</h1>
				<p className="text-xs text-text-muted mt-2">
					This snapshot will automatically archive in 24 hours.
				</p>

				<button
					type="button"
					onClick={() => router.push("/home")}
					className="w-full h-11 rounded-[14px] bg-text-primary text-background text-xs font-bold transition-all duration-300 hover:opacity-95 active:scale-[0.98] cursor-pointer mt-10 shadow-lg"
				>
					Continue to Feed
				</button>
			</div>
		);
	}

	return (
		<div className="py-6 sm:py-12 px-4 sm:px-6 w-full max-w-[560px] mx-auto animate-slide-up select-none font-sans text-left">
			<header className="mb-8 flex items-center justify-between">
				<div>
					<span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-mono text-accent font-semibold">
						Sanctuary Story
					</span>
					<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary font-serif mt-1">
						New Snap Moment
					</h1>
				</div>
				<Link href="/create" className="text-xs text-text-muted hover:text-text-primary">
					← Back
				</Link>
			</header>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Media dropzone */}
				<div className="p-4 rounded-[24px] border border-border/30 bg-card/40 flex flex-col items-center justify-center text-center shadow-inner">
					{preview ? (
						<div className="relative rounded-xl overflow-hidden bg-surface border border-border/20 p-1 flex items-center justify-center w-full">
							{file?.type.startsWith("video/") ? (
								<video src={preview} controls className="w-full max-h-72 object-cover rounded-lg" />
							) : (
								<div className="relative w-full h-72">
									<Image src={preview} alt="Upload preview" fill className="object-contain" />
								</div>
							)}
							<button
								type="button"
								onClick={() => {
									setFile(null);
									setPreview(null);
								}}
								className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/85 hover:bg-black text-white text-xs flex items-center justify-center cursor-pointer shadow"
							>
								✕
							</button>
						</div>
					) : (
						<div
							onClick={() => fileInputRef.current?.click()}
							className="w-full aspect-[4/3] border-2 border-dashed border-border/50 rounded-xl flex flex-col items-center justify-center gap-2 bg-surface/50 hover:bg-surface hover:border-accent cursor-pointer transition-all duration-200"
						>
							<span className="text-3xl">📷</span>
							<span className="text-xs text-text-primary font-semibold">Choose photo or video</span>
							<p className="text-[10px] text-text-muted max-w-[240px]">Supports standard image and video files.</p>
						</div>
					)}
				</div>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/*,video/*"
					onChange={handleFileSelect}
					className="hidden"
				/>

				{/* Caption input */}
				<div className="space-y-2">
					<label htmlFor="caption" className="block text-[10px] uppercase tracking-wider font-mono text-text-muted">
						Optional Story Caption
					</label>
					<input
						id="caption"
						type="text"
						value={caption}
						onChange={(e) => setCaption(e.target.value)}
						placeholder="Add a fast text note overlay..."
						className="w-full h-11 px-4 rounded-[14px] border border-border/40 bg-card text-text-primary text-xs placeholder:text-text-muted/50 focus:outline-none"
					/>
				</div>

				{/* Upload Button */}
				<button
					type="submit"
					disabled={isSubmitting || !file}
					className="w-full h-11 rounded-[14px] bg-accent text-background text-xs font-bold transition-all duration-300 hover:opacity-95 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-lg shadow-accent/5 font-mono uppercase tracking-wider"
				>
					{isSubmitting ? "Uploading story..." : "Post Story"}
				</button>
			</form>
		</div>
	);
}
