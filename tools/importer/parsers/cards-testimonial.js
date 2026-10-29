/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-testimonial. Base: cards (no images).
 * Source: rendered EDS page — decorated output of blocks/cards-testimonial/cards-testimonial.js
 *   (ul > li > .cards-testimonial-card-body > figure > blockquote > p + figcaption > p).
 * Model (cards-testimonial-item): fragment (aem-content-fragment).
 * Authored rows: one per testimonial = [Testimonial Content Fragment path].
 * The quote and attribution live in the fragment, at
 * /content/dam/demo/testimonials/<slug of the attribution>.
 */
const FRAGMENT_ROOT = '/content/dam/demo/testimonials';

const slugify = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function parse(element, { document }) {
  const cells = [];

  const items = [...element.querySelectorAll(':scope > ul > li')];
  items.forEach((li) => {
    const body = li.querySelector('.cards-testimonial-card-body');
    const paragraphs = body ? [...body.querySelectorAll('p')].filter((p) => p.textContent.trim()) : [];
    if (!paragraphs.length) return;
    // the attribution ("— M. Laurent, Paris") names the fragment
    const attribution = paragraphs[paragraphs.length - 1].textContent.replace(/^[\s—–-]+/, '').trim();

    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:fragment '));
    const p = document.createElement('p');
    p.textContent = `${FRAGMENT_ROOT}/${slugify(attribution)}`;
    frag.appendChild(p);
    cells.push([frag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-testimonial', cells });
  element.replaceWith(block);
}
