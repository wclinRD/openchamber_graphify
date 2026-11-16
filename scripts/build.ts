// Builds the two committed bundles. OpenChamber installs this package from
// Git without building it, so status/main.js and service/main.js are checked in.
import { writeFile } from "node:fs/promises";
import { resolve, relative } from "node:path";

const pkgRoot = process.cwd();

const targets = [
  // Sandboxed iframes cannot load ES modules: one classic IIFE each.
  { entry: "status/main.ts", out: "status/main.js", node: false },
  { entry: "panel/main.ts", out: "panel/main.js", node: false },
  // The service runs under Node; built-ins stay external.
  { entry: "service/main.ts", out: "service/main.js", node: true },
];

let success = true;

for (const target of targets) {
  const entryPath = resolve(pkgRoot, target.entry);
  const outPath = resolve(pkgRoot, target.out);

  console.log(`Building ${target.entry} -> ${relative(pkgRoot, outPath)}`);
  const buildOutput = await Bun.build({
    entrypoints: [entryPath],
    format: target.node ? "esm" : "iife",
    target: target.node ? "node" : "browser",
    minify: !target.node,
  });

  const artifact = buildOutput.outputs[0];
  if (!buildOutput.success || !artifact) {
    console.error(buildOutput.logs.map((l) => l.message).join("\n") || `Build failed: ${target.entry}`);
    success = false;
  } else {
    await writeFile(outPath, new TextEncoder().encode(await artifact.text()));
    console.log(`  ${relative(pkgRoot, outPath)} ${(artifact.size / 1024).toFixed(1)} KB`);
  }
}

if (!success) process.exit(1);
