import { HomeLayout } from "@ux-patterns/ui/components/custom/header";
import { baseOptions } from "@/lib/layout.shared";

export default function BaseHome({ children }: LayoutProps<"/">) {
	return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
