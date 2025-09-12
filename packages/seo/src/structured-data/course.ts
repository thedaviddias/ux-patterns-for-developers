import type { SchemaOrgBase } from "../types";
import { StructuredDataGenerator } from "./base";

export class CourseSchema extends StructuredDataGenerator {
	/**
	 * Generate SoftwareSourceCode schema
	 */
	softwareCode(options: {
		name: string;
		description: string;
		programmingLanguage: string;
		codeText?: string;
		codeRepository?: string;
		runtimePlatform?: string;
	}): SchemaOrgBase & Record<string, any> {
		return {
			"@context": "https://schema.org",
			"@type": "SoftwareSourceCode",
			name: options.name,
			description: options.description,
			programmingLanguage: {
				"@type": "ComputerLanguage",
				name: options.programmingLanguage,
			},
			...(options.codeText && { text: options.codeText }),
			...(options.codeRepository && { codeRepository: options.codeRepository }),
			...(options.runtimePlatform && {
				runtimePlatform: options.runtimePlatform,
			}),
			author: {
				"@id": this.config.authorUrl || `${this.config.baseUrl}/about#author`,
			},
			publisher: {
				"@id": `${this.config.baseUrl}/#organization`,
			},
		};
	}

	/**
	 * Generate Course schema
	 */
	course(options: {
		name: string;
		description: string;
		url: string;
		educationalLevel?: string;
		timeRequired?: string;
		prerequisites?: string[];
		isAccessibleForFree?: boolean;
		teaches?: string;
	}): SchemaOrgBase & Record<string, any> {
		return {
			"@context": "https://schema.org",
			"@type": "Course",
			name: options.name,
			description: options.description,
			url: this.absoluteUrl(options.url),
			provider: {
				"@id": `${this.config.baseUrl}/#organization`,
			},
			author: {
				"@id": this.config.authorUrl || `${this.config.baseUrl}/about#author`,
			},
			isAccessibleForFree: options.isAccessibleForFree ?? true,
			...(options.educationalLevel && {
				educationalLevel: options.educationalLevel,
			}),
			...(options.timeRequired && { timeRequired: options.timeRequired }),
			...(options.prerequisites &&
				options.prerequisites.length > 0 && {
					coursePrerequisites: options.prerequisites.map((prereq) => ({
						"@type": "AlignmentObject",
						targetName: prereq,
					})),
				}),
			inLanguage: "en-US",
			learningResourceType: "Tutorial",
			...(options.teaches && {
				teaches: {
					"@type": "DefinedTerm",
					name: options.teaches,
				},
			}),
		};
	}
}
