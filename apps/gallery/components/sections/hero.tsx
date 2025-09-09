import { cn } from "@ux-patterns/ui/lib/utils";

export default async function Hero() {
	return (
		<section>
			<div className="relative h-full overflow-hidden py-5 md:py-14">
				<div className="z-10 flex flex-col">
					<div className="mt-10 grid grid-cols-1">
						<div className="flex flex-col items-start gap-6 px-7 pb-8 text-center md:items-center md:px-10">
							<div className="relative flex flex-col gap-4 md:items-center lg:flex-row">
								<h1
									className={cn(
										"text-black dark:text-white",
										"relative mx-0 max-w-[43.5rem]  pt-5  md:mx-auto md:px-4 md:py-2",
										"text-balance text-left font-semibold tracking-tighter md:text-center",
										"text-5xl sm:text-7xl md:text-7xl lg:text-7xl",
									)}
								>
									Real UX patterns. Real results. Real lessons.
								</h1>
							</div>

							<p className="max-w-xl text-balance text-center text-base tracking-tight text-black dark:text-white md:text-center md:text-lg ">
								Visual examples of UX patterns in the wild. Learn from real
								implementations—what works, what doesn't and why.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
