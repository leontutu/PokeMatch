import { assertIsDefined, delay } from "./utils.js";
import { test, expect } from "vitest";

test("assertIsDefined does not throw for defined values", () => {
    expect(() => assertIsDefined(42, "Value should be defined")).not.toThrow();
    expect(() => assertIsDefined("hello", "Value should be defined")).not.toThrow();
    expect(() => assertIsDefined({}, "Value should be defined")).not.toThrow();
});

test("assertIsDefined throws for null or undefined values", () => {
    expect(() => assertIsDefined(null, "Value is null")).toThrow("Value is null");
    expect(() => assertIsDefined(undefined, "Value is undefined")).toThrow("Value is undefined");
});

test("assertIsDefined handles falsy but defined values", () => {
    expect(() => assertIsDefined(0, "Zero should be valid")).not.toThrow();
    expect(() => assertIsDefined("", "Empty string should be valid")).not.toThrow();
    expect(() => assertIsDefined(false, "False should be valid")).not.toThrow();
});

test("delay resolves after specified milliseconds", async () => {
    const start = Date.now();
    await delay(20);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(20);
    expect(elapsed).toBeLessThan(100);
});
