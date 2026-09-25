import { afterEach, expect, it, vi } from 'vitest';
import { WarpedMapLayer } from '@allmaps/maplibre';
import { lonLatToWebMercator } from '@allmaps/project';

afterEach(() => vi.unstubAllGlobals());
it('keeps the warped viewport on the physical canvas center through repeated padding changes', () => {
  vi.stubGlobal('window', { devicePixelRatio: 2 });
  let padding = 0;
  const logicalCenter = { lng: -93, lat: 45 };
  const unproject = ([x, y]: number[]) => ({ lng: -93 + (x - 600 - padding / 2) / 10000, lat: 45 - (y - 400) / 10000 });
  const render = vi.fn();
  const layer = { map: { getCanvas: () => ({ width: 2400, height: 1600 }), getCenter: () => logicalCenter, unproject, getBearing: () => 0 }, renderer: { render } };
  for (padding of [0, 100, 200, 400, 300, 100, 0, 400, 0, 400, 0, 400, 0]) {
    WarpedMapLayer.prototype.render.call(layer as unknown as WarpedMapLayer);
    const viewport = render.mock.calls.at(-1)![0];
    const center = unproject([600, 400]);
    expect(viewport.projectedGeoCenter).toEqual(lonLatToWebMercator([center.lng, center.lat]));
    expect(viewport.viewportSize).toEqual([1200, 800]);
  }
});
