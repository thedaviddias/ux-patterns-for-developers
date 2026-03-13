// @ts-nocheck -- generated source compatibility shim
import * as entries_1 from "../content/entries/carousel/klingai/carousel-auto-play.mdx?collection=entries&hash=1757647098250";
import * as entries_0 from "../content/entries/popover/klingai/popover-auto-open.mdx?collection=entries&hash=1757647098250";
import * as pages_1 from "../content/pages/privacy-policy.mdx?collection=pages&hash=1757647098250";
import * as pages_0 from "../content/pages/disclaimer.mdx?collection=pages&hash=1757647098250";
import { server } from "fumadocs-mdx/runtime/server";
import type * as Config from "../source.config";

const create = server<typeof Config>();

export const docs = await create.docs("docs", "content/docs", {}, {});

export const entries = await create.docs(
	"entries",
	"content/entries",
	{},
	{
		"popover/klingai/popover-auto-open.mdx": entries_0,
		"carousel/klingai/carousel-auto-play.mdx": entries_1,
	},
);

export const pages = await create.docs("pages", "content/pages", {}, {
	"disclaimer.mdx": pages_0,
	"privacy-policy.mdx": pages_1,
});
