import { describe, test, expect } from "vitest";
import { isValidName, isValidRoomId } from "./validation";

describe("validation", () => {
    describe("isValidName", () => {
        test("accepts valid names", () => {
            expect(isValidName("Alice")).toBe(true);
            expect(isValidName("Bob123")).toBe(true);
            expect(isValidName("user_42")).toBe(true);
            expect(isValidName("ABC")).toBe(true); // Minimum 3 chars
            expect(isValidName("TenCharMax")).toBe(true); // Maximum 10 chars
        });

        test("rejects names that are too short", () => {
            expect(isValidName("ab")).toBe(false);
            expect(isValidName("a")).toBe(false);
            expect(isValidName("")).toBe(false);
        });

        test("rejects names that are too long", () => {
            expect(isValidName("ThisIsTooLong")).toBe(false);
            expect(isValidName("12345678901")).toBe(false);
        });

        test("rejects names with invalid characters", () => {
            expect(isValidName("alice-bob")).toBe(false); // Dash not allowed
            expect(isValidName("alice bob")).toBe(false); // Space not allowed
            expect(isValidName("alice.bob")).toBe(false); // Period not allowed
            expect(isValidName("alice@bob")).toBe(false); // Special chars not allowed
            expect(isValidName("alice!")).toBe(false);
        });

        test("checks length after trimming but pattern on original", () => {
            // The function checks trim().length for min length, but tests regex on original
            expect(isValidName("  Alice  ")).toBe(false); // Fails regex (spaces)
            expect(isValidName("  ab  ")).toBe(false); // Fails both trim length and regex
            expect(isValidName("abc   ")).toBe(false); // Fails regex (trailing spaces)
        });

        test("rejects non-string values", () => {
            expect(isValidName(123 as any)).toBe(false);
            expect(isValidName(null as any)).toBe(false);
            expect(isValidName(undefined as any)).toBe(false);
            expect(isValidName({} as any)).toBe(false);
        });
    });

    describe("isValidRoomId", () => {
        test("accepts valid positive integer strings", () => {
            expect(isValidRoomId("1")).toBe(true);
            expect(isValidRoomId("42")).toBe(true);
            expect(isValidRoomId("999")).toBe(true);
            expect(isValidRoomId("123456")).toBe(true);
        });

        test("rejects zero and negative numbers", () => {
            expect(isValidRoomId("0")).toBe(false);
            expect(isValidRoomId("-1")).toBe(false);
            expect(isValidRoomId("-42")).toBe(false);
        });

        test("rejects non-numeric strings", () => {
            expect(isValidRoomId("abc")).toBe(false);
            expect(isValidRoomId("")).toBe(false);
            expect(isValidRoomId("not a number")).toBe(false);
        });

        test("parseInt behavior with mixed strings", () => {
            // parseInt is lenient - parses leading digits
            expect(isValidRoomId("12abc")).toBe(true); // parseInt("12abc") = 12
            expect(isValidRoomId("42px")).toBe(true); // parseInt("42px") = 42
            expect(isValidRoomId("1.5")).toBe(true); // parseInt("1.5") = 1
            expect(isValidRoomId("42.0")).toBe(true); // parseInt("42.0") = 42
        });

        test("handles whitespace in strings", () => {
            expect(isValidRoomId(" 42 ")).toBe(true); // parseInt handles leading/trailing whitespace
            expect(isValidRoomId("4 2")).toBe(true); // parseInt("4 2") = 4
        });
    });
});
