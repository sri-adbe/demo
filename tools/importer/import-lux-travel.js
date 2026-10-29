/* eslint-disable */
/* global WebImporter */

import heroLuxParser from './parsers/hero-lux.js';
import cardsCuratorParser from './parsers/cards-curator.js';
import cardsDestinationParser from './parsers/cards-destination.js';
import cardsServiceParser from './parsers/cards-service.js';
import cardsTestimonialParser from './parsers/cards-testimonial.js';
import heroCtaParser from './parsers/hero-cta.js';
import cleanupTransformer from './transformers/lux-travel-cleanup.js';
import sectionsTransformer from './transformers/lux-travel-sections.js';

const PAGE_TEMPLATE = {
  'name': 'lux-travel',
  'urls': [
    'https://aem-20261026-1355--aaa-test--sri-adbe.aem.live/lux-travel'
  ],
  'representativeUrl': 'https://aem-20261026-1355--aaa-test--sri-adbe.aem.live/lux-travel',
  'description': 'Lux Travel landing page: photo hero, curator cards, destination cards, service cards, testimonials and closing CTA',
  'blocks': [
    {
      'name': 'hero-lux',
      'instances': [
        '.hero-lux.block',
        'div.hero-lux'
      ]
    },
    {
      'name': 'cards-curator',
      'instances': [
        '.cards-curator.block',
        'div.cards-curator'
      ]
    },
    {
      'name': 'cards-destination',
      'instances': [
        '.cards-destination.block',
        'div.cards-destination'
      ]
    },
    {
      'name': 'cards-service',
      'instances': [
        '.cards-service.block',
        'div.cards-service'
      ]
    },
    {
      'name': 'cards-testimonial',
      'instances': [
        '.cards-testimonial.block',
        'div.cards-testimonial'
      ]
    },
    {
      'name': 'hero-cta',
      'instances': [
        '.hero-cta.block',
        'div.hero-cta'
      ]
    }
  ],
  'urlPattern': '/*',
  'sections': [
    {
      'id': 'section-1',
      'name': 'hero',
      'selector': [
        '.section.hero-lux-container'
      ],
      'style': null,
      'blocks': [
        'hero-lux'
      ],
      'defaultContent': []
    },
    {
      'id': 'section-2',
      'name': 'curators',
      'selector': [
        '.section.cards-curator-container'
      ],
      'style': 'sand',
      'blocks': [
        'cards-curator'
      ],
      'defaultContent': [
        '.section.cards-curator-container > .default-content-wrapper'
      ]
    },
    {
      'id': 'section-3',
      'name': 'divider',
      'selector': [
        '.section.divider'
      ],
      'style': 'sand, divider',
      'blocks': [],
      'defaultContent': [
        '.section.divider > .default-content-wrapper'
      ]
    },
    {
      'id': 'section-4',
      'name': 'destinations',
      'selector': [
        '.section.cards-destination-container'
      ],
      'style': null,
      'blocks': [
        'cards-destination'
      ],
      'defaultContent': [
        '.section.cards-destination-container > .default-content-wrapper'
      ]
    },
    {
      'id': 'section-5',
      'name': 'services',
      'selector': [
        '.section.cards-service-container'
      ],
      'style': 'sand, centered',
      'blocks': [
        'cards-service'
      ],
      'defaultContent': [
        '.section.cards-service-container > .default-content-wrapper'
      ]
    },
    {
      'id': 'section-6',
      'name': 'testimonials',
      'selector': [
        '.section.cards-testimonial-container'
      ],
      'style': null,
      'blocks': [
        'cards-testimonial'
      ],
      'defaultContent': [
        '.section.cards-testimonial-container > .default-content-wrapper'
      ]
    },
    {
      'id': 'section-7',
      'name': 'closing-cta',
      'selector': [
        '.section.hero-cta-container'
      ],
      'style': null,
      'blocks': [
        'hero-cta'
      ],
      'defaultContent': []
    }
  ]
};

const parsers = {
  'hero-lux': heroLuxParser,
  'cards-curator': cardsCuratorParser,
  'cards-destination': cardsDestinationParser,
  'cards-service': cardsServiceParser,
  'cards-testimonial': cardsTestimonialParser,
  'hero-cta': heroCtaParser,
};
const transformers = [cleanupTransformer, sectionsTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // Read page metadata before transformers strip the head-level tags.
    const meta = WebImporter.Blocks.getMetadata(document) || {};
    const template = document.querySelector('meta[name=\'template\']');
    // lowercase key so it maps onto the page model's `template` field in AEM
    if (template && template.content) meta.template = template.content;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    if (Object.keys(meta).length > 0) {
      main.append(WebImporter.Blocks.getMetadataBlock(document, meta));
    }
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
