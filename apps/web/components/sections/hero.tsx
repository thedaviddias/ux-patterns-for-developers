import { cn } from "@ux-patterns/ui/lib/utils";
import { HomeCTA } from "./home-cta";

export default async function Hero() {
	return (
		<section>
			<div className="relative h-full overflow-hidden py-5 md:py-14">
				<div className="z-10 flex flex-col">
					<div className="mt-10 grid grid-cols-1 md:mt-20">
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
									Build Better User Experiences
								</h1>
							</div>

							<p className="max-w-xl text-balance text-left text-base tracking-tight text-black dark:font-medium dark:text-white md:text-center md:text-lg ">
								A collection of UX patterns for developers to build{" "}
								<b>effective</b>, <b>accessible</b>, and <b>usable</b> UI
								components.
							</p>
							<HomeCTA />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
