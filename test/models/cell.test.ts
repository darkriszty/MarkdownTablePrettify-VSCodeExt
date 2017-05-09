import * as assert from 'assert';
import { Cell } from "../../src/models/cell";

suite("Cell Tests", () => {

    test("Cell.Empty returns an empty string with length 1", () => {
        const empty = Cell.Empty;

        assert.equal(empty.getValue(), " ");
        assert.equal(empty.getLength(), 1);
    });

    test("getValue() returns the value passed in the constructor", () => {
        const empty = new Cell("abcáéxJFK佚அ文 ");

        assert.equal(empty.getValue(), "abcáéxJFK佚அ文 ");
    });

    test("getLength() counts 1 for regular characters and 2 for CJK characters", () => {
        const empty = new Cell("abcáéxJFK佚அ文 ");

        assert.equal(empty.getLength(), 15);
    });
});