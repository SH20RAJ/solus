"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

const MOODS = ["Happy", "Calm", "Grateful", "Reflective", "Tired", "Excited", "Peaceful"] as const;

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
			alert("Stories require a photo, video or voice note.");
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
		<div className="py-8 sm:py-12 w-full animate-slide-up select-none">
			{/* Header */}
			<header className="mb-10 text-center sm:text-left">
				<h1 className="text-3xl font-semibold tracking-tight text-text-primary font-serif">
					Unified Creator
				</h1>
				<p className="mt-1.5 text-xs text-text-muted leading-relaxed">
					Keep moments private or publish them to collections later.
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
						<div className="relative rounded-[24px] overflow-hidden bg-surface border border-border/30 p-4 shadow-md transition-shadow hover:shadow-lg">
							{isAudio ? (
								<div className="flex flex-col items-center justify-center py-8 px-4 gap-4 bg-card/65 rounded-xl border border-border/25">
									<div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent animate-pulse">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
											<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
											<line x1="12" y1="19" x2="12" y2="22" />
										</svg>
									</div>

									<audio src={preview} controls className="w-full mt-2" />

									<span className="text-[10px] uppercase tracking-wider font-mono text-text-muted">
										Voice Note Reflection
									</span>
								</div>
							) : isVideo ? (
								<video
									src={preview}
									controls
									className="w-full aspect-[4/3] object-cover rounded-xl"
								/>
							) : (
								<Image
									src={preview}
									alt="Selected Preview"
									width={400}
									height={300}
									className="w-full aspect-[4/3] object-cover rounded-xl"
								/>
							)}
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
						<div className="space-y-4">
							{/* Upload button */}
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
									Upload photo, video, or audio
								</span>
								{entryType === "story" && (
									<span className="text-[10px] text-danger font-medium">
										* Required for Stories
									</span>
								)}
							</button>

							{/* Voice Recording panel */}
							<div className="p-5 rounded-[24px] border border-border/30 bg-card/60 flex flex-col items-center justify-center gap-3 text-center">
								{isRecording ? (
									<div className="space-y-3 w-full">
										<div className="flex items-center justify-center gap-2">
											<span className="w-2.5 h-2.5 rounded-full bg-danger animate-ping" />
											<span className="text-xs font-mono font-bold text-text-primary">
												Recording ({formatDuration(recordingDuration)})
											</span>
										</div>
										<button
											type="button"
											onClick={stopRecording}
											className="px-6 h-9 rounded-full bg-danger text-white text-xs font-bold transition-transform active:scale-95 cursor-pointer flex items-center justify-center mx-auto gap-2"
										>
											Stop Recording
										</button>
									</div>
								) : (
									<div className="space-y-2 w-full">
										<p className="text-[10px] uppercase tracking-wider font-mono text-text-muted">
											Or record voice notes
										</p>
										<button
											type="button"
											onClick={startRecording}
											className="h-10 px-4 rounded-xl border border-border bg-surface hover:bg-card text-text-secondary hover:text-text-primary text-xs font-semibold flex items-center justify-center gap-2 mx-auto cursor-pointer transition-all duration-200"
										>
											<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
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
						className="w-full h-11 rounded-[12px] bg-accent text-background text-sm font-semibold transition-all duration-200 ease-out hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
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
