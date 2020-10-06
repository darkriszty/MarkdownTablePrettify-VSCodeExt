import * as assert from 'assert';
import { RightAlignmentMarker } from '../../../../src/viewModelFactories/alignmentMarking';

suite("RightAlignmentMarker tests", () => {

    test("mark() replaces the last character with :", () => {
        const sut = createSut();
        let results: string[] = [];

        results.push(sut.mark("ab"));
        results.push(sut.mark("123"));
        results.push(sut.mark("----------"));

        assert.strictEqual(results[0], "a:");
        assert.strictEqual(results[1], "12:");
        assert.strictEqual(results[2], "---------:");
    });

    test("mark() for a null input returns the given input", () => {
        const sut = createSut();

        const result = sut.mark(null);

        assert.strictEqual(result, null);
    });

    test("mark() for an empty input returns the given input", () => {
        const sut = createSut();

        const result = sut.mark("");

        assert.strictEqual(result, "");
    });

    test("mark() for an input length of 1 returns the given input", () => {
        const sut = createSut();

        const result = sut.mark("a");

        assert.strictEqual(result, "a");
    });

    function createSut() {
        return new RightAlignmentMarker(":");
    }
});