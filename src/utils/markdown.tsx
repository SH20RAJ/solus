import React from "react";
import Link from "next/link";

/**
 * Converts basic HTML tags (like <p>, <strong>, <em>, <h2>, etc.) into clean Markdown.
 */
export function htmlToMarkdown(html: string | null | undefined): string {
	if (!html) return "";
	let md = html;

	// Normalize blockquotes
	md = md.replace(/<blockquote>([\s\S]*?)<\/blockquote>/gi, (_, p1) => {
		return p1.split("\n").map((line: string) => `> ${line.trim()}`).join("\n") + "\n\n";
	});

	// Normalize list items
	md = md.replace(/<li>([\s\S]*?)<\/li>/gi, "- $1\n");
	md = md.replace(/<ul>([\s\S]*?)<\/ul>/gi, "$1\n");
	md = md.replace(/<ol>([\s\S]*?)<\/ol>/gi, (_, p1) => {
		let index = 1;
		return p1.replace(/- (.*?)\n/g, () => `${index++}. $1\n`) + "\n";
	});

	// Headings
	md = md.replace(/<h1>([\s\S]*?)<\/h1>/gi, "# $1\n\n");
	md = md.replace(/<h2>([\s\S]*?)<\/h2>/gi, "## $1\n\n");
	md = md.replace(/<h3>([\s\S]*?)<\/h3>/gi, "### $1\n\n");

	// Inline formatting
	md = md.replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**");
	md = md.replace(/<b>([\s\S]*?)<\/b>/gi, "**$1**");
	md = md.replace(/<em>([\s\S]*?)<\/em>/gi, "*$1*");
	md = md.replace(/<i>([\s\S]*?)<\/i>/gi, "*$1*");
	md = md.replace(/<code>([\s\S]*?)<\/code>/gi, "`$1`");

	// Paragraphs & line breaks
	md = md.replace(/<p>([\s\S]*?)<\/p>/gi, "$1\n\n");
	md = md.replace(/<br\s*\/?>/gi, "\n");

	// Clean up extra spacing
	md = md.replace(/\n{3,}/g, "\n\n");
	return md.trim();
}

/**
 * Converts Markdown string back into basic HTML (used to pre-fill TipTap).
 */
