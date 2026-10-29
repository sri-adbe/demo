# cards-destination

Custom **cards** block for the `lux` page template. Purpose: featured destinations.

## Authoring (Universal Editor)

Each item references one **Destination** Content Fragment (country, name, description, image, imageAlt), picked from
`/content/dam/demo/destinations`. The block loads the fragments through the
`demo/destination-by-path` GraphQL persisted query (author inside Universal Editor,
publish elsewhere) and makes them editable in place. Items whose fragment can't be
loaded are hidden on the site and flagged in the editor.

Styled by the `lux` template (`Template: lux` in page metadata), which supplies the fonts and `--lux-*` tokens.

## Supported variations

No variations.
