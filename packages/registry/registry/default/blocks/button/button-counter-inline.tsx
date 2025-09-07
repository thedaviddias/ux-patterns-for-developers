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

	const _handleStar = () => {
		setStarred(!starred);
		setStarCount(starred ? starCount - 1 : starCount + 1);
	};

	const handleLike = () => {
		setLiked(!liked);
		setLikeCount(liked ? likeCount - 1 : likeCount + 1);
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Basic counters */}
			<div className="flex flex-wrap gap-2">
				<Button
					variant="outline"
					className="tabular-nums"
					aria-label="Star this repository, 729 stars"
				>
					<Star className="h-4 w-4" />
					Star
					<span
						className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium"
						aria-hidden="true"
					>
						729
					</span>
				</Button>
				<Button variant="ghost" className="tabular-nums">
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
				<Button variant="ghost" haptics="light" className="tabular-nums">
					<MessageSquare className="h-4 w-4" />
					<span className="sr-only">View comments,</span>
					128
					<span className="sr-only">comments</span>
				</Button>

				{/* View count (read-only) */}
				<Button
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
					variant="soft"
					haptics="light"
					className="tabular-nums"
					aria-describedby={followerCountId}
				>
					<Users className="h-4 w-4" />
					Follow
					<span id={followerCountId} className="ml-2 text-xs opacity-60">
						892 followers
					</span>
				</Button>
			</div>
		</div>
	);
}
