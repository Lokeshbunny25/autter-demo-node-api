import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";

describe("dependency security fixes", () => {
  test("vite is pinned to the CVE-fixed version (>= 8.3.3)", () => {
    const lock = JSON.parse(
      readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"),
    ) as { packages: Record<string, { version?: string }> };
    const vite = lock.packages["node_modules/vite"];
    expect(vite, "vite entry missing from package-lock.json").toBeTruthy();
    const match = /^(\d+)\.(\d+)\.(\d+)/.exec(vite.version ?? "");
    expect(match, `unexpected vite version ${vite.version}`).not.toBeNull();
    const [, major, minor, patch] = match!;
    const numeric =
      Number(major) * 10_000 + Number(minor) * 100 + Number(patch);
    expect(numeric).toBeGreaterThanOrEqual(8 * 10_000 + 3 * 100 + 3);
  });
});
