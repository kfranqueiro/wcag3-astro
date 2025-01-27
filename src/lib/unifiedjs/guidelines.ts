import type { RehypePlugin, RemarkPlugin } from "@astrojs/markdown-remark";

import { toHtml } from "hast-util-to-html";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

const isGuidelineFile = (file: VFile) => file.dirname?.startsWith(`${file.cwd}/guidelines/groups`);

const getFrontmatter = (file: VFile) => file.data.astro!.frontmatter!;

const customDirectives: RemarkPlugin = () => (tree, file) => {
  if (!isGuidelineFile(file)) return;
  visit(tree, (node) => {
    if (node.type === "containerDirective") {
      if (node.name === "decision-tree") {
        const data = node.data || (node.data = {});
        data.hName = "details";
        data.hProperties = { class: "decision-tree" };
        // Prepend summary to existing children (setting hChildren would clear them)
        node.children.unshift({
          type: "html",
          value: "<summary>Which foundational requirements apply?</summary>",
        });
      }
    } else if (node.type === "textDirective") {
      if (node.name === "term") {
        // TODO: validate that term exists, after they're distilled into a collection
        const data = node.data || (node.data = {});
        data.hName = "a";
      }
    }
  });
};

/** Extracts the first paragraph's HTML to a separate value. */
const extractFirstParagraph: RehypePlugin = () => (tree, file) => {
  if (!isGuidelineFile(file)) return;
  const firstChild = tree.children[0];

  if (firstChild.type === "element" && firstChild.tagName === "p") {
    const html = toHtml(firstChild, {
      allowDangerousCharacters: true,
      allowDangerousHtml: true,
    });
    getFrontmatter(file).description = html.replace(/^<p>(.*)<\/p>$/, "$1");
    tree.children.shift();
  } else {
    file.fail("Leading paragraph expected but not found.");
  }
};

export const guidelinesRemarkPlugins = [customDirectives];
export const guidelinesRehypePlugins = [extractFirstParagraph];
