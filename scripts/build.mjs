import { build as esbuild } from "esbuild";
import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const publicDir = path.join(rootDir, "public");
const publicDistDir = path.join(publicDir, "dist");

await rm(publicDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await mkdir(publicDistDir, { recursive: true });

await esbuild({
  entryPoints: [path.join(rootDir, "speed-insights.js")],
  bundle: true,
  outfile: path.join(distDir, "speed-insights.min.js"),
  format: "iife",
  minify: true,
});

await cp(path.join(rootDir, "index.html"), path.join(publicDir, "index.html"));

const files = await readdir(rootDir, { withFileTypes: true });
for (const file of files) {
  if (file.isFile() && file.name.endsWith(".apk")) {
    await cp(path.join(rootDir, file.name), path.join(publicDir, file.name));
  }
}

await cp(distDir, publicDistDir, { recursive: true });
