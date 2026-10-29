/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-lux.
 * Source: rendered EDS page — decorated output of blocks/hero-lux/hero-lux.js
 *   (.hero-lux-image > picture > img, .hero-lux-content > h1 + p + p > a).
 * Model (blocks/hero-lux/_hero-lux.json): image (+imageAlt collapsed), text (richtext).
 * Authored rows: row 1 = image, row 2 = headline + subline + CTA.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: image
  const img = element.querySelector('.hero-lux-image img, img');
  const imageFrag = document.createDocumentFragment();
  if (img) {
    imageFrag.appendChild(document.createComment(' field:image '));
    imageFrag.appendChild(img.closest('picture') || img);
  }
  cells.push([imageFrag]);

  // Row 2: richtext copy (heading, subline, CTA)
  const content = element.querySelector('.hero-lux-content');
  const textFrag = document.createDocumentFragment();
  const nodes = content
    ? [...content.children].filter((el) => el.textContent.trim() || el.querySelector('img'))
    : [];
  if (nodes.length) {
    textFrag.appendChild(document.createComment(' field:text '));
    nodes.forEach((n) => textFrag.appendChild(n));
  }
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-lux', cells });
  element.replaceWith(block);
}
