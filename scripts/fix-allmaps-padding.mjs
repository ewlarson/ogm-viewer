import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Allmaps beta.43 treats MapLibre's padded camera center as the canvas center.
// Use the geographic position at the actual viewport center, including while
// sidebar padding is animated. Keep this narrow patch checked against its source.
const file = resolve(process.argv[2] || '.', 'node_modules/@allmaps/maplibre/dist/WarpedMapLayer.js');
const before = 'const geoCenterAsLngLat = this.map.getCenter();';
const after = 'const geoCenterAsLngLat = this.map.unproject([viewportSize[0] / 2, viewportSize[1] / 2]);';
const source = readFileSync(file, 'utf8');
if (!source.includes(after)) {
  if (source.split(before).length !== 2) throw new Error('Allmaps render source changed; review the viewport-center patch.');
  writeFileSync(file, source.replace(before, after));
}
