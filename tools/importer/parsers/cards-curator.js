/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-curator. Base: cards.
 * Source: rendered EDS page — decorated output of blocks/cards-curator/cards-curator.js
 *   (ul > li > .cards-curator-card-image + .cards-curator-card-body).
 * Model (cards-curator-item): image (+imageAlt collapsed), text (richtext).
 * Authored rows: one per curator = [image, eyebrow p + heading + bio p + link p].
 */
export default function parse(element, { document }) {
  const cells = [];

  const items = [...element.querySelectorAll(':scope > ul > li')];
  items.forEach((li) => {
    const img = li.querySelector('.cards-curator-card-image img');
    const body = li.querySelector('.cards-curator-card-body');

    const imageFrag = document.createDocumentFragment();
    if (img) {
      imageFrag.appendChild(document.createComment(' field:image '));
      imageFrag.appendChild(img.closest('picture') || img);
    }

    const textFrag = document.createDocumentFragment();
    const nodes = body ? [...body.children].filter((el) => el.textContent.trim()) : [];
    if (nodes.length) {
      textFrag.appendChild(document.createComment(' field:text '));
      nodes.forEach((n) => textFrag.appendChild(n));
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-curator', cells });
  element.replaceWith(block);
}
