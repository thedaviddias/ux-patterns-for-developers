import { ArticleSchema } from "./structured-data/article";
import { BreadcrumbSchema } from "./structured-data/breadcrumb";
import { CourseSchema } from "./structured-data/course";
import { HowToSchema } from "./structured-data/how-to";
import { ListSchema } from "./structured-data/lists";
import { OrganizationSchema } from "./structured-data/organization";
import type { BreadcrumbItem, StructuredDataConfig } from "./types";

// Re-export helpers
export {
	combineSchemas,
	JsonLd,
	renderJsonLd,
} from "./structured-data/helpers";

/**
 * Main StructuredDataGenerator class that combines all schema generators
 */
export class StructuredDataGenerator {
	private organizationSchema: OrganizationSchema;
	private articleSchema: ArticleSchema;
	private breadcrumbSchema: BreadcrumbSchema;
	private howToSchema: HowToSchema;
	private listSchema: ListSchema;
	private courseSchema: CourseSchema;

	constructor(config: StructuredDataConfig) {
		this.organizationSchema = new OrganizationSchema(config);
		this.articleSchema = new ArticleSchema(config);
		this.breadcrumbSchema = new BreadcrumbSchema(config);
		this.howToSchema = new HowToSchema(config);
		this.listSchema = new ListSchema(config);
		this.courseSchema = new CourseSchema(config);
	}

	// Organization schemas
	organization(options?: Parameters<OrganizationSchema["organization"]>[0]) {
		return this.organizationSchema.organization(options);
	}

	website(options?: Parameters<OrganizationSchema["website"]>[0]) {
		return this.organizationSchema.website(options);
	}

	person(options: Parameters<OrganizationSchema["person"]>[0]) {
		return this.organizationSchema.person(options);
	}

	softwareApplication(
		options: Parameters<OrganizationSchema["softwareApplication"]>[0],
	) {
		return this.organizationSchema.softwareApplication(options);
	}

	// Article schemas
	article(options: Parameters<ArticleSchema["article"]>[0]) {
		return this.articleSchema.article(options);
	}

	blogPost(options: Parameters<ArticleSchema["blogPost"]>[0]) {
		return this.articleSchema.blogPost(options);
	}

	// Breadcrumb schema
	breadcrumbs(items: BreadcrumbItem[]) {
		return this.breadcrumbSchema.breadcrumbs(items);
	}

	// How-to schemas
	faq(questions: Parameters<HowToSchema["faq"]>[0]) {
		return this.howToSchema.faq(questions);
	}

	howTo(options: Parameters<HowToSchema["howTo"]>[0]) {
		return this.howToSchema.howTo(options);
	}

	// List schemas
	itemList(options: Parameters<ListSchema["itemList"]>[0]) {
		return this.listSchema.itemList(options);
	}

	collectionPage(options: Parameters<ListSchema["collectionPage"]>[0]) {
		return this.listSchema.collectionPage(options);
	}

	// Course schemas
	softwareCode(options: Parameters<CourseSchema["softwareCode"]>[0]) {
		return this.courseSchema.softwareCode(options);
	}

	course(options: Parameters<CourseSchema["course"]>[0]) {
		return this.courseSchema.course(options);
	}
}
