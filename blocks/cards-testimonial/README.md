# cards-testimonial

Custom **cards** block for the `lux` page template. Purpose: client testimonials.

## Authoring (Universal Editor)

Each item references one **Testimonial** Content Fragment (quote, attribution), picked from
`/content/dam/demo/testimonials`. The block loads the fragments through the
`demo/testimonial-by-path` GraphQL persisted query (author inside Universal Editor,
publish elsewhere) and makes them editable in place. Items whose fragment can't be
loaded are hidden on the site and flagged in the editor.

Styled by the `lux` template (`Template: lux` in page metadata), which supplies the fonts and `--lux-*` tokens.

## Supported variations

No variations.
