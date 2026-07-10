import React from "react";
import Link from "next/link";

/**
 * Parses a text string and wraps hashtags (#word) in Next.js Links pointing to /tags/[word]
 */
export function formatCaption(text: string): React.ReactNode[] {
	if (!text) return [];

	const words = text.split(/(\s+)/); // Keep whitespace
	return words.map((word, idx) => {
		if (word.startsWith("#") && word.length > 1) {
			const cleanTag = word.replace(/[^#a-zA-Z0-9]/g, ""); // Keep # and alphanumeric
			const tagValue = cleanTag.substring(1).toLowerCase();
			if (tagValue) {
				return (
					<Link
						key={idx}
						href={`/tags/${tagValue}`}
						className="text-accent hover:underline font-sans font-semibold inline-block"
					>
						{word}
					</Link>
				);
			}
		}
		return <React.Fragment key={idx}>{word}</React.Fragment>;
	});
}
