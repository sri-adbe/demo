/* eslint-disable */
/* global WebImporter */

/**
 * Section transformer for the Lux Travel template.
 * beforeTransform: insert <hr> section breaks (and markers for styled sections)
 * while the original section elements still exist.
 * afterTransform: add Section Metadata blocks for styled sections.
 */
const MARKER_ATTR = 'data-excat-section-id';

function findSection(root, section) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (const sel of selectors) {
    if (!sel) continue;
    const el = root.querySelector(sel);
    if (el) return el;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const template = payload && payload.template;
  const sections = (template && template.sections) || [];
  if (sections.length < 2) return;
  const doc = element.ownerDocument || document;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const el = findSection(element, section);
      if (!el) continue;
      if (i === 0 && !section.style) continue;
      const hr = doc.createElement('hr');
      if (section.style) hr.setAttribute(MARKER_ATTR, section.id);
      el.parentNode.insertBefore(hr, el);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;
      const marker = element.querySelector(`hr[${MARKER_ATTR}="${section.id}"]`);
      const metadata = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });

      if (marker) {
        // Place Section Metadata at the end of this section: just before the next <hr> or at the end.
        let next = marker.nextElementSibling;
        let last = marker;
        while (next && next.tagName !== 'HR') {
          last = next;
          next = next.nextElementSibling;
        }
        last.after(metadata);
        if (i === 0) {
          marker.remove();
        } else {
          marker.removeAttribute(MARKER_ATTR);
        }
      } else {
        const el = findSection(element, section);
        if (el) el.after(metadata);
      }
    }
    // Safety: drop any leftover markers.
    element.querySelectorAll(`hr[${MARKER_ATTR}]`).forEach((hr) => hr.removeAttribute(MARKER_ATTR));
  }
}
