import type { RehypePlugin, RemarkPlugin } from "@astrojs/markdown-remark";

import { h } from "hastscript";
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
        // summary is added separately in rehype pass, to keep existing children intact
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

/**
 * Adds summary to decision-tree details elements,
 * since this can't be done non-destructively during the remark pass.
 */
const addDecisionTreeSummary: RehypePlugin = () => (tree, file) => {
  if (!isGuidelineFile(file)) return;
  visit(tree, "element", (node) => {
    if (node.tagName === "details" && node.properties.class === "decision-tree") {
      node.children.unshift(h("summary", ["Which foundational requirements apply?"]));
    }
  });
};

export const guidelinesRemarkPlugins = [customDirectives];
export const guidelinesRehypePlugins = [extractFirstParagraph, addDecisionTreeSummary];
