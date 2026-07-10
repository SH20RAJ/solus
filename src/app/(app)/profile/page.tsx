"use client";

import Image from "next/image";
import { useSession, signOut } from "@/lib/auth-client";
import { usePosts, useJourneys } from "@/lib/api-client";
import Skeleton from "@/components/Skeleton";

interface PostsResponse {
	success: boolean;
	data: Array<{ id: string }>;
}

interface JourneysResponse {
	success: boolean;
	data: Array<{ id: string }>;
}

export default function ProfilePage() {
	const { data: session, isPending } = useSession();
	const { data: postsData } = usePosts();
	const { data: journeysData } = useJourneys();

	const postCount = ((postsData as PostsResponse)?.data ?? []).length;
	const journeyCount = ((journeysData as JourneysResponse)?.data ?? []).length;

	const handleSignOut = () => {
		signOut({ fetchOptions: { onSuccess: () => window.location.assign("/login") } });
	};

	if (isPending) {
		return (
			<div className="py-10 sm:py-16 max-w-[640px] mx-auto space-y-6">
				<div className="flex items-center gap-4">
					<Skeleton className="w-16 h-16 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-4 w-48" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="py-10 sm:py-16 max-w-[640px] mx-auto animate-slide-up">
			{/* Profile header */}
			<div className="flex items-center gap-5 mb-12">
				{session?.user?.image ? (
					<Image
						src={session.user.image}
						alt={session.user.name ?? "Profile"}
						width={72}
						height={72}
						className="rounded-full border border-border/50 shadow-sm"
					/>
				) : (
					<div className="w-18 h-18 rounded-full bg-surface border border-border flex items-center justify-center text-2xl font-semibold text-text-muted">
						{session?.user?.name?.charAt(0).toUpperCase() ?? "?"}
					</div>
				)}
				<div>
					<h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary font-serif">
						{session?.user?.name ?? "Your Profile"}
					</h1>
					<p className="text-sm text-text-muted mt-1">
						{session?.user?.email}
					</p>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 gap-4 mb-10">
				<div className="p-6 rounded-[24px] border border-border/30 bg-card text-center shadow-[0_2px_8px_-3px_rgba(0,0,0,0.03)]">
					<p className="text-3xl font-bold tracking-tight text-text-primary font-serif">{postCount}</p>
					<p className="text-xs uppercase tracking-wider font-mono text-text-muted mt-1.5">Memories</p>
				</div>
				<div className="p-6 rounded-[24px] border border-border/30 bg-card text-center shadow-[0_2px_8px_-3px_rgba(0,0,0,0.03)]">
					<p className="text-3xl font-bold tracking-tight text-text-primary font-serif">{journeyCount}</p>
					<p className="text-xs uppercase tracking-wider font-mono text-text-muted mt-1.5">Journeys</p>
				</div>
			</div>

			{/* Actions */}
			<div className="space-y-3">
				<button
					onClick={handleSignOut}
					className="w-full h-11 rounded-[12px] border border-border/40 text-text-secondary bg-card text-sm font-medium transition-all duration-200 ease-out hover:text-text-primary hover:border-text-muted active:scale-[0.99] cursor-pointer"
				>
					Sign Out
				</button>
			</div>
		</div>
	);
}
