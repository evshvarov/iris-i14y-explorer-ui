// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isIrisBuild = process.env.IRIS_BUILD === "true";
const assetBase = isIrisBuild ? "/i14y-explorer-ui/" : "/";

export default defineConfig({
  nitro: isIrisBuild ? false : undefined,
  vite: {
    base: assetBase,
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    router: {
      basepath: assetBase,
    },
    spa: {
      enabled: isIrisBuild,
      maskPath: assetBase,
      prerender: {
        outputPath: "/index",
      },
    },
  },
});
