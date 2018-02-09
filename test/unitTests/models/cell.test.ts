import * as assert from 'assert';
import { Cell } from '../../../src/models/cell';

suite("Cell tests", () => {

    test("getValue() returns value given in constructors", () => {
        assert.equal(new Cell("test - 𠁻 𣄿 𣄿 content").getValue(), "test - 𠁻 𣄿 𣄿 content");
    });

    test("getLength() for empty cell returns 0", () => {
        assert.equal(new Cell("").getLength(), 0);
    });

    test("getLength() for 3 spaces returns 3", () => {
        assert.equal(new Cell("   ").getLength(), 3);
    });

    test("getLength() for single english character returns 1", () => {
        assert.equal(new Cell("a").getLength(), 1);
    });

    test("getLength() for multiple english characters returns 1 for each char", () => {
        assert.equal(new Cell("hello world! 123").getLength(), 16);
    });

    test("getLength() for simple latin characters returns 1 for each char", () => {
        assert.equal(new Cell("ĤëļĻÕ ŴōŗľĐ! 123").getLength(), 16);
    });

    test("getLength() for single CJK character returns 2", () => {
        assert.equal(new Cell("𠁻").getLength(), 2);
    });

    test("getLength() for CJK characters returns 2 for each char", () => {
        assert.equal(new Cell("test - 𠁻 𣄿 𣄿 content").getLength(), 23);
    });
});