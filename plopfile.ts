import { NodePlopAPI } from "plop";
import { PATTERNS_MAP } from "./app/_constants/patterns";
import { i18n } from "./app/_dictionaries/i18n-config";

export default function (plop: NodePlopAPI) {
  const availableSections = Object.values(PATTERNS_MAP).map((p) => ({
    name: p.name,
    value: p.path,
  }));

  plop.setGenerator("pattern", {
    description: "Generate pattern documentation outline",
    prompts: [
      {
        type: "list",
        name: "lang",
        message: "Select documentation language",
        choices: i18n.locales,
        default: i18n.defaultLocale,
      },
      {
        type: "list",
        name: "section",
        message: "Select documentation section",
        choices: availableSections,
      },
      {
        type: "input",
        name: "name",
        message: "What is the component name? (e.g., Breadcrumb)",
      },
    ],
    actions: [
      {
        type: "add",
        path: "content/{{lang}}/patterns/{{section}}/{{kebabCase name}}.mdx",
        templateFile: "templates/patterns/component.mdx.hbs",
      },
    ],
  });

  // Helper for creating example code blocks
  plop.setHelper("codeBlock", (content) => "```" + content + "```");

  plop.addHelper("lowercase", (text) => text.toLowerCase());
}
