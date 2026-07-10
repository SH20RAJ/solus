import AmbientPlayer from "@/components/AmbientPlayer";

export default function LandingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			{children}
			<AmbientPlayer />
		</>
	);
}
