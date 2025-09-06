"use client";

import { Bell, AlertTriangle } from "lucide-react";
import { Button } from "@/ui/button";
import { useState } from "react";

export default function ButtonNotificationBadge() {
	const [notifications, setNotifications] = useState(5);

	return (
		<div className="flex flex-col gap-4">
			{/* Basic badges */}
			<div className="flex flex-wrap gap-2">
				<Button aria-label="Messages, 12 new">
					Messages
					<span className="ml-2 inline-flex h-5 select-none items-center justify-center rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-medium text-primary-foreground" aria-hidden="true">
						12
					</span>
				</Button>
				<Button variant="outline">
					Notifications
					<span className="sr-only">, 3 unread</span>
					<span className="ml-2 inline-flex h-5 select-none items-center justify-center rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400" aria-hidden="true">
						3
					</span>
				</Button>
				<Button variant="soft" aria-describedby="updates-new">
					Updates
					<span id="updates-new" className="ml-2 inline-flex h-5 select-none items-center justify-center rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
						New
					</span>
				</Button>
			</div>

			{/* Notification badges */}
			<div className="flex flex-wrap gap-2">
				{/* Icon with badge */}
				<Button
					variant="outline"
					size="sm"
					aria-label={`Notifications${notifications > 0 ? ` (${notifications})` : ''}`}
					onClick={() => setNotifications(0)}
					haptics="light"
					sound="subtle"
					className="relative h-9 w-9 p-0"
				>
					<Bell className="h-4 w-4" />
					{notifications > 0 && (
						<span className="absolute -top-2 left-full -translate-x-1/2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
							{notifications > 99 ? "99+" : notifications}
						</span>
					)}
				</Button>

				{/* Pulsing notification */}
				<Button
					variant="soft"
					aria-label="Updates available"
					className="relative"
				>
					Updates
					<span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
						<span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
					</span>
				</Button>

				{/* Warning badge */}
				<Button variant="warning" haptics="medium">
					<AlertTriangle className="h-4 w-4" />
					Action Required
					<span className="ml-2 inline-flex h-5 items-center justify-center rounded-full bg-red-500 px-2 text-[10px] font-bold text-white">
						!
					</span>
				</Button>
			</div>
		</div>
	);
}
