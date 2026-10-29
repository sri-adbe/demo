/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-destination. Base: cards.
 * Source: rendered EDS page — decorated output of blocks/cards-destination/cards-destination.js
 *   (ul > li > .cards-destination-card-image + .cards-destination-card-body).
 * Model (cards-destination-item): fragment (aem-content-fragment).
 * Authored rows: one per destination = [Destination Content Fragment path].
 * The card copy and image live in the fragment, at
 * /content/dam/demo/destinations/<slug of the destination name>.
 */
const FRAGMENT_ROOT = '/content/dam/demo/destinations';

const slugify = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function parse(element, { document }) {
  const cells = [];

  const items = [...element.querySelectorAll(':scope > ul > li')];
  items.forEach((li) => {
    const name = li.querySelector('.cards-destination-card-body h2, .cards-destination-card-body h3, .cards-destination-card-body h4');
    if (!name || !name.textContent.trim()) return;

    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:fragment '));
    const p = document.createElement('p');
    p.textContent = `${FRAGMENT_ROOT}/${slugify(name.textContent.trim())}`;
    frag.appendChild(p);
    cells.push([frag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-destination', cells });
  element.replaceWith(block);
}
