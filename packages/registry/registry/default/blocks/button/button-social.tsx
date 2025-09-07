/**
 * @registry
 * @name button-social
 * @title Social Media Buttons
 * @type registry:block
 * @description Social media buttons with brand colors and icons
 * @categories ["buttons", "social", "authentication"]
 * @tags ["social", "brand", "authentication", "external", "icons"]
 * @dependencies ["lucide-react"]
 * @registryDependencies ["button"]
 */
import { Facebook, Github, Instagram, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/ui/button";

export default function ButtonSocial() {
	return (
		<div className="flex flex-col gap-4">
			{/* Primary social buttons */}
			<div className="flex flex-wrap gap-2">
				<Button
					type="button"
					variant="solid"
					hoverEffect="lift"
					className="bg-gray-900 hover:bg-black text-white transition-all hover:shadow-lg hover:shadow-black/20"
				>
					<Github className="h-4 w-4" />
					Sign in with GitHub
				</Button>

				<Button
					type="button"
					variant="solid"
					hoverEffect="lift"
					className="bg-black hover:bg-gray-900 text-white transition-all hover:shadow-lg hover:shadow-black/20"
				>
					<svg
						className="h-4 w-4"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
					</svg>
					Sign in with X
				</Button>

				<Button
					type="button"
					variant="solid"
					hoverEffect="lift"
					className="bg-[#4267B2] hover:bg-[#365899] text-white transition-all hover:shadow-lg hover:shadow-[#4267B2]/25"
				>
					<Facebook className="h-4 w-4" />
					Sign in with Facebook
				</Button>
			</div>

			{/* Outline social buttons */}
			<div className="flex flex-wrap gap-2">
				<Button
					type="button"
					variant="outline"
					hoverEffect="lift"
					className="border-[#0077B5] text-[#0077B5] hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] transition-all hover:shadow-lg hover:shadow-[#0077B5]/20"
				>
					<Linkedin className="h-4 w-4" />
					Connect LinkedIn
				</Button>

				<Button
					type="button"
					variant="outline"
					hoverEffect="lift"
					className="border-[#E4405F] text-[#E4405F] hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-all hover:shadow-lg hover:shadow-[#E4405F]/20"
				>
					<Instagram className="h-4 w-4" />
					Follow on Instagram
				</Button>

				<Button
					type="button"
					variant="outline"
					hoverEffect="lift"
					className="border-[#FF0000] text-[#FF0000] hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-all hover:shadow-lg hover:shadow-[#FF0000]/20"
				>
					<Youtube className="h-4 w-4" />
					Subscribe on YouTube
				</Button>
			</div>

			{/* Icon-only social buttons */}
			<div className="flex flex-wrap gap-2">
				<Button
					type="button"
					variant="solid"
					size="sm"
					hoverEffect="lift"
					className="bg-gray-900 hover:bg-black text-white transition-all hover:shadow-lg hover:shadow-black/20"
					aria-label="GitHub"
				>
					<Github className="h-4 w-4" />
				</Button>

				<Button
					type="button"
					variant="solid"
					size="sm"
					hoverEffect="lift"
					className="bg-black hover:bg-gray-900 text-white transition-all hover:shadow-lg hover:shadow-black/20"
					aria-label="X"
				>
					<svg
						className="h-4 w-4"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
					</svg>
				</Button>

				<Button
					type="button"
					variant="solid"
					size="sm"
					hoverEffect="lift"
					className="bg-[#4267B2] hover:bg-[#365899] text-white transition-all hover:shadow-lg hover:shadow-[#4267B2]/25"
					aria-label="Facebook"
				>
					<Facebook className="h-4 w-4" />
				</Button>

				<Button
					type="button"
					variant="solid"
					size="sm"
					hoverEffect="lift"
					className="bg-[#0077B5] hover:bg-[#006097] text-white transition-all hover:shadow-lg hover:shadow-[#0077B5]/25"
					aria-label="LinkedIn"
				>
					<Linkedin className="h-4 w-4" />
				</Button>

				<Button
					type="button"
					variant="solid"
					size="sm"
					hoverEffect="lift"
					className="bg-gradient-to-br from-[#833AB4] via-[#E4405F] to-[#FCAF45] hover:opacity-90 text-white transition-all hover:shadow-lg hover:shadow-[#E4405F]/25"
					aria-label="Instagram"
				>
					<Instagram className="h-4 w-4" />
				</Button>

				<Button
					type="button"
					variant="solid"
					size="sm"
					hoverEffect="lift"
					className="bg-[#FF0000] hover:bg-[#e60000] text-white transition-all hover:shadow-lg hover:shadow-[#FF0000]/25"
					aria-label="YouTube"
				>
					<Youtube className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
