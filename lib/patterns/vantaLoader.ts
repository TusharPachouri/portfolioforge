// Effects that use p5.js instead of THREE.js
const P5_EFFECTS = new Set(["trunk", "topology"]);

const importers: Record<string, () => Promise<{ default: (opts: object) => { destroy: () => void } }>> = {
  birds:    () => import("vanta/dist/vanta.birds.min"),
  fog:      () => import("vanta/dist/vanta.fog.min"),
  waves:    () => import("vanta/dist/vanta.waves.min"),
  clouds:   () => import("vanta/dist/vanta.clouds.min"),
  clouds2:  () => import("vanta/dist/vanta.clouds2.min"),
  globe:    () => import("vanta/dist/vanta.globe.min"),
  net:      () => import("vanta/dist/vanta.net.min"),
  cells:    () => import("vanta/dist/vanta.cells.min"),
  trunk:    () => import("vanta/dist/vanta.trunk.min"),
  topology: () => import("vanta/dist/vanta.topology.min"),
  dots:     () => import("vanta/dist/vanta.dots.min"),
  rings:    () => import("vanta/dist/vanta.rings.min"),
  halo:     () => import("vanta/dist/vanta.halo.min"),
};

export async function mountVanta(
  el: HTMLElement,
  effect: string,
  config: Record<string, unknown>,
): Promise<{ destroy: () => void } | null> {
  const importer = importers[effect];
  if (!importer) return null;

  const VANTA = await importer();

  if (P5_EFFECTS.has(effect)) {
    const p5 = (await import("p5")).default;
    return VANTA.default({ el, p5, ...config });
  }

  const THREE = await import("three");
  return VANTA.default({ el, THREE, ...config });
}
