import { buildCardList, markEyebrow } from '../../scripts/lux.js';
import {
  fetchFragment,
  fragmentImageUrl,
  instrumentField,
  instrumentFragment,
  readFragmentPath,
  showFragmentPlaceholder,
} from '../../scripts/content-fragments.js';

/**
 * Renders a Destination fragment into the authored row shape: an image cell
 * and a body cell (country eyebrow, H3 name, description).
 * @param {Element} row The block item row
 * @param {string} path Fragment path
 * @param {Object} fragment The fragment's fields
 */
function renderDestination(row, path, fragment) {
  const imageCell = document.createElement('div');
  const src = fragmentImageUrl(fragment.image);
  if (src) {
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = src;
    img.alt = fragment.imageAlt || '';
    img.loading = 'lazy';
    instrumentField(img, 'image', 'Image', 'media');
    picture.append(img);
    imageCell.append(picture);
  }

  const body = document.createElement('div');
  instrumentFragment(body, path, fragment.name || 'Destination');
  const country = document.createElement('p');
  country.textContent = fragment.country || '';
  instrumentField(country, 'country', 'Country');
  const name = document.createElement('h3');
  name.textContent = fragment.name || '';
  instrumentField(name, 'name', 'Name');
  const description = document.createElement('p');
  description.textContent = fragment.description || '';
  instrumentField(description, 'description', 'Description');
  body.append(country, name, description);

  row.replaceChildren(...(src ? [imageCell, body] : [body]));
}

/**
 * cards-destination — large rounded destination photos in a two-up grid, each
 * captioned with a country eyebrow, the destination name and a short line.
 *
 * Authored items: one per destination, each referencing a Destination
 * Content Fragment (country, name, description, image, imageAlt).
 */
export default async function decorate(block) {
  await Promise.all([...block.children].map(async (row) => {
    const path = readFragmentPath(row);
    if (!path) return;
    const fragment = await fetchFragment('destination-by-path', path);
    if (fragment) renderDestination(row, path, fragment);
    else if (!showFragmentPlaceholder(row, `Destination fragment not available: ${path}`)) row.remove();
  }));

  buildCardList(block, 'cards-destination', '1200').forEach((card) => {
    const body = card.querySelector('.cards-destination-card-body');
    if (body) markEyebrow(body, 'cards-destination-eyebrow');
  });
}
