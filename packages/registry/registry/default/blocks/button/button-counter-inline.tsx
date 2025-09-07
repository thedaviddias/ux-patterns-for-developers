/**
 * @registry
 * @name button-counter-inline
 * @title Button with Inline Counters
 * @type registry:block
 * @description Button with inline counters and interactive counts
 * @categories ["buttons", "counters", "interactive"]
 * @tags ["counters", "inline", "interactive", "social", "engagement", "lucide", "haptics"]
 * @dependencies ["lucide-react", "react"]
 * @registryDependencies ["button"]
 */
"use client";

import { Eye, Heart, MessageSquare, Star, ThumbsUp, Users } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/ui/button";

export default function ButtonCounterInline() {
	const [starred, setStarred] = useState(false);
	const [starCount, setStarCount] = useState(234);
	const [liked, setLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(42);
	const commentsCountId = useId();
	const followerCountId = useId();

	const handleLike = () => {
		setLiked(!liked);
		setLikeCount(liked ? likeCount - 1 : likeCount + 1);
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Basic counters */}
			<div className="flex flex-wrap gap-2">
				<Button
					type="button"
					variant="outline"
					className="tabular-nums"
					aria-pressed={starred}
					aria-label={`${starred ? "Unstar" : "Star"} this repository, ${starCount.toLocaleString()} stars`}
					onClick={() => {
						setStarred((prev) => {
							const next = !prev;
							setStarCount((c) => Math.max(0, c + (next ? 1 : -1)));
							return next;
						});
					}}
				>
					<Star className="h-4 w-4" fill={starred ? "currentColor" : "none"} />
					<span aria-hidden="true">{starCount.toLocaleString()}</span>
					<span
						className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium"
						aria-hidden="true"
					>
						{/* duplicate visual badge */}
						{starCount.toLocaleString()}
					</span>
				</Button>
				<Button variant="ghost" className="tabular-nums" type="button">
					<ThumbsUp className="h-4 w-4" />
					Like
					<span className="sr-only">, 42 likes</span>
					<span
						className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium"
						aria-hidden="true"
					>
						42
					</span>
				</Button>
				<Button
					type="button"
					variant="soft"
					className="tabular-nums"
					aria-describedby={commentsCountId}
				>
					<MessageSquare className="h-4 w-4" />
					Comments
					<span
						id={commentsCountId}
						className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium"
					>
						18
					</span>
				</Button>
			</div>

			{/* Interactive counters */}
			<div className="flex flex-wrap gap-2">
				{/* Like with animation */}
				<Button
					type="button"
					variant={liked ? "danger" : "ghost"}
					onClick={handleLike}
					haptics={liked ? "medium" : "light"}
					sound="subtle"
					clickEffect={liked ? "spring" : "scale"}
					className="tabular-nums"
					aria-label={`${liked ? "Unlike" : "Like"} this post, ${likeCount} likes`}
				>
					<Heart className={liked ? "fill-current h-4 w-4" : "h-4 w-4"} />
					<span aria-hidden="true">{likeCount}</span>
				</Button>

				{/* Comment count */}
				<Button
					variant="ghost"
					haptics="light"
					className="tabular-nums"
					type="button"
					aria-label="View 128 comments"
				>
					<MessageSquare className="h-4 w-4" />
					<span aria-hidden="true">128</span>
				</Button>

				{/* View count (read-only) */}
				<Button
					type="button"
					variant="ghost"
					disabled
					className="tabular-nums"
					aria-label="1,200 views"
				>
					<Eye className="h-4 w-4" />
					<span aria-hidden="true">1.2k</span>
				</Button>

				{/* Followers */}
				<Button
					type="button"
					variant="soft"
					haptics="light"
					className="tabular-nums"
					aria-describedby={followerCountId}
				>
					<Users className="h-4 w-4" />
					Follow
					<span id={followerCountId} className="ml-2 text-xs opacity-60">
						{Number(892).toLocaleString()} followers
					</span>
				</Button>
			</div>
		</div>
	);
}
