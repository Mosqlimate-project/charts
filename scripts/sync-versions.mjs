import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+/.test(version)) {
  console.error("Usage: node scripts/sync-versions.mjs <semver>");
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const targets = [join(root, "package.json")];

for (const dir of readdirSync(join(root, "packages"))) {
  const file = join(root, "packages", dir, "package.json");
  if (existsSync(file)) targets.push(file);
}

for (const file of targets) {
  const pkg = JSON.parse(readFileSync(file, "utf8"));
  pkg.version = version;
  writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`${file.replace(`${root}/`, "")} -> ${version}`);
}
