"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import TiptapEditor from "@/components/TiptapEditor";
import { usePosts } from "@/lib/api-client";

const MOODS = [
	{ name: "Happy", color: "from-amber-500/10 to-yellow-500/10 text-amber-300 border-amber-500/30" },
	{ name: "Calm", color: "from-sky-500/10 to-blue-500/10 text-sky-300 border-sky-500/30" },
	{ name: "Grateful", color: "from-emerald-500/10 to-teal-500/10 text-emerald-300 border-emerald-500/30" },
	{ name: "Reflective", color: "from-indigo-500/10 to-violet-500/10 text-indigo-300 border-indigo-500/30" },
	{ name: "Tired", color: "from-zinc-500/10 to-neutral-500/10 text-zinc-400 border-zinc-500/30" },
	{ name: "Excited", color: "from-rose-500/10 to-pink-500/10 text-rose-300 border-rose-500/30" },
	{ name: "Peaceful", color: "from-teal-500/10 to-cyan-500/10 text-teal-300 border-teal-500/30" },
] as const;

export default function CreatePostPageClient() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [caption, setCaption] = useState("");
	const [location, setLocation] = useState("");
	const [mood, setMood] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [showTextTab, setShowTextTab] = useState(false);
	const [showPhotoTab, setShowPhotoTab] = useState(false);

	const [showCeremony, setShowCeremony] = useState(false);
	const [remindedPost, setRemindedPost] = useState<{ caption: string; timeLabel: string } | null>(null);

	const { data: postsData } = usePosts();
	const posts = postsData?.data ?? [];

	useEffect(() => {
		const locations = ["Home Studio", "Local Café", "Quiet Library", "Garden Walk", "Workspace"];
		const randomLoc = locations[Math.floor(Math.random() * locations.length)];
		setLocation(randomLoc);
	}, []);

	// Voice Note states
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
		setShowPhotoTab(true);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file && !caption) return;

		setIsSubmitting(true);

		try {
			let mediaUrl: string | undefined;
			let mediaType: "image" | "video" | "audio" | undefined;

			if (file) {
				if (file.type.startsWith("video/")) {
					mediaType = "video";
				} else if (file.type.startsWith("audio/") || file.name.endsWith(".webm")) {
					mediaType = "audio";
				} else {
					mediaType = "image";
				}

				// Upload
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

				mediaUrl = presignData.data.uploadUrl;
			}

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

			// Connection match
			const matches = posts.filter(p => p.mood === mood || (location && p.location === location));
			const match = matches.length > 0
				? matches[Math.floor(Math.random() * matches.length)]
				: (posts.length > 0 ? posts[Math.floor(Math.random() * posts.length)] : null);

			if (match) {
				const postDate = new Date(match.createdAt);
				const timeDiff = Date.now() - postDate.getTime();
				const days = Math.round(timeDiff / (1000 * 60 * 60 * 24));
				const label = days > 30 ? `${Math.round(days / 30)} months ago` : `${days} days ago`;
				setRemindedPost({
					caption: match.caption || "A quiet moment logged.",
					timeLabel: label
				});
			}

			setShowCeremony(true);
		} catch {
			alert("Failed to seal reflection.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const isAudio = file?.type.startsWith("audio/") || file?.name.endsWith(".webm");

	if (showCeremony) {
		return (
			<div className="py-16 sm:py-24 px-4 sm:px-6 w-full max-w-[500px] mx-auto text-center animate-fade-in font-sans">
				<div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent text-2xl mb-6 shadow-sm">
					✓
				</div>
				<h1 className="text-2xl font-semibold tracking-tight text-text-primary font-serif">
					Sealed into your archive
				</h1>
				<p className="text-xs text-text-muted mt-2">
					This is reflection #{posts.length + 1}.
				</p>

				{remindedPost && (
					<div className="mt-8 p-6 rounded-[24px] border border-border/30 bg-card/40 text-left animate-slide-up">
						<span className="text-[10px] text-text-muted uppercase font-mono tracking-wider font-bold">
							This reminds us of
						</span>
						<p className="mt-2.5 text-sm text-text-primary font-serif leading-relaxed italic">
							&ldquo;{remindedPost.caption}&rdquo;
						</p>
						<p className="mt-3 text-[10px] text-accent font-mono">
							&mdash; {remindedPost.timeLabel}
						</p>
					</div>
				)}

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
						Sanctuary Post
					</span>
					<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary font-serif mt-1">
						New Reflection
					</h1>
				</div>
				<Link href="/create" className="text-xs text-text-muted hover:text-text-primary">
					← Back
				</Link>
			</header>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* VOICE RECORDER */}
				<div className="p-6 rounded-[24px] border border-border/30 bg-card/40 flex flex-col items-center justify-center text-center shadow-inner">
					{isRecording ? (
						<div className="space-y-4 w-full">
							<div className="flex flex-col items-center gap-2">
								<div className="relative w-16 h-16 flex items-center justify-center">
									<span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
									<span className="absolute inset-2 rounded-full bg-red-500/40 animate-pulse" />
									<span className="w-8 h-8 rounded-full bg-red-500" />
								</div>
								<span className="text-xs font-mono font-bold text-text-primary tracking-wider mt-2">
									RECORDING ({formatDuration(recordingDuration)})
								</span>
							</div>
							<button
								type="button"
								onClick={stopRecording}
								className="px-6 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all cursor-pointer shadow"
							>
								Stop & Save
							</button>
						</div>
					) : preview && isAudio ? (
						<div className="flex flex-col items-center gap-4 w-full">
							<div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
									<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
									<line x1="12" y1="19" x2="12" y2="22" />
								</svg>
							</div>
							<audio src={preview} controls className="w-full max-w-sm mt-1" />
							<button
								type="button"
								onClick={() => {
									setFile(null);
									setPreview(null);
								}}
								className="text-xs text-red-400 hover:text-red-300 font-mono"
							>
								✕ Delete Note
							</button>
						</div>
					) : (
						<div className="flex flex-col items-center gap-3 w-full">
							<button
								type="button"
								onClick={startRecording}
								className="w-14 h-14 rounded-full bg-accent text-background flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
								title="Record Voice Note"
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
									<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
									<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
									<line x1="12" y1="19" x2="12" y2="22" />
								</svg>
							</button>
							<span className="text-xs text-text-primary font-bold">Hold to talk</span>
							<p className="text-[10px] text-text-muted leading-relaxed max-w-[280px]">
								Tap to record a voice reflection. Easy, voice-first logging.
							</p>
						</div>
					)}
				</div>

				{/* EXPANDABLE ACTIONS */}
				<div className="flex gap-4">
					<button
						type="button"
						onClick={() => setShowTextTab(!showTextTab)}
						className={`flex-1 py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
							showTextTab || caption
								? "bg-accent/5 text-accent border-accent/30"
								: "border-border/30 text-text-secondary bg-card hover:bg-surface"
						}`}
					>
						✍ Write thoughts
					</button>
					<button
						type="button"
						onClick={() => {
							if (showPhotoTab) {
								setFile(null);
								setPreview(null);
							}
							setShowPhotoTab(!showPhotoTab);
						}}
						className={`flex-1 py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
							showPhotoTab || (preview && !isAudio)
								? "bg-accent/5 text-accent border-accent/30"
								: "border-border/30 text-text-secondary bg-card hover:bg-surface"
						}`}
					>
						📷 Add photos
					</button>
				</div>

				{/* Media drop */}
				{(showPhotoTab || (preview && !isAudio)) && (
					<div className="p-4 rounded-[24px] border border-border/30 bg-card space-y-4">
						{preview && !isAudio ? (
							<div className="relative rounded-xl overflow-hidden bg-surface border border-border/20 p-1 flex items-center justify-center">
								{file?.type.startsWith("video/") ? (
									<video src={preview} controls className="w-full max-h-64 object-cover rounded-lg" />
								) : (
									<div className="relative w-full h-64">
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
								className="w-full aspect-[16/9] border-2 border-dashed border-border/50 rounded-xl flex flex-col items-center justify-center gap-2 bg-surface/50 hover:bg-surface hover:border-accent cursor-pointer transition-all duration-200"
							>
								<span className="text-xl">📁</span>
								<span className="text-xs text-text-secondary font-semibold">Upload Photo or Video file</span>
							</div>
						)}
					</div>
				)}

				{/* Tiptap text editor */}
				{(showTextTab || caption) && (
					<div className="p-4 rounded-[24px] border border-border/30 bg-card space-y-4">
						<TiptapEditor onChange={setCaption} />
					</div>
				)}

				<input
					ref={fileInputRef}
					type="file"
					accept="image/*,video/*,audio/*"
					onChange={handleFileSelect}
					className="hidden"
				/>

				{/* Location / Mood details */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{/* Location */}
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
								placeholder="e.g. Home Studio"
								className="w-full h-10 pl-8 pr-3 rounded-lg border border-border bg-card text-text-primary text-xs focus:outline-none"
							/>
							<span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs">📍</span>
						</div>
					</div>

					{/* Vibe */}
					<div className="space-y-2">
						<span className="block text-[10px] uppercase tracking-wider font-mono text-text-muted">
							Vibe
						</span>
						<div className="flex flex-wrap gap-1.5">
							{MOODS.map((m) => (
								<button
									key={m.name}
									type="button"
									onClick={() => setMood(mood === m.name ? "" : m.name)}
									className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all border cursor-pointer ${
										mood === m.name
											? `bg-gradient-to-r ${m.color} shadow-sm border-accent/20`
											: "border-border/40 text-text-secondary bg-card hover:bg-surface"
									}`}
								>
									{m.name}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Seal Button */}
				<button
					type="submit"
					disabled={isSubmitting || (!file && !caption)}
					className="w-full h-11 rounded-[14px] bg-accent text-background text-xs font-bold transition-all duration-300 hover:opacity-95 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-lg shadow-accent/5 font-mono uppercase tracking-wider"
				>
					{isSubmitting ? "Sealing moment..." : "Seal Reflection"}
				</button>
			</form>
		</div>
	);
}
