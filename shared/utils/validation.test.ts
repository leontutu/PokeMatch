import { describe, test, expect } from "vitest";
import { isValidName, isValidRoomId } from "./validation.js";

describe("validation", () => {
    describe("isValidName", () => {
        test("accepts valid names", () => {
            expect(isValidName("Alice")).toBe(true);
            expect(isValidName("Bob123")).toBe(true);
            expect(isValidName("user_42")).toBe(true);
            expect(isValidName("ABC")).toBe(true);
            expect(isValidName("TenCharMax")).toBe(true);
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
            expect(isValidName("alice-bob")).toBe(false);
            expect(isValidName("alice bob")).toBe(false);
            expect(isValidName("alice.bob")).toBe(false);
            expect(isValidName("alice@bob")).toBe(false);
            expect(isValidName("alice!")).toBe(false);
        });

        test("checks length after trimming but pattern on original", () => {
            expect(isValidName("  Alice  ")).toBe(false);
            expect(isValidName("  ab  ")).toBe(false);
            expect(isValidName("abc   ")).toBe(false);
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
            expect(isValidRoomId("12abc")).toBe(true);
            expect(isValidRoomId("42px")).toBe(true);
            expect(isValidRoomId("1.5")).toBe(true);
            expect(isValidRoomId("42.0")).toBe(true);
        });

        test("handles whitespace in strings", () => {
            expect(isValidRoomId(" 42 ")).toBe(true);
            expect(isValidRoomId("4 2")).toBe(true);
        });
    });
});
