import { generatePatternSkills } from "./pattern-skills-lib.mjs";

const selectedFiles = process.argv.slice(2);

await generatePatternSkills({ selectedFiles });
