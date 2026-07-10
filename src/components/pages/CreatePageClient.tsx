"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import dynamic from "next/dynamic";

// Dynamically import BlockNoteEditor to prevent SSR window reference hydration mismatch errors
const BlockNoteEditor = dynamic(() => import("@/components/BlockNoteEditor"), {
	ssr: false,
	loading: () => (
		<div className="h-44 w-full bg-card/60 border border-border/25 rounded-2xl animate-pulse flex items-center justify-center text-xs text-text-muted">
			Booting rich block editor...
		</div>
	),
});

const MOODS = [
	{ name: "Happy", color: "from-amber-500/10 to-yellow-500/10 text-amber-300 border-amber-500/30" },
	{ name: "Calm", color: "from-sky-500/10 to-blue-500/10 text-sky-300 border-sky-500/30" },
	{ name: "Grateful", color: "from-emerald-500/10 to-teal-500/10 text-emerald-300 border-emerald-500/30" },
	{ name: "Reflective", color: "from-indigo-500/10 to-violet-500/10 text-indigo-300 border-indigo-500/30" },
	{ name: "Tired", color: "from-zinc-500/10 to-neutral-500/10 text-zinc-400 border-zinc-500/30" },
	{ name: "Excited", color: "from-rose-500/10 to-pink-500/10 text-rose-300 border-rose-500/30" },
	{ name: "Peaceful", color: "from-teal-500/10 to-cyan-500/10 text-teal-300 border-teal-500/30" },
] as const;

