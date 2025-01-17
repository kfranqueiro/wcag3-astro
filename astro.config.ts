import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import remarkDefinitionList from "remark-definition-list";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkDefinitionList],
  },
  experimental: {
    contentIntellisense: true,
  },
});
