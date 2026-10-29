/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-lux-travel.js
  var import_lux_travel_exports = {};
  __export(import_lux_travel_exports, {
    default: () => import_lux_travel_default
  });

  // tools/importer/parsers/hero-lux.js
  function parse(element, { document: document2 }) {
    const cells = [];
    const img = element.querySelector(".hero-lux-image img, img");
    const imageFrag = document2.createDocumentFragment();
    if (img) {
      imageFrag.appendChild(document2.createComment(" field:image "));
      imageFrag.appendChild(img.closest("picture") || img);
    }
    cells.push([imageFrag]);
    const content = element.querySelector(".hero-lux-content");
    const textFrag = document2.createDocumentFragment();
    const nodes = content ? [...content.children].filter((el) => el.textContent.trim() || el.querySelector("img")) : [];
    if (nodes.length) {
      textFrag.appendChild(document2.createComment(" field:text "));
      nodes.forEach((n) => textFrag.appendChild(n));
    }
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-lux", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-curator.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    const items = [...element.querySelectorAll(":scope > ul > li")];
    items.forEach((li) => {
      const img = li.querySelector(".cards-curator-card-image img");
      const body = li.querySelector(".cards-curator-card-body");
      const imageFrag = document2.createDocumentFragment();
      if (img) {
        imageFrag.appendChild(document2.createComment(" field:image "));
        imageFrag.appendChild(img.closest("picture") || img);
      }
      const textFrag = document2.createDocumentFragment();
      const nodes = body ? [...body.children].filter((el) => el.textContent.trim()) : [];
      if (nodes.length) {
        textFrag.appendChild(document2.createComment(" field:text "));
        nodes.forEach((n) => textFrag.appendChild(n));
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-curator", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-destination.js
  var FRAGMENT_ROOT = "/content/dam/demo/destinations";
  var slugify = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  function parse3(element, { document: document2 }) {
    const cells = [];
    const items = [...element.querySelectorAll(":scope > ul > li")];
    items.forEach((li) => {
      const name = li.querySelector(".cards-destination-card-body h2, .cards-destination-card-body h3, .cards-destination-card-body h4");
      if (!name || !name.textContent.trim()) return;
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(" field:fragment "));
      const p = document2.createElement("p");
      p.textContent = `${FRAGMENT_ROOT}/${slugify(name.textContent.trim())}`;
      frag.appendChild(p);
      cells.push([frag]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-destination", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-service.js
  function parse4(element, { document: document2 }) {
    const cells = [];
    const items = [...element.querySelectorAll(":scope > ul > li")];
    items.forEach((li) => {
      const body = li.querySelector(".cards-service-card-body");
      const textFrag = document2.createDocumentFragment();
      const nodes = body ? [...body.children].filter((el) => !el.classList.contains("cards-service-arrow") && el.textContent.trim()) : [];
      if (nodes.length) {
        textFrag.appendChild(document2.createComment(" field:text "));
        nodes.forEach((n) => textFrag.appendChild(n));
      }
      cells.push([textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-service", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-testimonial.js
  var FRAGMENT_ROOT2 = "/content/dam/demo/testimonials";
  var slugify2 = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  function parse5(element, { document: document2 }) {
    const cells = [];
    const items = [...element.querySelectorAll(":scope > ul > li")];
    items.forEach((li) => {
      const body = li.querySelector(".cards-testimonial-card-body");
      const paragraphs = body ? [...body.querySelectorAll("p")].filter((p2) => p2.textContent.trim()) : [];
      if (!paragraphs.length) return;
      const attribution = paragraphs[paragraphs.length - 1].textContent.replace(/^[\s—–-]+/, "").trim();
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(" field:fragment "));
      const p = document2.createElement("p");
      p.textContent = `${FRAGMENT_ROOT2}/${slugify2(attribution)}`;
      frag.appendChild(p);
      cells.push([frag]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta.js
  function parse6(element, { document: document2 }) {
    const cells = [];
    const img = element.querySelector(".hero-cta-image img, img");
    const imageFrag = document2.createDocumentFragment();
    if (img) {
      imageFrag.appendChild(document2.createComment(" field:image "));
      imageFrag.appendChild(img.closest("picture") || img);
    }
    cells.push([imageFrag]);
    const content = element.querySelector(".hero-cta-content");
    const textFrag = document2.createDocumentFragment();
    const nodes = content ? [...content.children].filter((el) => el.textContent.trim() || el.querySelector("img")) : [];
    if (nodes.length) {
      textFrag.appendChild(document2.createComment(" field:text "));
      nodes.forEach((n) => textFrag.appendChild(n));
    }
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/lux-travel-cleanup.js
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      WebImporter.DOMUtils.remove(element, [
        "header.header-wrapper",
        "footer.footer-wrapper",
        "nav#nav",
        ".nav-wrapper"
      ]);
      element.querySelectorAll("main > div.section, div.section").forEach((section) => {
        if (!section.textContent.trim() && !section.querySelector("img, picture, video, iframe")) {
          section.remove();
        }
      });
      element.querySelectorAll("picture > source, picture source").forEach((source) => {
        if (!source.getAttribute("srcset")) {
          while (source.firstChild) source.parentNode.insertBefore(source.firstChild, source);
          source.remove();
        }
      });
      element.querySelectorAll('img[src*="/media_"]').forEach((img) => {
        img.setAttribute("src", img.getAttribute("src").split("?")[0]);
      });
    }
    if (hookName === "afterTransform") {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        "script",
        "style",
        "noscript",
        "link",
        'iframe[src*="tracking"]'
      ]);
      element.querySelectorAll("[data-block-status], [data-section-status], [data-block-name]").forEach((el) => {
        el.removeAttribute("data-block-status");
        el.removeAttribute("data-section-status");
        el.removeAttribute("data-block-name");
      });
    }
  }

  // tools/importer/transformers/lux-travel-sections.js
  var MARKER_ATTR = "data-excat-section-id";
  function findSection(root, section) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const template = payload && payload.template;
    const sections = template && template.sections || [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument || document;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = findSection(element, section);
        if (!el) continue;
        if (i === 0 && !section.style) continue;
        const hr = doc.createElement("hr");
        if (section.style) hr.setAttribute(MARKER_ATTR, section.id);
        el.parentNode.insertBefore(hr, el);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`hr[${MARKER_ATTR}="${section.id}"]`);
        const metadata = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (marker) {
          let next = marker.nextElementSibling;
          let last = marker;
          while (next && next.tagName !== "HR") {
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
      element.querySelectorAll(`hr[${MARKER_ATTR}]`).forEach((hr) => hr.removeAttribute(MARKER_ATTR));
    }
  }

  // tools/importer/import-lux-travel.js
  var PAGE_TEMPLATE = {
    "name": "lux-travel",
    "urls": [
      "https://aem-20261026-1355--aaa-test--sri-adbe.aem.live/lux-travel"
    ],
    "representativeUrl": "https://aem-20261026-1355--aaa-test--sri-adbe.aem.live/lux-travel",
    "description": "Lux Travel landing page: photo hero, curator cards, destination cards, service cards, testimonials and closing CTA",
    "blocks": [
      {
        "name": "hero-lux",
        "instances": [
          ".hero-lux.block",
          "div.hero-lux"
        ]
      },
      {
        "name": "cards-curator",
        "instances": [
          ".cards-curator.block",
          "div.cards-curator"
        ]
      },
      {
        "name": "cards-destination",
        "instances": [
          ".cards-destination.block",
          "div.cards-destination"
        ]
      },
      {
        "name": "cards-service",
        "instances": [
          ".cards-service.block",
          "div.cards-service"
        ]
      },
      {
        "name": "cards-testimonial",
        "instances": [
          ".cards-testimonial.block",
          "div.cards-testimonial"
        ]
      },
      {
        "name": "hero-cta",
        "instances": [
          ".hero-cta.block",
          "div.hero-cta"
        ]
      }
    ],
    "urlPattern": "/*",
    "sections": [
      {
        "id": "section-1",
        "name": "hero",
        "selector": [
          ".section.hero-lux-container"
        ],
        "style": null,
        "blocks": [
          "hero-lux"
        ],
        "defaultContent": []
      },
      {
        "id": "section-2",
        "name": "curators",
        "selector": [
          ".section.cards-curator-container"
        ],
        "style": "sand",
        "blocks": [
          "cards-curator"
        ],
        "defaultContent": [
          ".section.cards-curator-container > .default-content-wrapper"
        ]
      },
      {
        "id": "section-3",
        "name": "divider",
        "selector": [
          ".section.divider"
        ],
        "style": "sand, divider",
        "blocks": [],
        "defaultContent": [
          ".section.divider > .default-content-wrapper"
        ]
      },
      {
        "id": "section-4",
        "name": "destinations",
        "selector": [
          ".section.cards-destination-container"
        ],
        "style": null,
        "blocks": [
          "cards-destination"
        ],
        "defaultContent": [
          ".section.cards-destination-container > .default-content-wrapper"
        ]
      },
      {
        "id": "section-5",
        "name": "services",
        "selector": [
          ".section.cards-service-container"
        ],
        "style": "sand, centered",
        "blocks": [
          "cards-service"
        ],
        "defaultContent": [
          ".section.cards-service-container > .default-content-wrapper"
        ]
      },
      {
        "id": "section-6",
        "name": "testimonials",
        "selector": [
          ".section.cards-testimonial-container"
        ],
        "style": null,
        "blocks": [
          "cards-testimonial"
        ],
        "defaultContent": [
          ".section.cards-testimonial-container > .default-content-wrapper"
        ]
      },
      {
        "id": "section-7",
        "name": "closing-cta",
        "selector": [
          ".section.hero-cta-container"
        ],
        "style": null,
        "blocks": [
          "hero-cta"
        ],
        "defaultContent": []
      }
    ]
  };
  var parsers = {
    "hero-lux": parse,
    "cards-curator": parse2,
    "cards-destination": parse3,
    "cards-service": parse4,
    "cards-testimonial": parse5,
    "hero-cta": parse6
  };
  var transformers = [transform, transform2];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        document2.querySelectorAll(selector).forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
    });
    return pageBlocks;
  }
  var import_lux_travel_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      const meta = WebImporter.Blocks.getMetadata(document2) || {};
      const template = document2.querySelector("meta[name='template']");
      if (template && template.content) meta.Template = template.content;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document: document2, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document2.createElement("hr"));
      if (Object.keys(meta).length > 0) {
        main.append(WebImporter.Blocks.getMetadataBlock(document2, meta));
      }
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document2.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }];
    }
  };
  return __toCommonJS(import_lux_travel_exports);
})();
