#!/usr/bin/env node
/**
 * Validates Tauri icon requirements:
 * - Required files exist (per tauri.conf.json bundle.icon)
 * - All PNG icons use RGBA (PNG color type 6)
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(__dirname, "..");
const iconsDir = join(appRoot, "src-tauri", "icons");
const confPath = join(appRoot, "src-tauri", "tauri.conf.json");

const conf = JSON.parse(readFileSync(confPath, "utf8"));
const requiredIcons = conf.bundle?.icon ?? [];

const PNG_COLOR_RGBA = 6;

function pngColorType(filePath) {
  const buf = readFileSync(filePath);
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  for (let i = 0; i < sig.length; i++) {
    if (buf[i] !== sig[i]) return null;
  }
  // IHDR color type byte at offset 25
  if (buf.length < 26) return null;
  return buf[25];
}

let failed = false;

for (const rel of requiredIcons) {
  const path = join(appRoot, "src-tauri", rel);
  if (!existsSync(path)) {
    console.error(`MISSING: ${rel}`);
    failed = true;
    continue;
  }

  if (rel.endsWith(".png")) {
    const colorType = pngColorType(path);
    if (colorType !== PNG_COLOR_RGBA) {
      console.error(
        `INVALID: ${rel} — expected PNG RGBA (color type 6), got ${colorType ?? "unknown"}`
      );
      failed = true;
    } else {
      console.log(`OK: ${rel} (RGBA)`);
    }
  } else {
    console.log(`OK: ${rel} (exists)`);
  }
}

// Also validate any other PNG in icons/ (catches regressions on generated assets)
import { readdirSync, statSync } from "node:fs";

function walkPngs(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walkPngs(full));
    } else if (entry.endsWith(".png")) {
      results.push(full);
    }
  }
  return results;
}

for (const png of walkPngs(iconsDir)) {
  const rel = png.slice(iconsDir.length + 1);
  const colorType = pngColorType(png);
  if (colorType !== PNG_COLOR_RGBA) {
    console.error(
      `INVALID: icons/${rel} — expected PNG RGBA (color type 6), got ${colorType ?? "unknown"}`
    );
    failed = true;
  }
}

if (failed) {
  console.error("\nTauri icon validation failed.");
  process.exit(1);
}

console.log("\nAll Tauri icons validated successfully.");
