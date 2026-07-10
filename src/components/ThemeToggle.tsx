"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const [theme, setTheme] = useState<"dark" | "light">("dark");

	useEffect(() => {
		const stored = localStorage.getItem("solus-theme") as "dark" | "light" | null;
		const defaultTheme = stored || "dark";
		setTheme(defaultTheme);

		if (defaultTheme === "light") {
			document.documentElement.classList.add("light");
		} else {
			document.documentElement.classList.remove("light");
		}
	}, []);

	const toggleTheme = () => {
		const nextTheme = theme === "dark" ? "light" : "dark";
		setTheme(nextTheme);
		localStorage.setItem("solus-theme", nextTheme);

		if (nextTheme === "light") {
			document.documentElement.classList.add("light");
		} else {
			document.documentElement.classList.remove("light");
		}
	};

	return (
		<button
			onClick={toggleTheme}
			className="w-8 h-8 rounded-full bg-card hover:bg-surface border border-border/40 hover:border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-all duration-300 active:scale-95 cursor-pointer shadow-sm"
			title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
		>
			{theme === "dark" ? (
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-fade-in text-accent">
					<circle cx="12" cy="12" r="4" />
					<path d="M12 2v2" />
					<path d="M12 20v2" />
					<path d="m4.93 4.93 1.41 1.41" />
					<path d="m17.66 17.66 1.41 1.41" />
					<path d="M2 12h2" />
					<path d="M20 12h2" />
					<path d="m6.34 17.66-1.41 1.41" />
					<path d="m19.07 4.93-1.41 1.41" />
				</svg>
			) : (
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-fade-in text-accent">
					<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
				</svg>
			)}
		</button>
	);
}
