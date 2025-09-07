/**
 * @registry
 * @name button-with-avatar
 * @title Button with Avatars
 * @type registry:block
 * @description Button with user avatars and profile information
 * @categories ["buttons", "avatars", "user-interface"]
 * @tags ["avatars", "user", "profile", "account", "menu", "lucide", "images"]
 * @dependencies ["lucide-react"]
 * @registryDependencies ["button"]
 */
import { ChevronDown } from "lucide-react";
import { Button } from "@/ui/button";

export default function ButtonWithAvatar() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button variant="ghost">
			<img
				loading="lazy"
				decoding="async"
				width={20}
				height={20}
				src="https://kit.uxpatterns.dev/avatar.jpg"
				alt="User avatar"
				className="h-5 w-5 rounded-full"
			/>
				@thedaviddias
			</Button>
			<Button variant="outline">
			<img
				loading="lazy"
				decoding="async"
				width={20}
				height={20}
				src="https://github.com/vercel.png"
				alt="Team avatar"
				className="h-5 w-5 rounded-full"
			/>
				Vercel Team
			</Button>
			<Button variant="soft">
				<span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white">
					JD
				</span>
				John Doe
			</Button>

			{/* Account menu button - common in headers */}
			<Button
				variant="ghost"
				size="sm"
				aria-label="Account menu"
				className="gap-1"
			>
			<img
				loading="lazy"
				decoding="async"
				width={24}
				height={24}
				src="https://kit.uxpatterns.dev/avatar.jpg"
				alt="User avatar"
				className="h-6 w-6 rounded-full"
			/>
				<ChevronDown className="h-4 w-4" />
			</Button>
		</div>
	);
}
