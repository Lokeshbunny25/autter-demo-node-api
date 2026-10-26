import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";

describe("dependency security fixes", () => {
  test("zod is pinned to the CVE-fixed version (>= 4.6.6)", () => {
    const lock = JSON.parse(
      readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"),
    ) as { packages: Record<string, { version?: string }> };
    const zod = lock.packages["node_modules/zod"];
    expect(zod, "zod entry missing from package-lock.json").toBeTruthy();
    const match = /^(\d+)\.(\d+)\.(\d+)/.exec(zod.version ?? "");
    expect(match, `unexpected zod version ${zod.version}`).not.toBeNull();
    const [, major, minor, patch] = match!;
    const numeric =
      Number(major) * 10_000 + Number(minor) * 100 + Number(patch);
    expect(numeric).toBeGreaterThanOrEqual(4 * 10_000 + 6 * 100 + 6);
  });
});
