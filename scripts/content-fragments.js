/**
 * Loads Content Fragments for blocks that reference them, through AEM GraphQL
 * persisted queries. Inside Universal Editor the page runs on the author host,
 * so fragments come from author with the editor's session; everywhere else
 * they come from publish, which only serves published fragments.
 */

const AEM_AUTHOR = 'https://author-p111858-e1309055.adobeaemcloud.com';
const AEM_PUBLISH = 'https://publish-p111858-e1309055.adobeaemcloud.com';
// GraphQL endpoint configuration (/conf/demo) that holds the persisted queries
const GRAPHQL_CONFIG = 'demo';

const isAuthor = window.location.hostname.startsWith('author-');
const aemHost = isAuthor ? AEM_AUTHOR : AEM_PUBLISH;

/**
 * Reads the fragment path a block item references. The picker value arrives
 * as a link or as plain text, depending on how the page was rendered.
 * @param {Element} row The block item row
 * @returns {string} The fragment path, or an empty string
 */
export function readFragmentPath(row) {
  const link = row.querySelector('a[href]');
  const value = link ? link.getAttribute('href') : row.textContent.trim();
  if (!value) return '';
  const path = new URL(value, window.location.href).pathname.replace(/\.html$/, '');
  // fragments live in Assets; anything else is not a fragment reference
  return path.startsWith('/content/dam/') ? path : '';
}

/**
 * Fetches one fragment through a persisted query that takes a `path` variable.
 * @param {string} query Persisted query name, e.g. `destination-by-path`
 * @param {string} path Fragment path in the DAM
 * @returns {Promise<{item: Object|null, error: string}>} The fragment's fields, or why
 * they couldn't be loaded
 */
export async function fetchFragment(query, path) {
  // AEM reads the variable as-is, so slashes must stay unencoded; only encode each segment
  const pathParam = path.split('/').map(encodeURIComponent).join('/');
  const url = `${aemHost}/graphql/execute.json/${GRAPHQL_CONFIG}/${query};path=${pathParam}`;
  try {
    const resp = await fetch(url, isAuthor ? { credentials: 'include' } : {});
    if (!resp.ok) return { item: null, error: `HTTP ${resp.status} from ${query}` };
    const { data, errors } = await resp.json();
    const item = data && Object.values(data)[0]?.item;
    if (item) return { item, error: '' };
    return { item: null, error: errors?.[0]?.message || 'no fragment at this path' };
  } catch (e) {
    return { item: null, error: e.message };
  }
}

/**
 * Resolves a fragment image reference to a URL the current host can load.
 * @param {Object} imageRef GraphQL ImageRef (`_authorUrl`, `_publishUrl`, `_dynamicUrl`)
 * @param {string} width Requested rendition width
 * @returns {string} The image URL, or an empty string
 */
export function fragmentImageUrl(imageRef, width = '1200') {
  if (!imageRef) return '';
  // GraphQL system fields are prefixed with an underscore
  const { _authorUrl: authorUrl, _publishUrl: publishUrl, _dynamicUrl: dynamicUrl } = imageRef;
  if (isAuthor) return authorUrl || '';
  if (dynamicUrl) {
    const url = new URL(dynamicUrl, AEM_PUBLISH);
    url.searchParams.set('width', width);
    return url.href;
  }
  return publishUrl || '';
}

/**
 * Makes a fragment editable in place in Universal Editor. Only applied on
 * author, where the editor runs.
 * @param {Element} el Element holding the fragment's rendering
 * @param {string} path Fragment path
 * @param {string} label Label shown in the editor
 */
export function instrumentFragment(el, path, label) {
  if (!isAuthor) return;
  el.dataset.aueResource = `urn:aemconnection:${path}/jcr:content/data/master`;
  el.dataset.aueType = 'reference';
  el.dataset.aueFilter = 'cf';
  el.dataset.aueLabel = label;
}

/**
 * Makes one fragment field editable in place in Universal Editor.
 * @param {Element} el Element rendering the field
 * @param {string} prop Field name in the fragment model
 * @param {string} label Label shown in the editor
 * @param {string} [type] Universal Editor field type
 */
export function instrumentField(el, prop, label, type = 'text') {
  if (!isAuthor) return;
  el.dataset.aueProp = prop;
  el.dataset.aueType = type;
  el.dataset.aueLabel = label;
}

/**
 * Tells authors that a picked fragment couldn't be loaded. On other hosts
 * the item is simply left out.
 * @param {Element} row The block item row
 * @param {string} message Text to show
 * @returns {boolean} Whether a placeholder was added
 */
export function showFragmentPlaceholder(row, message) {
  if (!isAuthor) return false;
  const cell = document.createElement('div');
  const p = document.createElement('p');
  p.textContent = message;
  cell.append(p);
  row.replaceChildren(cell);
  return true;
}
