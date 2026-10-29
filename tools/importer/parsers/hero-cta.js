/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-cta.
 * Source: rendered EDS page — decorated output of blocks/hero-cta/hero-cta.js
 *   (.hero-cta-image > picture > img, .hero-cta-content > p + h2 + p > a + p.hero-cta-note).
 * Model (blocks/hero-cta/_hero-cta.json): image (+imageAlt collapsed), text (richtext).
 * Authored rows: row 1 = background image, row 2 = eyebrow + heading + CTA + note.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: background image
  const img = element.querySelector('.hero-cta-image img, img');
  const imageFrag = document.createDocumentFragment();
  if (img) {
    imageFrag.appendChild(document.createComment(' field:image '));
    imageFrag.appendChild(img.closest('picture') || img);
  }
  cells.push([imageFrag]);

  // Row 2: richtext copy
  const content = element.querySelector('.hero-cta-content');
  const textFrag = document.createDocumentFragment();
  const nodes = content
    ? [...content.children].filter((el) => el.textContent.trim() || el.querySelector('img'))
    : [];
  if (nodes.length) {
    textFrag.appendChild(document.createComment(' field:text '));
    nodes.forEach((n) => textFrag.appendChild(n));
  }
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
