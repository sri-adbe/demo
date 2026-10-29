/* eslint-disable */
/* global WebImporter */

/**
 * Cleanup transformer for the Lux Travel (rendered EDS) source page.
 * Selectors are taken from migration-work/cleaned.html.
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Site chrome rendered by the EDS header/footer blocks.
    WebImporter.DOMUtils.remove(element, [
      'header.header-wrapper',
      'footer.footer-wrapper',
      'nav#nav',
      '.nav-wrapper',
    ]);

    // Empty trailing sections (e.g. "<div class="section"></div>" at the end of main).
    element.querySelectorAll('main > div.section, div.section').forEach((section) => {
      if (!section.textContent.trim() && !section.querySelector('img, picture, video, iframe')) {
        section.remove();
      }
    });

    // Empty <source> elements in decorated <picture> tags carry no authorable data.
    element.querySelectorAll('picture > source, picture source').forEach((source) => {
      if (!source.getAttribute('srcset')) {
        // Unwrap nested sources while keeping any children (e.g. the <img>).
        while (source.firstChild) source.parentNode.insertBefore(source.firstChild, source);
        source.remove();
      }
    });

    // Drop EDS rendition params (?width=750&format=...) so the original media is imported.
    element.querySelectorAll('img[src*="/media_"]').forEach((img) => {
      img.setAttribute('src', img.getAttribute('src').split('?')[0]);
    });
  }

  if (hookName === 'afterTransform') {
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      'script',
      'style',
      'noscript',
      'link',
      'iframe[src*="tracking"]',
    ]);

    element.querySelectorAll('[data-block-status], [data-section-status], [data-block-name]').forEach((el) => {
      el.removeAttribute('data-block-status');
      el.removeAttribute('data-section-status');
      el.removeAttribute('data-block-name');
    });
  }
}