export default function CreatePageClient() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [entryType, setEntryType] = useState<"post" | "story">("post");
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [caption, setCaption] = useState("");
	const [location, setLocation] = useState("");
	const [mood, setMood] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [useRichEditor, setUseRichEditor] = useState(false);

	// Voice Note recording states
	const [isRecording, setIsRecording] = useState(false);
	const [recordingDuration, setRecordingDuration] = useState(0);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;

			const chunks: Blob[] = [];
			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) chunks.push(e.data);
			};

			mediaRecorder.onstop = () => {
				const blob = new Blob(chunks, { type: "audio/webm" });
				const audioFile = new File([blob], `voicenote-${Date.now()}.webm`, { type: "audio/webm" });
				setFile(audioFile);
				setPreview(URL.createObjectURL(blob));
			};

			mediaRecorder.start();
			setIsRecording(true);
			setRecordingDuration(0);
			timerRef.current = setInterval(() => {
				setRecordingDuration((d) => d + 1);
			}, 1000);
		} catch (err) {
			alert("Microphone permission denied or recording is not supported in this browser.");
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
			setIsRecording(false);
			if (timerRef.current) clearInterval(timerRef.current);
		}
	};

	const formatDuration = (sec: number) => {
		const mins = Math.floor(sec / 60);
		const secs = sec % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

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
			alert("Stories require a photo, video or audio file.");
			return;
		}

		setIsSubmitting(true);

		try {
			let mediaUrl: string | undefined;
			let mediaType: "image" | "video" | "audio" | undefined;

			// Upload file if selected
			if (file) {
				if (file.type.startsWith("video/")) {
					mediaType = "video";
				} else if (file.type.startsWith("audio/") || file.name.endsWith(".webm")) {
					mediaType = "audio";
				} else {
					mediaType = "image";
				}

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

	const isAudio = file?.type.startsWith("audio/") || file?.name.endsWith(".webm");
	const isVideo = file?.type.startsWith("video/");

	return (
		<div className="py-6 sm:py-12 px-4 sm:px-6 w-full max-w-[720px] mx-auto animate-slide-up select-none font-sans">
			{/* Header */}
			<header className="mb-6 sm:mb-8 text-left">
				<span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-mono text-accent font-semibold">
					Share Privately
				</span>
				<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary font-serif mt-1">
					Create Post
				</h1>
				<p className="mt-1 text-xs text-text-muted leading-relaxed">
					Publish to your feed or moments. All files remain strictly under your control.
				</p>
			</header>

			{/* Sliding segmented controller tab bar */}
			<div className="p-1 rounded-xl bg-card border border-border/20 mb-6 sm:mb-8 max-w-sm flex items-center shadow-inner">
				<button
					type="button"
					onClick={() => {
						setEntryType("post");
						setFile(null);
						setPreview(null);
					}}
					className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
						entryType === "post"
							? "bg-[#0c0c0e] text-accent border border-accent/20 shadow-sm"
							: "text-text-secondary hover:text-text-primary"
					}`}
				>
					Post
				</button>
				<button
					type="button"
					onClick={() => {
						setEntryType("story");
						setFile(null);
						setPreview(null);
					}}
					className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
						entryType === "story"
							? "bg-[#0c0c0e] text-accent border border-accent/20 shadow-sm"
							: "text-text-secondary hover:text-text-primary"
					}`}
				>
					Story
				</button>
			</div>

			<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
				{/* Column 1: Media drop zone */}
				<div className="space-y-4">
					<label className="block text-[10px] uppercase tracking-wider font-mono text-text-muted">
						Post Media
					</label>

					{preview ? (
						<div className="relative rounded-[24px] sm:rounded-[28px] overflow-hidden bg-card border border-border/30 p-2 sm:p-3 shadow-xl group transition-all duration-300 hover:border-border/60">
							{isAudio ? (
								<div className="flex flex-col items-center justify-center py-8 px-4 gap-4 bg-[#0c0c0e]/80 rounded-xl sm:rounded-2xl border border-border/20">
									<div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent animate-pulse">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
											<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
											<line x1="12" y1="19" x2="12" y2="22" />
										</svg>
									</div>
									<audio src={preview} controls className="w-full mt-2" />
									<span className="text-[9px] uppercase tracking-widest font-mono text-text-muted font-bold">
										Voice Note Recording
									</span>
								</div>
							) : isVideo ? (
								<video
									src={preview}
									controls
									className="w-full aspect-[4/3] object-cover rounded-xl sm:rounded-2xl border border-border/20"
								/>
							) : (
								<div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border border-border/20">
									<Image
										src={preview}
										alt="Selected Preview"
										fill
										className="object-cover"
									/>
								</div>
							)}
							
							{/* Clear media button overlay */}
							<button
								type="button"
								onClick={() => {
									setFile(null);
									setPreview(null);
								}}
								className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 rounded-full bg-black/75 hover:bg-black text-white shadow-lg flex items-center justify-center text-sm cursor-pointer transition-transform duration-200 active:scale-95 z-10"
								aria-label="Remove media"
							>
								✕
							</button>
						</div>
					) : (
						<div className="space-y-4">
							{/* Styled Upload Area */}
							<div
								onClick={() => fileInputRef.current?.click()}
								className="w-full aspect-[4/3] rounded-[24px] sm:rounded-[28px] border-2 border-dashed border-border/50 bg-card hover:bg-surface/30 flex flex-col items-center justify-center gap-3.5 cursor-pointer transition-all duration-300 ease-out hover:border-accent hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group"
							>
								<div className="w-10 h-10 rounded-full bg-surface border border-border/40 flex items-center justify-center text-text-muted group-hover:scale-105 group-hover:text-accent group-hover:border-accent/40 transition-all duration-300">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
										<polyline points="17 8 12 3 7 8" />
										<line x1="12" y1="3" x2="12" y2="15" />
									</svg>
								</div>
								<div className="text-center px-4">
									<span className="text-xs text-text-primary font-bold group-hover:text-accent transition-colors duration-200 block">
										Attach Photo, Video, or Audio
									</span>
									<span className="text-[10px] text-text-muted mt-1 block">
										Drag and drop or browse files
									</span>
								</div>
								{entryType === "story" && (
									<span className="text-[9px] uppercase tracking-wider font-mono font-bold text-red-400 bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10">
										Required for Stories
									</span>
								)}
							</div>

							{/* Voice Recording Panel */}
							<div className="p-4 sm:p-6 rounded-[24px] sm:rounded-[28px] border border-border/30 bg-card/40 flex flex-col items-center justify-center gap-4 text-center">
								{isRecording ? (
									<div className="space-y-4 w-full">
										<div className="flex flex-col items-center gap-2">
											{/* pulsating recording circle indicator */}
											<div className="relative w-12 h-12 flex items-center justify-center">
												<span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
												<span className="absolute inset-2 rounded-full bg-red-500/40 animate-pulse" />
												<span className="w-6 h-6 rounded-full bg-red-500" />
											</div>
											<span className="text-xs font-mono font-bold text-text-primary tracking-wider mt-2">
												RECORDING ({formatDuration(recordingDuration)})
											</span>
										</div>
										<button
											type="button"
											onClick={stopRecording}
											className="px-6 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all active:scale-[0.97] cursor-pointer shadow-lg shadow-red-500/20"
										>
											Stop & Save
										</button>
									</div>
								) : (
									<div className="space-y-3 w-full">
										<p className="text-[9px] uppercase tracking-widest font-mono text-text-muted font-bold">
											Or record voice notes
										</p>
										<button
											type="button"
											onClick={startRecording}
											className="h-10 px-5 rounded-xl border border-border bg-surface hover:bg-card text-text-secondary hover:text-text-primary text-xs font-semibold flex items-center justify-center gap-2.5 mx-auto cursor-pointer transition-all duration-200 hover:border-accent"
										>
											<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" className="text-accent">
												<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
												<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
												<line x1="12" y1="19" x2="12" y2="22" />
											</svg>
											Record Voice Note
										</button>
									</div>
								)}
							</div>
						</div>
					)}
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*,video/*,audio/*"
						onChange={handleFileSelect}
						className="hidden"
					/>
				</div>

				{/* Column 2: Form Details */}
				<div className="space-y-6 w-full">
					{/* Text editor option toggle */}
					{entryType === "post" && (
						<div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/25 shadow-inner">
							<span className="text-xs font-bold text-text-secondary">Notion-style Editor</span>
							<button
								type="button"
								onClick={() => setUseRichEditor(!useRichEditor)}
								className={`w-10 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 flex items-center ${
									useRichEditor ? "bg-accent" : "bg-surface border border-border/40"
								}`}
							>
								<div className={`w-5 h-5 rounded-full bg-white transition-all shadow-md ${useRichEditor ? "translate-x-4" : "translate-x-0"}`} />
							</button>
						</div>
					)}

					{/* Caption (Standard textarea or BlockNote) */}
					<div className="space-y-2">
						<label htmlFor="caption" className="block text-[10px] uppercase tracking-wider font-mono text-text-muted">
							Post Caption
						</label>
						{useRichEditor && entryType === "post" ? (
							<BlockNoteEditor onChange={setCaption} />
						) : (
							<textarea
								id="caption"
								value={caption}
								onChange={(e) => setCaption(e.target.value)}
								placeholder={
									entryType === "story"
										? "Add a short caption to your story..."
										: "Write down your thoughts, feelings, or memories..."
								}
								rows={entryType === "story" ? 4 : 6}
								maxLength={2000}
								className="w-full px-4 py-4 rounded-[20px] border border-border/40 bg-card text-text-primary text-sm placeholder:text-text-muted/50 resize-none focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent transition-all duration-300 leading-relaxed font-serif"
							/>
						)}
					</div>

					{/* Location (Post only) */}
					{entryType === "post" && (
						<div className="space-y-2">
							<label htmlFor="location" className="block text-[10px] uppercase tracking-wider font-mono text-text-muted">
								Location
							</label>
							<div className="relative">
								<input
									id="location"
									type="text"
									value={location}
									onChange={(e) => setLocation(e.target.value)}
									placeholder="e.g. Kyoto, Japan or Home Studio"
									maxLength={200}
									className="w-full h-11 pl-9 pr-4 rounded-[14px] border border-border/40 bg-card text-text-primary text-xs placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent transition-all duration-300"
								/>
								<span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[11px]">
									📍
								</span>
							</div>
						</div>
					)}

					{/* Mood (Post only) */}
					{entryType === "post" && (
						<div className="space-y-2.5">
							<span className="block text-[10px] uppercase tracking-wider font-mono text-text-muted">
								Vibe
							</span>
							<div className="flex flex-wrap gap-2">
								{MOODS.map((m) => (
									<button
										key={m.name}
										type="button"
										onClick={() => setMood(mood === m.name ? "" : m.name)}
										className={`px-3 py-1.5 rounded-[12px] text-xs font-semibold transition-all duration-300 cursor-pointer active:scale-95 border ${
											mood === m.name
												? `bg-gradient-to-r ${m.color} shadow-sm shadow-accent/5`
												: "border-border/40 text-text-secondary bg-card hover:bg-surface"
										}`}
									>
										{m.name}
									</button>
								))}
							</div>
						</div>
					)}

					{/* Story Info Alert */}
					{entryType === "story" && (
						<div className="p-4 rounded-[20px] bg-accent/5 border border-accent/20 text-[11px] text-text-secondary leading-relaxed flex items-start gap-2">
							<span className="text-accent">ℹ</span>
							<span>Stories expire automatically 24 hours after they are published, keeping your feed pristine.</span>
						</div>
					)}

					{/* Submit button */}
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full h-11 rounded-[14px] bg-accent text-background text-xs font-bold transition-all duration-300 hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-lg shadow-accent/5"
					>
						{isSubmitting
							? "Publishing..."
							: entryType === "story"
								? "Publish Story"
								: "Publish Post"}
					</button>
				</div>
			</form>
		</div>
	);
}
