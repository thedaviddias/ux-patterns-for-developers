"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export default function ButtonLoadingStates() {
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = () => {
		setIsLoading(true);
		setTimeout(() => setIsLoading(false), 2000);
	};

	return (
		<div className="flex flex-wrap items-center gap-2">
			<Button onClick={handleClick} disabled={isLoading}>
				{isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
				{isLoading ? "Saving..." : "Save Changes"}
			</Button>

			<Button disabled>
				<Loader2 className="h-4 w-4 animate-spin" />
				Processing...
			</Button>
		</div>
	);
}