export function markdownToHtml(markdown: string | null | undefined): string {
	if (!markdown) return "";
	let html = markdown;

	// Blockquotes
	html = html.replace(/^>\s+(.*)$/gm, "<blockquote>$1</blockquote>");
	html = html.replace(/<\/blockquote>\n<blockquote>/g, "\n");

	// Headings
	html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>");
	html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>");
	html = html.replace(/^# (.*)$/gm, "<h1>$1</h1>");

	// Bold / Italic
	html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
	html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
	html = html.replace(/`(.*?)`/g, "<code>$1</code>");

	// Unordered lists
	html = html.replace(/^\s*-\s+(.*)$/gm, "<li>$1</li>");
	// Wrap contiguous lists
	html = html.replace(/((?:<li>.*<\/li>\s*)+)/g, "<ul>$1</ul>");

	// Paragraph division
	const paragraphs = html.split(/\n\n+/);
	html = paragraphs
		.map((p) => {
			const trimmed = p.trim();
			if (!trimmed) return "";
			if (
				trimmed.startsWith("<h") ||
				trimmed.startsWith("<blockquote") ||
				trimmed.startsWith("<ul") ||
				trimmed.startsWith("<ol") ||
				trimmed.startsWith("<li")
			) {
				return trimmed;
			}
			return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
		})
		.join("\n");

	return html;
}

/**
 * Parses markdown inline markers and renders hashtags dynamically as Link tags.
 */
function renderInline(text: string): React.ReactNode {
	if (!text) return "";

	let parts: Array<{ type: "text" | "bold" | "italic"; text: string }> = [
		{ type: "text", text },
	];

	// Parse Bold (**)
	parts = parts.flatMap((part) => {
		if (part.type !== "text") return [part];
		const subparts = part.text.split(/(\*\*.*?\*\*)/g);
		return subparts.map((sub) => {
			if (sub.startsWith("**") && sub.endsWith("**")) {
				return { type: "bold" as const, text: sub.slice(2, -2) };
			}
			return { type: "text" as const, text: sub };
		});
	});

	// Parse Italic (*)
	parts = parts.flatMap((part) => {
		if (part.type !== "text") return [part];
		const subparts = part.text.split(/(\*.*?\*)/g);
		return subparts.map((sub) => {
			if (sub.startsWith("*") && sub.endsWith("*")) {
				return { type: "italic" as const, text: sub.slice(1, -1) };
			}
			return { type: "text" as const, text: sub };
		});
	});

	return parts.map((part, partIdx) => {
		if (part.type === "bold") {
			return (
				<strong key={partIdx} className="font-bold text-text-primary font-sans">
					{renderHashtags(part.text)}
				</strong>
			);
		}
		if (part.type === "italic") {
			return (
				<em key={partIdx} className="italic text-text-primary/90 font-serif">
					{renderHashtags(part.text)}
				</em>
			);
		}
		return <React.Fragment key={partIdx}>{renderHashtags(part.text)}</React.Fragment>;
	});
}

/**
 * Extracts and maps hashtag tokens (#tag) to Next.js routing tags pages.
 */
function renderHashtags(text: string): React.ReactNode[] {
	if (!text) return [];
	const words = text.split(/(\s+)/); // Preserve spaces

	return words.map((word, idx) => {
		if (word.startsWith("#") && word.length > 1) {
			const cleanTag = word.replace(/[^#a-zA-Z0-9]/g, ""); // Keep # & alphanumeric
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

/**
 * Compiles full multi-line markdown texts to styled layout containers.
 */
export function renderMarkdown(markdown: string | null | undefined): React.ReactNode {
	if (!markdown) return null;

	const blocks = markdown.split(/\n\n+/);

	return (
		<div className="space-y-2.5 font-serif text-sm">
			{blocks.map((block, blockIdx) => {
				const trimmed = block.trim();
				if (!trimmed) return null;

				// Blockquote
				if (trimmed.startsWith(">")) {
					const quoteText = trimmed.replace(/^>\s*/gm, "").trim();
					return (
						<blockquote
							key={blockIdx}
							className="border-l-[3px] border-accent/40 pl-3 italic text-text-muted my-1.5 bg-card/10 py-0.5 rounded-r"
						>
							{renderInline(quoteText)}
						</blockquote>
					);
				}

				// Headings
				if (trimmed.startsWith("###")) {
					return (
						<h3
							key={blockIdx}
							className="text-xs font-bold font-sans text-text-primary mt-2 mb-1 tracking-wide uppercase"
						>
							{renderInline(trimmed.replace(/^###\s+/, ""))}
						</h3>
					);
				}
				if (trimmed.startsWith("##")) {
					return (
						<h2
							key={blockIdx}
							className="text-sm font-bold font-sans text-text-primary mt-3.5 mb-1"
						>
							{renderInline(trimmed.replace(/^##\s+/, ""))}
						</h2>
					);
				}
				if (trimmed.startsWith("#")) {
					return (
						<h1
							key={blockIdx}
							className="text-base font-bold font-sans text-text-primary mt-3.5 mb-1.5"
						>
							{renderInline(trimmed.replace(/^#\s+/, ""))}
						</h1>
					);
				}

				// Unordered list
				if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
					const items = trimmed.split(/\n[-*]\s+/);
					if (items[0]) {
						items[0] = items[0].replace(/^[-*]\s+/, "");
					}
					return (
						<ul key={blockIdx} className="list-disc pl-5 space-y-0.5 my-1.5 font-serif">
							{items.map((item, itemIdx) => (
								<li key={itemIdx} className="text-text-primary">
									{renderInline(item.trim())}
								</li>
							))}
						</ul>
					);
				}

				// Ordered list
				if (/^\d+\./.test(trimmed)) {
					const items = trimmed.split(/\n\d+\.\s+/);
					if (items[0]) {
						items[0] = items[0].replace(/^\d+\.\s+/, "");
					}
					return (
						<ol key={blockIdx} className="list-decimal pl-5 space-y-0.5 my-1.5 font-serif">
							{items.map((item, itemIdx) => (
								<li key={itemIdx} className="text-text-primary">
									{renderInline(item.trim())}
								</li>
							))}
						</ol>
					);
				}

				// Paragraph
				return (
					<p key={blockIdx} className="leading-relaxed">
						{renderInline(trimmed)}
					</p>
				);
			})}
		</div>
	);
}
