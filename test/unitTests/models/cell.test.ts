import * as assert from 'assert';
import { Cell } from '../../../src/models/cell';

suite("Cell tests", () => {

    test("getValue() returns value given in constructors", () => {
        assert.strictEqual(new Cell("test - 𠁻 𣄿 𣄿 content").getValue(), "test - 𠁻 𣄿 𣄿 content");
    });

    test("getLength() for empty cell returns 0", () => {
        assert.strictEqual(new Cell("").getLength(), 0);
    });

    test("getLength() for 3 spaces returns 3", () => {
        assert.strictEqual(new Cell("   ").getLength(), 3);
    });

    test("getLength() for single english character returns 1", () => {
        assert.strictEqual(new Cell("a").getLength(), 1);
    });

    test("getLength() for multiple english characters returns 1 for each char", () => {
        assert.strictEqual(new Cell("hello world! 123").getLength(), 16);
    });

    test("getLength() for simple latin characters returns 1 for each char", () => {
        assert.strictEqual(new Cell("ĤëļĻÕ ŴōŗľĐ! 123").getLength(), 16);
    });

    test("getLength() for single CJK character returns 2", () => {
        assert.strictEqual(new Cell("𠁻").getLength(), 2);
    });

    test("getLength() for CJK characters returns 2 for each char", () => {
        assert.strictEqual(new Cell("test - 𠁻 𣄿 𣄿 content").getLength(), 23);
    });

    test("getLength() for specific CJK characters 1", () => {
        assert.strictEqual(new Cell("模組").getLength(), 4);
    });

    test("getLength() for specific CJK characters 2", () => {
        assert.strictEqual(new Cell("模具設計").getLength(), 8);
    });

    test("getLength() for specific CJK characters 3", () => {
        assert.strictEqual(new Cell("零件加工").getLength(), 8);
    });

    test("getLength() for zero-width space returns 0", () => {
        assert.strictEqual(new Cell("\u200B").getLength(), 0);
    });

    test("getLength() for text with zero-width space excludes it from length", () => {
        assert.strictEqual(new Cell("@\alice").getLength(), 6);
    });

    test("getLength() for text with zero-width joiner excludes it from length", () => {
        assert.strictEqual(new Cell("a\u200Db").getLength(), 2);
    });

    test("getLength() for single-codepoint BMP emoji with emoji presentation returns 2", () => {
        assert.strictEqual(new Cell("✅").getLength(), 2);
    });

    test("getLength() for emoji with variation selector 16 returns 2", () => {
        assert.strictEqual(new Cell("⚠\uFE0F").getLength(), 2);
    });

    test("getLength() for emoji without variation selector 16 returns 1", () => {
        assert.strictEqual(new Cell("⚠").getLength(), 1);
    });

    test("getLength() for multiple emoji returns 2 for each emoji", () => {
        assert.strictEqual(new Cell("✅⚠\uFE0F").getLength(), 4);
    });

    test("getLength() for astral emoji returns 2", () => {
        assert.strictEqual(new Cell("🚀").getLength(), 2);
    });

    test("getLength() for emoji ZWJ sequence returns 2", () => {
        assert.strictEqual(new Cell("👨\u200D👩\u200D👧").getLength(), 2);
    });

    test("getLength() for text mixed with emoji counts each emoji as 2", () => {
        assert.strictEqual(new Cell("ok ✅").getLength(), 5);
    });

    test("getLength() for text-presentation symbol without emoji presentation returns 1", () => {
        assert.strictEqual(new Cell("✓").getLength(), 1);
    });

    test("getLength() for flag emoji returns 2", () => {
        assert.strictEqual(new Cell("🇿🇦").getLength(), 2);
    });

    test("getLength() for keycap emoji returns 2", () => {
        assert.strictEqual(new Cell("1\uFE0F\u20E3").getLength(), 2);
    });

    test("getLength() for emoji with skin tone modifier returns 2", () => {
        assert.strictEqual(new Cell("👍🏽").getLength(), 2);
    });

    test("getLength() for CJK characters next to emoji returns 2 for each", () => {
        assert.strictEqual(new Cell("模✅組").getLength(), 6);
    });

    test("getLength() for digits and symbols that are not emoji returns 1 for each", () => {
        assert.strictEqual(new Cell("1#*©").getLength(), 4);
    });
});