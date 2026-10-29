import { buildCardList } from '../../scripts/lux.js';
import {
  fetchFragment,
  instrumentField,
  instrumentFragment,
  readFragmentPath,
  showFragmentPlaceholder,
} from '../../scripts/content-fragments.js';

/**
 * Renders a Testimonial fragment into the authored row shape: a single cell
 * with the quote paragraph and an attribution paragraph.
 * @param {Element} row The block item row
 * @param {string} path Fragment path
 * @param {Object} fragment The fragment's fields
 */
function renderTestimonial(row, path, fragment) {
  const body = document.createElement('div');
  instrumentFragment(body, path, fragment.attribution || 'Testimonial');
  const quote = document.createElement('p');
  quote.textContent = fragment.quote || '';
  instrumentField(quote, 'quote', 'Quote');
  body.append(quote);
  if (fragment.attribution) {
    const attribution = document.createElement('p');
    const name = document.createElement('span');
    name.textContent = fragment.attribution;
    instrumentField(name, 'attribution', 'Attribution');
    attribution.append('— ', name);
    body.append(attribution);
  }
  row.replaceChildren(body);
}

/**
 * cards-testimonial — bordered quote cards: a serif client quote followed by
 * a small uppercase attribution ("— M. Laurent, Paris").
 *
 * Authored items: one per testimonial, each referencing a Testimonial
 * Content Fragment (quote, attribution). The last paragraph is the
 * attribution when there is more than one.
 */
export default async function decorate(block) {
  await Promise.all([...block.children].map(async (row) => {
    const path = readFragmentPath(row);
    if (!path) return;
    const { item, error } = await fetchFragment('testimonial-by-path', path);
    if (item) renderTestimonial(row, path, item);
    else if (!showFragmentPlaceholder(row, `Testimonial fragment not available: ${path} (${error})`)) row.remove();
  }));

  buildCardList(block, 'cards-testimonial').forEach((card) => {
    const body = card.querySelector('.cards-testimonial-card-body');
    if (!body) return;
    const paragraphs = [...body.querySelectorAll(':scope > p')];
    if (paragraphs.length < 2) {
      if (paragraphs[0]) paragraphs[0].classList.add('cards-testimonial-quote');
      return;
    }
    const attribution = paragraphs.pop();
    attribution.classList.add('cards-testimonial-attribution');
    paragraphs.forEach((p) => p.classList.add('cards-testimonial-quote'));

    // wrap the copy in blockquote/figcaption semantics
    const figure = document.createElement('figure');
    const quote = document.createElement('blockquote');
    quote.append(...paragraphs);
    const caption = document.createElement('figcaption');
    caption.append(attribution);
    figure.append(quote, caption);
    body.append(figure);
  });
}
