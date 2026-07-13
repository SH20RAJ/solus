"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapEditorProps {
	onChange: (content: string) => void;
	initialContent?: string;
	placeholder?: string;
}

export default function TiptapEditor({
	onChange,
	initialContent = "",
	placeholder = "Write down your thoughts, feelings, or memories...",
}: TiptapEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [2, 3],
				},
			}),
		],
		content: initialContent,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class: "prose prose-invert focus:outline-none min-h-[140px] px-4 py-3 bg-card rounded-b-[20px] text-sm text-text-primary placeholder:text-text-muted/50 font-serif leading-relaxed",
			},
		},
	});

	if (!editor) return null;

	return (
		<div className="rounded-[20px] border border-border/40 overflow-hidden bg-card focus-within:border-accent/50 transition-colors">
			{/* Simple Toolbar */}
			<div className="flex flex-wrap items-center gap-1.5 p-2 bg-surface/50 border-b border-border/20">
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={`p-1.5 rounded text-xs font-semibold cursor-pointer hover:bg-surface transition-colors ${
						editor.isActive("bold") ? "text-accent bg-accent/10" : "text-text-secondary"
					}`}
					title="Bold"
				>
					<strong>B</strong>
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={`p-1.5 rounded text-xs font-semibold cursor-pointer hover:bg-surface transition-colors ${
						editor.isActive("italic") ? "text-accent bg-accent/10" : "text-text-secondary"
					}`}
					title="Italic"
				>
					<em>I</em>
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					className={`p-1.5 rounded text-xs font-semibold cursor-pointer hover:bg-surface transition-colors ${
						editor.isActive("heading", { level: 2 }) ? "text-accent bg-accent/10" : "text-text-secondary"
					}`}
					title="Heading 2"
				>
					H2
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={`p-1.5 rounded text-xs font-semibold cursor-pointer hover:bg-surface transition-colors ${
						editor.isActive("bulletList") ? "text-accent bg-accent/10" : "text-text-secondary"
					}`}
					title="Bullet List"
				>
					• List
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={`p-1.5 rounded text-xs font-semibold cursor-pointer hover:bg-surface transition-colors ${
						editor.isActive("orderedList") ? "text-accent bg-accent/10" : "text-text-secondary"
					}`}
					title="Ordered List"
				>
					1. List
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					className={`p-1.5 rounded text-xs font-semibold cursor-pointer hover:bg-surface transition-colors ${
						editor.isActive("blockquote") ? "text-accent bg-accent/10" : "text-text-secondary"
					}`}
					title="Quote"
				>
					&ldquo; Quote
				</button>
				<div className="w-px h-4 bg-border/20 mx-1" />
				<button
					type="button"
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().undo()}
					className="p-1.5 rounded text-xs text-text-secondary hover:text-text-primary cursor-pointer hover:bg-surface disabled:opacity-30 transition-colors"
					title="Undo"
				>
					↶
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().redo()}
					className="p-1.5 rounded text-xs text-text-secondary hover:text-text-primary cursor-pointer hover:bg-surface disabled:opacity-30 transition-colors"
					title="Redo"
				>
					↷
				</button>
			</div>

			<EditorContent editor={editor} />
		</div>
	);
}
