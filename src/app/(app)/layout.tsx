import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen bg-background text-text-primary">
			{/* Desktop sidebar */}
			<Sidebar />

			{/* Main content — offset for sidebar on desktop */}
			<main className="sm:ml-[260px] min-h-screen pb-16 sm:pb-0 flex justify-center transition-all duration-300 ease-in-out">
				<div className="w-full max-w-[600px] px-4 sm:px-6">
					{children}
				</div>
			</main>

			{/* Mobile bottom nav */}
			<BottomNav />
		</div>
	);
}
