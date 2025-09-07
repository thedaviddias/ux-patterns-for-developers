/**
 * @registry
 * @name button-payment
 * @title Payment & Checkout Buttons
 * @type registry:block
 * @description Payment buttons with brand colors and checkout flows
 * @categories ["buttons", "payment", "e-commerce"]
 * @tags ["payment", "e-commerce", "checkout", "brands", "stripe", "paypal", "apple-pay", "lucide"]
 * @dependencies ["lucide-react"]
 * @registryDependencies ["button"]
 */
import { Clock, CreditCard, ShoppingCart } from "lucide-react";
import { Button } from "@/ui/button";

export default function ButtonPayment() {
	return (
		<div className="flex flex-col gap-4">
			{/* Primary payment methods */}
			<div className="flex flex-wrap gap-2">
				<Button
					variant="solid"
					size="md"
					hoverEffect="lift"
					className="bg-[#5469d4] hover:bg-[#4456c7] text-white dark:bg-[#5469d4] dark:hover:bg-[#4456c7] transition-all hover:shadow-lg hover:shadow-[#5469d4]/20"
				>
					<CreditCard className="h-5 w-5" />
					Pay with Card
				</Button>

				<Button
					variant="solid"
					size="md"
					hoverEffect="lift"
					className="bg-[#FFC439] hover:bg-[#f7b500] text-black dark:bg-[#FFC439] dark:hover:bg-[#f7b500] dark:text-black transition-all hover:shadow-lg hover:shadow-[#FFC439]/20"
				>
					<svg
						className="w-4 h-4"
						aria-hidden="true"
						focusable="false"
						data-prefix="fab"
						data-icon="paypal"
						role="img"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 384 512"
					>
						<path
							fill="currentColor"
							d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4 .7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9 .7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"
						></path>
					</svg>
					PayPal
				</Button>

				<Button
					variant="solid"
					size="md"
					hoverEffect="lift"
					className="bg-gray-900 hover:bg-black text-white dark:bg-gray-100 dark:hover:bg-white dark:text-black transition-all hover:shadow-lg hover:shadow-black/20 dark:hover:shadow-white/20"
				>
					<svg
						className="w-5 h-5"
						aria-hidden="true"
						focusable="false"
						data-prefix="fab"
						data-icon="apple"
						role="img"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 384 512"
					>
						<path
							fill="currentColor"
							d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
						></path>
					</svg>
					Apple Pay
				</Button>
			</div>

			{/* Checkout button */}
			<div className="flex flex-wrap gap-2">
				<Button
					variant="success"
					size="md"
					wide
					hoverEffect="lift"
					className="font-semibold transition-all hover:shadow-lg hover:shadow-emerald-500/20"
				>
					<ShoppingCart className="h-5 w-5" />
					Complete Purchase - $99.00
				</Button>
			</div>

			{/* Modern alternative */}
			<div className="flex flex-wrap gap-2">
				<Button
					variant="outline"
					size="md"
					wide
					hoverEffect="lift"
					className="border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-semibold transition-all hover:shadow-lg hover:shadow-orange-500/20"
				>
					<Clock className="h-5 w-5" />
					Buy Now, Pay Later
				</Button>
			</div>
		</div>
	);
}
