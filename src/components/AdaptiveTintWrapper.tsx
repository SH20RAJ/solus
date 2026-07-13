"use client";

import { useEffect, useState } from "react";

export default function AdaptiveTintWrapper({ children }: { children: React.ReactNode }) {
	const [tintClass, setTintClass] = useState("bg-background");

	useEffect(() => {
		const hour = new Date().getHours();
		if (hour >= 5 && hour < 8) {
			// Dawn: subtle rose/gold tint
			setTintClass("bg-[#0c0709]");
		} else if (hour >= 8 && hour < 17) {
			// Day: standard dark slate background
			setTintClass("bg-background");
		} else if (hour >= 17 && hour < 20) {
			// Dusk: subtle purple/indigo tint
			setTintClass("bg-[#07060f]");
		} else {
			// Night: deep midnight blue
			setTintClass("bg-[#040406]");
		}
	}, []);

	return (
		<div className={`min-h-screen ${tintClass} transition-colors duration-1000 ease-in-out text-text-primary`}>
			{children}
		</div>
	);
}
