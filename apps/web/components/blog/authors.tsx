import type { FC } from "react";
import { formatDate } from "@/utils/date";
import { LinkCustom } from "../link-custom";

type TopContentProps = {
	title: string;
	date: string;
	authors: {
		name: string;
		link: string;
	}[];
};

export const TopContent: FC<TopContentProps> = async ({
	title,
	date,
	authors,
}) => {
	const dateObj = new Date(date);

	const dateObjFormatted = formatDate(dateObj);

	return (
		<>
			<h1>{title}</h1>
			<div className="mt-8 mb-16 text-sm text-gray-400">
				<time dateTime={dateObj.toISOString()}>{dateObjFormatted}</time> {"by"}{" "}
				{authors.map((author) => (
					<span key={author.name} className="not-last:after:content-[',_']">
						<LinkCustom
							href={author.link}
							className="text-gray-800 dark:text-gray-100"
						>
							{author.name}
						</LinkCustom>
					</span>
				))}
			</div>
		</>
	);
};
