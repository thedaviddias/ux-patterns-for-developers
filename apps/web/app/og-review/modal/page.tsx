import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MODAL_COVER_SIZE, MODAL_OG_SIZE } from "@/components/modal-og";

const mobilePreviewWidth = 390;
const mobileScale = mobilePreviewWidth / MODAL_OG_SIZE.width;
const mobilePreviewHeight = Math.round(MODAL_OG_SIZE.height * mobileScale);
const coverPreviewWidth = 900;
const ogPngRoute = "/covers/patterns/modal.png";
const coverPngRoute = "/covers/patterns/modal.png";

export const metadata: Metadata = {
	title: "OG Review: Shared Pattern Image",
	robots: {
		index: false,
		follow: false,
	},
};

export default function ModalOgReviewPage() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-10">
			<div className="flex flex-col gap-3">
				<p className="text-sm font-medium uppercase tracking-[0.16em] text-amber-500">
					Internal review
				</p>
				<h1 className="text-3xl font-semibold tracking-tight text-foreground">
					Modal OG Prototype
				</h1>
				<p className="max-w-2xl text-base text-muted-foreground">
					Review the single shared image used for both OG metadata and pattern
					previews.
				</p>
				<div className="flex flex-wrap gap-3">
					<Link
						href={ogPngRoute}
						target="_blank"
						className="inline-flex items-center rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90"
					>
						Open PNG route
					</Link>
					<Link
						href={coverPngRoute}
						target="_blank"
						className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/40"
					>
						Open cover route
					</Link>
				</div>
			</div>

			<section className="flex flex-col gap-4">
				<div>
					<h2 className="text-lg font-semibold text-foreground">OG usage</h2>
					<p className="text-sm text-muted-foreground">
						The shared cover asset rendered at full OG size.
					</p>
				</div>
				<div className="overflow-x-auto rounded-3xl border border-border bg-card/40 p-4">
					<Image
						src={ogPngRoute}
						alt="Modal OG preview"
						width={MODAL_OG_SIZE.width}
						height={MODAL_OG_SIZE.height}
						unoptimized
						style={{
							display: "block",
							width: MODAL_OG_SIZE.width,
							height: MODAL_OG_SIZE.height,
						}}
					/>
				</div>
			</section>

			<section className="flex flex-col gap-4">
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						Mobile preview
					</h2>
					<p className="text-sm text-muted-foreground">
						Scaled live PNG to check legibility in smaller social preview cards.
					</p>
				</div>
				<div className="rounded-3xl border border-border bg-card/40 p-6">
					<div
						style={{
							width: mobilePreviewWidth,
							height: mobilePreviewHeight,
							overflow: "hidden",
							borderRadius: 24,
							border: "1px solid rgba(255, 255, 255, 0.08)",
						}}
					>
						<Image
							src={ogPngRoute}
							alt="Modal OG mobile preview"
							width={MODAL_OG_SIZE.width}
							height={MODAL_OG_SIZE.height}
							unoptimized
							style={{
								display: "block",
								width: MODAL_OG_SIZE.width,
								height: MODAL_OG_SIZE.height,
								transform: `scale(${mobileScale})`,
								transformOrigin: "top left",
							}}
						/>
					</div>
				</div>
			</section>

			<section className="flex flex-col gap-4">
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						Shared image
					</h2>
					<p className="text-sm text-muted-foreground">
						The same asset consumed by the pattern preview component.
					</p>
				</div>
				<div className="overflow-x-auto rounded-3xl border border-border bg-card/40 p-4">
					<Image
						src={coverPngRoute}
						alt="Modal cover preview"
						width={MODAL_COVER_SIZE.width}
						height={MODAL_COVER_SIZE.height}
						className="block h-auto w-full max-w-[1100px]"
						unoptimized
					/>
				</div>
			</section>

			<section className="flex flex-col gap-4">
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						Pattern preview usage
					</h2>
					<p className="text-sm text-muted-foreground">
						Scaled cover preview at the size the docs UI roughly uses today.
					</p>
				</div>
				<div className="rounded-3xl border border-border bg-card/40 p-6">
					<Image
						src={coverPngRoute}
						alt="Modal cover at preview scale"
						width={MODAL_COVER_SIZE.width}
						height={MODAL_COVER_SIZE.height}
						unoptimized
						style={{
							display: "block",
							width: "100%",
							maxWidth: coverPreviewWidth,
							height: "auto",
						}}
					/>
				</div>
			</section>
		</main>
	);
}
