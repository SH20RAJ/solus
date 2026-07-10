"use client";

import Image from "next/image";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
	const handleGoogleSignIn = () => {
		signIn.social({ provider: "google", callbackURL: "/home" });
	};

	const handleAppleSignIn = () => {
		signIn.social({ provider: "apple", callbackURL: "/home" });
	};

	return (
		<div className="w-full max-w-[360px] mx-auto">
			<div className="text-center mb-12">
				<Image
					src="/logo.png"
					alt="Solus"
					width={64}
					height={64}
					className="mx-auto rounded-[16px] mb-6"
				/>
				<h1 className="text-2xl font-bold tracking-tight text-text-primary">
					Welcome to Solus
				</h1>
				<p className="mt-2 text-sm text-text-secondary leading-relaxed">
					Document your life. Share when ready.
				</p>
			</div>

			<div className="space-y-3">
				<button
					id="google-signin"
					onClick={handleGoogleSignIn}
					className="w-full h-12 rounded-[12px] border border-border bg-card text-text-primary text-sm font-medium flex items-center justify-center gap-3 transition-colors duration-200 ease-out hover:bg-surface cursor-pointer"
				>
					<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
						<path
							d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
							fill="#4285F4"
						/>
						<path
							d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
							fill="#34A853"
						/>
						<path
							d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
							fill="#FBBC05"
						/>
						<path
							d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
							fill="#EA4335"
						/>
					</svg>
					Continue with Google
				</button>

				<button
					id="apple-signin"
					onClick={handleAppleSignIn}
					className="w-full h-12 rounded-[12px] bg-text-primary text-background text-sm font-medium flex items-center justify-center gap-3 transition-opacity duration-200 ease-out hover:opacity-85 cursor-pointer"
				>
					<svg width="16" height="18" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true">
						<path d="M13.545 10.239c-.022-2.234 1.823-3.306 1.906-3.356-.038-.056-1.032-1.586-2.707-1.906-.251-.03-.502-.045-.753-.045-1.082 0-2.023.447-2.623.447-.648 0-1.507-.436-2.478-.424C5.243 4.973 3.745 5.903 2.88 7.335 1.12 10.246 2.42 14.567 4.122 16.81c.813 1.098 1.78 2.33 3.05 2.286 1.224-.049 1.687-.792 3.168-.792s1.896.792 3.192.767c1.316-.025 2.152-1.12 2.957-2.222.932-1.275 1.316-2.51 1.34-2.574-.03-.013-2.568-1.005-2.594-3.983-.024-2.489 2.003-3.684 2.095-3.746-1.158-1.702-2.95-1.89-3.577-1.93-.7-.05-1.42.123-2.108.323z" />
						<path d="M11.19 3.31c.675-.817 1.13-1.953 1.006-3.085C11.15.277 9.888.973 9.185 1.79c-.63.728-1.182 1.892-1.034 3.008C9.27 4.882 10.514 4.126 11.19 3.31z" />
					</svg>
					Continue with Apple
				</button>
			</div>

			<p className="mt-8 text-xs text-text-muted text-center leading-relaxed">
				By continuing, you agree to Solus&apos;s Terms of Service and
				Privacy Policy.
			</p>
		</div>
	);
}
