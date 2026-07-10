import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen bg-background text-text-primary">
			{/* Desktop sidebar */}
			<Sidebar />

			{/* Main content — offset for sidebar on desktop */}
			<main className="sm:ml-[260px] min-h-screen pb-16 sm:pb-0 flex justify-center">
				<div className="w-full max-w-[600px] px-4 sm:px-6">
					{children}
				</div>
			</main>

			{/* Mobile bottom nav */}
			<BottomNav />
		</div>
	);
}
