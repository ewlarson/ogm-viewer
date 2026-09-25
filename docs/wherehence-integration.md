# Wherehence integration snapshot — 2026-09-25

This branch extends the Myrdal knowledge-search work with an optional gazetteer
browse mode and search-result navigation on georeferenced maps. The ordinary
IIIF search interface remains available when `browseResults` is omitted.

## Host contract

Set these properties before attaching `<ogm-viewer>`:

- `preferGeoreferenced = true` puts the warped-map preview first.
- `searchOpen = true` opens the sidebar on wide screens.
- `browseResults` supplies the ordered result inventory (see `BrowseResult` in
  `src/lib/search-browse.ts`). The host owns category order, ranking, duplicate
  grouping, badge symbols/colors, and authority URLs. Each row retains its IIIF
  annotations; category and keyword filters update the cards and map points.

Wherehence supplies its existing category definitions and authority helpers.
The sidebar uses a point-marker tab, crop cards, source badges and repeated
occurrence disclosures. Filters combine, support empty results, and reset when
the inventory changes. Results are browsed locally after the host loads the
complete annotation inventory; keyword input in this mode does not query the
IIIF Search service on every keystroke.

## Image and geographic coordinates

Annotations retain standard IIIF text, thumbnail and pixel-selector fields.
The host also supplies `wherehence:evidence` with:

- `label` and `printedLabel`;
- `geographicPoint`: the printed label's transformed image position;
- `geographicFootprint`: a GeoJSON Polygon for the transformed context crop;
- `pointStyle`: category `color` and dot `radius` from the host's map design.

The host must transform processing-image pixels into native IIIF-image pixels
for source-image navigation. It derives geographic positions from the saved
alignment, not the matched gazetteer's coordinates. Wherehence's display
manifest includes native dimensions, a source mask and corner control points
for its persisted affine fit. Its geographic internal projection is preserved
by the Allmaps preview.

Selecting an annotation focuses its geographic crop when available, otherwise
its image selector. Geographic selections draw a cyan outline and open an
anchored popup. `contentSearchPopupRequested` provides `{ annotation, container,
dispose? }`: the host renders its existing popup into `container` and assigns
`dispose` to release it on close, filtering, or unmount. Wherehence uses its
shared React `MapEvidenceLabel`. Narrow-screen selection closes the sidebar.

## Allmaps padding correction

Pinned `@allmaps/maplibre` beta.43 computes its render viewport from MapLibre's
logical camera center. With asymmetric sidebar padding that differs from the
physical screen center, displacing the scan from basemap geometry and markers.
`scripts/fix-allmaps-padding.mjs` changes that calculation to unproject the
physical viewport center before bundling. It is idempotent and fails if the
expected upstream source changes. The regression test invokes the actual layer
renderer across repeated and intermediate padding values at device pixel ratio 2. No saved GCPs or georeferencing transforms are changed.

## Scope and validation

This is a working proof-of-concept snapshot, not a claim of universal IIIF
interoperability. The custom browse metadata and popup callback require a host
adapter. Wherehence's backend endpoints, React embedding, standard header,
shared design tokens and application data remain in the Wherehence repository.

Browser verification in Wherehence covered map switching, keyword/category
filters, crop focus, popup opening/closing and cleanup, and 40 sidebar toggles
across overview and zoomed views without raster/marker separation. Unit and
component tests cover search, browse filters, georeferenced previews and the
padding correction.
