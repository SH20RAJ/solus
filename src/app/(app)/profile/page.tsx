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
			<div className="py-8 sm:py-12 space-y-6">
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
		<div className="py-8 sm:py-12">
			{/* Profile header */}
			<div className="flex items-center gap-5 mb-10">
				{session?.user?.image ? (
					<Image
						src={session.user.image}
						alt={session.user.name ?? "Profile"}
						width={64}
						height={64}
						className="rounded-full"
					/>
				) : (
					<div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-xl font-semibold text-text-muted">
						{session?.user?.name?.charAt(0).toUpperCase() ?? "?"}
					</div>
				)}
				<div>
					<h1 className="text-xl font-bold tracking-tight text-text-primary">
						{session?.user?.name ?? "Your Profile"}
					</h1>
					<p className="text-sm text-text-muted">
						{session?.user?.email}
					</p>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 gap-4 mb-10">
				<div className="p-5 rounded-[20px] border border-border bg-card text-center">
					<p className="text-2xl font-bold text-text-primary">{postCount}</p>
					<p className="text-xs text-text-muted mt-1">Memories</p>
				</div>
				<div className="p-5 rounded-[20px] border border-border bg-card text-center">
					<p className="text-2xl font-bold text-text-primary">{journeyCount}</p>
					<p className="text-xs text-text-muted mt-1">Journeys</p>
				</div>
			</div>

			{/* Actions */}
			<div className="space-y-3">
				<button
					onClick={handleSignOut}
					className="w-full h-11 rounded-[12px] border border-border text-text-secondary text-sm font-medium transition-colors duration-200 ease-out hover:text-text-primary hover:border-text-muted cursor-pointer"
				>
					Sign Out
				</button>
			</div>
		</div>
	);
}
