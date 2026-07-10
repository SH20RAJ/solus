"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

interface EditorProps {
	onChange: (markdown: string) => void;
}

export default function BlockNoteEditor({ onChange }: EditorProps) {
	const editor = useCreateBlockNote();

	return (
		<div className="border border-border/30 rounded-[20px] overflow-hidden bg-card text-left min-h-[220px] p-2">
			<BlockNoteView
				editor={editor}
				onChange={async () => {
					const markdown = await editor.blocksToMarkdownLossy(editor.document);
					onChange(markdown);
				}}
				theme="dark"
			/>
		</div>
	);
}
