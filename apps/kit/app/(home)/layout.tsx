// import { HomeLayout } from "fumadocs-ui/layouts/home";
import { HomeLayout } from "@ux-patterns/ui/components/custom/header";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: LayoutProps<"/">) {
	return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
