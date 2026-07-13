"use client";

import { useState, useEffect } from "react";

interface FileItem {
	id: string;
	name: string;
	type: "note" | "document" | "link";
	content: string; // The body of the note or the link url
	createdAt: string;
}

interface Folder {
	id: string;
	name: string;
	createdAt: string;
	files: FileItem[];
}

interface FileManagerProps {
	isOpen: boolean;
	onClose: () => void;
	userId: string;
}

export default function FileManager({ isOpen, onClose, userId }: FileManagerProps) {
	const [folders, setFolders] = useState<Folder[]>([]);
	const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [newFolderName, setNewFolderName] = useState("");
	const [showNewFolderModal, setShowNewFolderModal] = useState(false);

	// File creation states
	const [showNewFileModal, setShowNewFileModal] = useState(false);
	const [newFileName, setNewFileName] = useState("");
	const [newFileType, setNewFileType] = useState<"note" | "document" | "link">("note");
	const [newFileContent, setNewFileContent] = useState("");

	// Active file preview
	const [activeFile, setActiveFile] = useState<FileItem | null>(null);

	const storageKey = `solus-filemanager-folders-${userId}`;

	// Load folders from localStorage
	useEffect(() => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem(storageKey);
			if (stored) {
				try {
					setFolders(JSON.parse(stored));
				} catch (e) {
					console.error("Failed to parse folders:", e);
				}
			} else {
				// Seed initial folders
				const defaultFolders: Folder[] = [
					{
						id: "f1",
						name: "Personal Snippets",
						createdAt: new Date().toISOString(),
						files: [
							{
								id: "item1",
								name: "Welcome Secret.txt",
								type: "note",
								content: "Welcome to your secure file locker. Any text, secrets, or documents saved here reside strictly on your device.",
								createdAt: new Date().toISOString(),
							},
						],
					},
					{
						id: "f2",
						name: "Travel Drafts",
						createdAt: new Date().toISOString(),
						files: [],
					},
				];
				setFolders(defaultFolders);
				localStorage.setItem(storageKey, JSON.stringify(defaultFolders));
			}
		}
	}, [storageKey]);

	// Save folders helper
	const saveFolders = (updated: Folder[]) => {
		setFolders(updated);
		localStorage.setItem(storageKey, JSON.stringify(updated));
	};

	if (!isOpen) return null;

	// Actions
	const handleCreateFolder = () => {
		if (!newFolderName.trim()) return;
		const newFolder: Folder = {
			id: crypto.randomUUID(),
			name: newFolderName.trim(),
			createdAt: new Date().toISOString(),
			files: [],
		};
		saveFolders([...folders, newFolder]);
		setNewFolderName("");
		setShowNewFolderModal(false);
	};

	const handleDeleteFolder = (folderId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (confirm("Delete this folder and all its contents?")) {
			const updated = folders.filter((f) => f.id !== folderId);
			saveFolders(updated);
			if (currentFolderId === folderId) {
				setCurrentFolderId(null);
			}
		}
	};

	const handleCreateFile = () => {
		if (!newFileName.trim() || !currentFolderId) return;
		const newFile: FileItem = {
			id: crypto.randomUUID(),
			name: newFileName.trim().endsWith(".txt") || newFileType !== "note" ? newFileName.trim() : `${newFileName.trim()}.txt`,
			type: newFileType,
			content: newFileContent.trim(),
			createdAt: new Date().toISOString(),
		};

		const updated = folders.map((f) => {
			if (f.id === currentFolderId) {
				return { ...f, files: [...f.files, newFile] };
			}
			return f;
		});

		saveFolders(updated);
		setNewFileName("");
		setNewFileContent("");
		setShowNewFileModal(false);
	};

	const handleDeleteFile = (fileId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (confirm("Are you sure you want to delete this file?")) {
			const updated = folders.map((f) => {
				if (f.id === currentFolderId) {
					return { ...f, files: f.files.filter((file) => file.id !== fileId) };
				}
				return f;
			});
			saveFolders(updated);
			if (activeFile?.id === fileId) {
				setActiveFile(null);
			}
		}
	};

	const currentFolder = folders.find((f) => f.id === currentFolderId);

	// Filter folders/files by search query
	const filteredFolders = folders.filter((f) =>
		f.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const filteredFiles = currentFolder
		? currentFolder.files.filter((file) =>
				file.name.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: [];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md select-none">
			<div className="w-full max-w-4xl h-[80vh] bg-card border border-border/40 rounded-[28px] shadow-2xl flex flex-col overflow-hidden relative">
				{/* Top bar */}
				<header className="px-6 py-4 border-b border-border/20 flex items-center justify-between bg-surface/30">
					<div className="flex items-center gap-2">
						<span className="text-xl">🔒</span>
						<div>
							<h2 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono">Private Vault Locker</h2>
							<p className="text-[10px] text-text-muted font-mono">Client-side Secure Sandbox</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="text-text-muted hover:text-text-primary p-1.5 rounded-full hover:bg-surface/50 transition-all cursor-pointer"
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</header>

				{/* Toolbar / Search */}
				<div className="px-6 py-3 border-b border-border/20 flex flex-wrap items-center justify-between gap-3 bg-surface/10">
					{/* Breadcrumbs */}
					<div className="flex items-center gap-1.5 text-xs font-mono">
						<button
							onClick={() => {
								setCurrentFolderId(null);
								setActiveFile(null);
							}}
							className="text-accent hover:underline cursor-pointer"
						>
							root
						</button>
						{currentFolder && (
							<>
								<span className="text-text-muted">/</span>
								<span className="text-text-secondary truncate max-w-[120px]">{currentFolder.name}</span>
							</>
						)}
					</div>

					<div className="flex items-center gap-2 flex-1 max-w-sm justify-end">
						{/* Search */}
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search entries..."
							className="text-xs px-3 py-1.5 bg-card/60 border border-border/20 rounded-xl focus:outline-none focus:border-accent/40 w-full text-text-primary font-mono placeholder:text-text-muted/50"
						/>

						{/* Action buttons */}
						{currentFolderId === null ? (
							<button
								onClick={() => setShowNewFolderModal(true)}
								className="shrink-0 text-xs bg-accent text-background font-semibold px-3 py-1.5 rounded-xl hover:bg-accent/90 transition-all active:scale-[0.97] cursor-pointer"
							>
								+ New Folder
							</button>
						) : (
							<button
								onClick={() => setShowNewFileModal(true)}
								className="shrink-0 text-xs bg-accent text-background font-semibold px-3 py-1.5 rounded-xl hover:bg-accent/90 transition-all active:scale-[0.97] cursor-pointer"
							>
								+ Add Note
							</button>
						)}
					</div>
				</div>

				{/* Main body explorer */}
				<div className="flex-1 flex overflow-hidden">
					{/* Left content explorer */}
					<div className="flex-1 overflow-y-auto p-6 scrollbar-none">
						{currentFolderId === null ? (
							/* Folders Root Grid */
							filteredFolders.length === 0 ? (
								<div className="text-center py-20 text-text-muted text-xs font-mono">
									No folders found. Click &ldquo;New Folder&rdquo; to begin.
								</div>
							) : (
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
									{filteredFolders.map((folder) => (
										<div
											key={folder.id}
											onClick={() => setCurrentFolderId(folder.id)}
											className="p-4 rounded-2xl bg-card border border-border/30 hover:border-accent/20 hover:bg-accent/[0.02] cursor-pointer flex flex-col items-center justify-center gap-2 group transition-all"
										>
											<div className="text-3xl relative">
												📁
												<button
													onClick={(e) => handleDeleteFolder(folder.id, e)}
													className="absolute -top-1 -right-1 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white p-0.5 rounded-full text-[8px] opacity-0 group-hover:opacity-100 transition-opacity"
													title="Delete Folder"
												>
													✕
												</button>
											</div>
											<span className="text-xs font-semibold text-text-primary text-center truncate w-full">
												{folder.name}
											</span>
											<span className="text-[9px] text-text-muted font-mono">
												{folder.files.length} items
											</span>
										</div>
									))}
								</div>
							)
						) : (
							/* Files Grid inside Folder */
							<div>
								<button
									onClick={() => {
										setCurrentFolderId(null);
										setActiveFile(null);
									}}
									className="mb-4 text-[10px] font-mono text-text-muted hover:text-text-primary flex items-center gap-1 cursor-pointer"
								>
									← Back to Folders
								</button>

								{filteredFiles.length === 0 ? (
									<div className="text-center py-20 text-text-muted text-xs font-mono border border-dashed border-border/20 rounded-2xl">
										This folder is empty. Click &ldquo;Add Note&rdquo; to secure a new snippet.
									</div>
								) : (
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
										{filteredFiles.map((file) => (
											<div
												key={file.id}
												onClick={() => setActiveFile(file)}
												className={`p-4 rounded-2xl bg-card border flex flex-col items-center justify-center gap-2 group transition-all cursor-pointer hover:scale-[1.02] ${
													activeFile?.id === file.id
														? "border-accent bg-accent/5"
														: "border-border/30 hover:border-accent/20"
												}`}
											>
												<div className="text-3xl relative">
													📄
													<button
														onClick={(e) => handleDeleteFile(file.id, e)}
														className="absolute -top-1 -right-1 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white p-0.5 rounded-full text-[8px] opacity-0 group-hover:opacity-100 transition-opacity"
														title="Delete File"
													>
														✕
													</button>
												</div>
												<span className="text-xs font-semibold text-text-primary text-center truncate w-full">
													{file.name}
												</span>
												<span className="text-[8px] text-text-muted font-mono uppercase tracking-wide">
													{file.type}
												</span>
											</div>
										))}
									</div>
								)}
							</div>
						)}
					</div>

					{/* Right Sidebar detail panel */}
					{activeFile && (
						<div className="w-80 border-l border-border/20 bg-surface/20 flex flex-col overflow-hidden">
							<header className="px-5 py-4 border-b border-border/20 flex items-center justify-between">
								<span className="text-xs font-bold text-text-primary truncate font-mono">
									{activeFile.name}
								</span>
								<button
									onClick={() => setActiveFile(null)}
									className="text-text-muted hover:text-text-primary text-xs"
								>
									close
								</button>
							</header>

							<div className="flex-1 p-5 overflow-y-auto font-serif text-sm text-text-secondary leading-relaxed whitespace-pre-wrap select-text">
								{activeFile.content}
							</div>

							<footer className="p-4 border-t border-border/20 bg-card flex justify-between items-center text-[10px] font-mono text-text-muted">
								<span>
									Created: {new Date(activeFile.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
								</span>
								<button
									onClick={() => {
										const blob = new Blob([activeFile.content], { type: "text/plain;charset=utf-8" });
										const url = URL.createObjectURL(blob);
										const a = document.createElement("a");
										a.href = url;
										a.download = activeFile.name;
										document.body.appendChild(a);
										a.click();
										a.remove();
										URL.revokeObjectURL(url);
									}}
									className="text-accent hover:underline cursor-pointer"
								>
									Download File
								</button>
							</footer>
						</div>
					)}
				</div>
			</div>

			{/* Create Folder Modal */}
			{showNewFolderModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/50 backdrop-blur-sm">
					<div className="w-full max-w-sm bg-card border border-border/40 rounded-3xl p-6 shadow-xl text-left">
						<h3 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono mb-4">Create New Folder</h3>
						<input
							type="text"
							value={newFolderName}
							onChange={(e) => setNewFolderName(e.target.value)}
							placeholder="Folder Name (e.g. Travel Snippets)"
							className="w-full text-xs px-3.5 py-2.5 bg-surface/50 border border-border/20 rounded-xl focus:outline-none focus:border-accent/40 text-text-primary placeholder:text-text-muted/50 mb-4"
						/>
						<div className="flex gap-2.5 justify-end">
							<button
								onClick={() => setShowNewFolderModal(false)}
								className="text-xs text-text-muted px-4 py-2 hover:text-text-primary transition-colors cursor-pointer"
							>
								Cancel
							</button>
							<button
								onClick={handleCreateFolder}
								className="text-xs bg-accent text-background font-semibold px-4 py-2 rounded-xl hover:bg-accent/90 transition-all cursor-pointer"
							>
								Create Folder
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Create File Modal */}
			{showNewFileModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/50 backdrop-blur-sm">
					<div className="w-full max-w-md bg-card border border-border/40 rounded-3xl p-6 shadow-xl text-left">
						<h3 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono mb-4">Add Note / Document</h3>
						
						{/* File Name */}
						<label className="block text-[10px] font-mono text-text-muted uppercase tracking-wide mb-1">File Name</label>
						<input
							type="text"
							value={newFileName}
							onChange={(e) => setNewFileName(e.target.value)}
							placeholder="secrets_notes"
							className="w-full text-xs px-3.5 py-2.5 bg-surface/50 border border-border/20 rounded-xl focus:outline-none focus:border-accent/40 text-text-primary placeholder:text-text-muted/50 mb-4"
						/>

						{/* File Content */}
						<label className="block text-[10px] font-mono text-text-muted uppercase tracking-wide mb-1">Content / Secret Text</label>
						<textarea
							value={newFileContent}
							onChange={(e) => setNewFileContent(e.target.value)}
							placeholder="Write down details you want locked inside this folder..."
							rows={6}
							className="w-full text-xs px-3.5 py-2.5 bg-surface/50 border border-border/20 rounded-xl focus:outline-none focus:border-accent/40 text-text-primary placeholder:text-text-muted/50 mb-4 font-serif leading-relaxed"
						/>

						<div className="flex gap-2.5 justify-end">
							<button
								onClick={() => setShowNewFileModal(false)}
								className="text-xs text-text-muted px-4 py-2 hover:text-text-primary transition-colors cursor-pointer"
							>
								Cancel
							</button>
							<button
								onClick={handleCreateFile}
								className="text-xs bg-accent text-background font-semibold px-4 py-2 rounded-xl hover:bg-accent/90 transition-all cursor-pointer"
							>
								Save File
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
