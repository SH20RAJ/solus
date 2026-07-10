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
			<main className="sm:ml-[260px] pb-16 sm:pb-0">
				<div className="max-w-[760px] mx-auto px-4 sm:px-6">
					{children}
				</div>
			</main>

			{/* Mobile bottom nav */}
			<BottomNav />
		</div>
	);
}
