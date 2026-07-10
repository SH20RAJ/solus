"use client";

import { useState, useRef, useEffect } from "react";

interface DropdownItem {
	label: string;
	onClick: () => void;
	className?: string;
}

interface DropdownProps {
	trigger: React.ReactNode;
	items: DropdownItem[];
	align?: "left" | "right";
}

export default function Dropdown({ trigger, items, align = "right" }: DropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative inline-block text-left" ref={dropdownRef}>
			<div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
				{trigger}
			</div>

			{isOpen && (
				<div
					className={`absolute z-50 mt-1.5 w-44 rounded-xl border border-border/40 bg-card shadow-lg focus:outline-none animate-fade-in ${
						align === "right" ? "right-0" : "left-0"
					}`}
				>
					<div className="py-1">
						{items.map((item, index) => (
							<button
								key={index}
								onClick={() => {
									item.onClick();
									setIsOpen(false);
								}}
								className={`block w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-surface ${
									item.className ?? "text-text-primary"
								}`}
							>
								{item.label}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
