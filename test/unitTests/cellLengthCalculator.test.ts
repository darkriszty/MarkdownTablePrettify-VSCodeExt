import * as assert from 'assert';
import { assertExt } from "../assertExtensions";
import { CellLengthCalculator } from '../../src/cellLengthCalculator';

suite("CellLengthCalculator tests", () => {

    test("getLength() for single english character returns 1", () => {
        assert.equal(CellLengthCalculator.getLength("a"), 1);
    });

    test("getLength() for multiple english characters returns 1 for each char", () => {
        assert.equal(CellLengthCalculator.getLength("hello world! 123"), 16);
    });

    test("getLength() for simple latin characters returns 1 for each char", () => {
        assert.equal(CellLengthCalculator.getLength("ĤëļĻÕ ŴōŗľĐ! 123"), 16);
    });

    test("getLength() for single CJK character returns 2", () => {
        assert.equal(CellLengthCalculator.getLength("𠁻"), 2);
    });

    test("getLength() for CJK characters returns 2 for each char", () => {
        assert.equal(CellLengthCalculator.getLength("test - 𠁻 𣄿 𣄿 content"), 23);
    });
});