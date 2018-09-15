import * as assert from 'assert';
import { CenterAlignmentMarker } from '../../../../src/viewModelFactories/alignmentMarking';

suite("CenterAlignmentMarker tests", () => {

    test("mark() replaces the first and last characters with :", () => {
        const sut = createSut();
        let results: string[] = [];

        results.push(sut.mark("ab"));
        results.push(sut.mark("abc"));
        results.push(sut.mark("12345"));
        results.push(sut.mark("----------"));

        assert.equal(results[0], "::");
        assert.equal(results[1], ":b:");
        assert.equal(results[2], ":234:");
        assert.equal(results[3], ":--------:");
    });

    test("mark() for a null input returns the given input", () => {
        const sut = createSut();

        const result = sut.mark(null);

        assert.equal(result, null);
    });

    test("mark() for an empty input returns the given input", () => {
        const sut = createSut();

        const result = sut.mark("");

        assert.equal(result, "");
    });

    test("mark() for an input length of 1 returns the given input", () => {
        const sut = createSut();

        const result = sut.mark("a");

        assert.equal(result, "a");
    });

    function createSut() {
        return new CenterAlignmentMarker(":");
    }
});