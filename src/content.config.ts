import { defineCollection, reference, z } from "astro:content";
import { file, glob } from "astro/loaders";

/** howto can be set to true to indicate the informative and normative slugs are identical */
const howtoSchema = z
  .string()
  .regex(/^[\w-]+$/)
  .or(z.boolean());
const statusSchema = z.enum(["developing", "exploratory", "placeholder"]);

/** Contains fields common between guidelines and requirements */
const commonChildSchema = z.object({
  howto: howtoSchema.optional(),
  status: statusSchema.optional(),
  title: z.string().optional(),
});

export const collections = {
  acknowledgements: defineCollection({
    loader: glob({ pattern: "*.md*", base: "./guidelines/acknowledgements" }),
  }),
  groupOrder: defineCollection({
    loader: file("./guidelines/groups/index.json", {
      parser: (fileContent) => JSON.parse(fileContent).map((id: string) => ({ id })),
    }),
    schema: z.object({
      // This _should_ be able to use reference("groups"),
      // but it's not finding some of them even when they exist?
      id: z.string(),
    }),
  }),
  groups: defineCollection({
    loader: glob({ pattern: "*/index.json", base: "./guidelines/groups" }),
    schema: z.object({
      children: z.array(z.string()),
      status: statusSchema.optional(),
      title: z.string().optional(),
    }),
  }),
  guidelines: defineCollection({
    loader: glob({ pattern: "*/*/index.md*", base: "./guidelines/groups" }),
    schema: commonChildSchema.extend({
      // Note: can't use references for children while relying on default ids,
      // since auto-generated ids include every * segment rather than only the last.
      // Moreover, we can't override generateId for requirements to only use slug,
      // due to duplicates across separate guidelines, e.g. "style-guide"
      children: z.array(z.string()),
      description: z.string(),
    }),
  }),
  requirements: defineCollection({
    loader: glob({ pattern: "*/*/*/index.md*", base: "./guidelines/groups" }),
    schema: commonChildSchema.extend({
      needsAdditionalResearch: z.boolean().optional(),
      type: z.enum([
        "foundational",
        "supplemental",
        "requirement", // TODO: should this eventually cease to exist?
        "assertion", // TODO: do assertions warrant distinct (or fewer) fields?
      ]),
    }),
  }),
};
