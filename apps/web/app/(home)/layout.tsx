import BaseHome from "@/components/layout/base-home";

export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<BaseHome params={Promise.resolve({ slug: "/" })}>{children}</BaseHome>
	);
}
