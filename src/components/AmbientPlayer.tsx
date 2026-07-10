"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const PUBLIC_PAGES = ["/", "/pitch", "/contact", "/privacy", "/terms", "/login"];

export default function AmbientPlayer() {
	const pathname = usePathname();
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [userMuted, setUserMuted] = useState(false);

	const isPublic = PUBLIC_PAGES.includes(pathname);

	useEffect(() => {
		const audio = new Audio("/sonorahealing-healing-sound-396_-hz-452272.mp3");
		audio.loop = true;
		audio.volume = 0.45; // Soft ambient volume
		audioRef.current = audio;

		return () => {
			audio.pause();
		};
	}, []);

	// Play or pause based on route changes and user mute actions
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isPublic && !userMuted) {
			audio
				.play()
				.then(() => {
					setIsPlaying(true);
				})
				.catch(() => {
					// Play blocked by browser autoplay rules
				});
		} else {
			audio.pause();
			setIsPlaying(false);
		}
	}, [isPublic, userMuted, pathname]);

	// Fallback click triggers to resume audio if blocked
	useEffect(() => {
		const handleInteraction = () => {
			const audio = audioRef.current;
			if (audio && isPublic && !userMuted && audio.paused) {
				audio
					.play()
					.then(() => {
						setIsPlaying(true);
					})
					.catch(() => {});
			}
		};

		document.addEventListener("click", handleInteraction);
		document.addEventListener("touchstart", handleInteraction);

		return () => {
			document.removeEventListener("click", handleInteraction);
			document.removeEventListener("touchstart", handleInteraction);
		};
	}, [isPublic, userMuted]);

	const togglePlay = () => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isPlaying) {
			audio.pause();
			setIsPlaying(false);
			setUserMuted(true);
		} else {
			audio
				.play()
				.then(() => {
					setIsPlaying(true);
					setUserMuted(false);
				})
				.catch(() => {});
		}
	};

	// Do not display sound widgets on authenticated panels
	if (!isPublic) return null;

	return (
		<div className="fixed bottom-6 right-6 z-50 select-none animate-fade-in font-sans">
			<button
				type="button"
				onClick={togglePlay}
				className="flex items-center gap-2 px-3 py-2 rounded-full border border-accent/25 bg-[#0c0c0e]/80 backdrop-blur-md text-[10px] text-text-secondary hover:text-text-primary hover:border-accent transition-all duration-300 shadow-lg cursor-pointer"
				title="Toggle Ambient Solfeggio Healing Frequency (396Hz)"
			>
				{/* Pulsing soundbars when playing */}
				{isPlaying ? (
					<div className="flex gap-0.5 items-end h-3 w-3">
						<span className="w-[2px] bg-accent rounded-full animate-[soundbar_0.6s_infinite_alternate]" style={{ animationDelay: "0.1s" }} />
						<span className="w-[2px] bg-accent rounded-full animate-[soundbar_0.6s_infinite_alternate]" style={{ animationDelay: "0.3s" }} />
						<span className="w-[2px] bg-accent rounded-full animate-[soundbar_0.6s_infinite_alternate]" style={{ animationDelay: "0.2s" }} />
					</div>
				) : (
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
						<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
						<line x1="23" y1="9" x2="17" y2="15" />
						<line x1="17" y1="9" x2="23" y2="15" />
					</svg>
				)}
				<span className="font-mono text-[9px] uppercase tracking-wider font-semibold">
					{isPlaying ? "396Hz Ambient" : "Sound Muted"}
				</span>
			</button>
		</div>
	);
}
