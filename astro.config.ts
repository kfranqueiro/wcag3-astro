import { defineConfig } from "astro/config";
import remarkDefinitionList from "remark-definition-list";
import remarkDirective from "remark-directive";

import { guidelinesRehypePlugins, guidelinesRemarkPlugins } from "./src/lib/unifiedjs/guidelines";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkDefinitionList, ...guidelinesRemarkPlugins],
    rehypePlugins: [...guidelinesRehypePlugins],
  },
  experimental: {
    contentIntellisense: true,
  },
});
