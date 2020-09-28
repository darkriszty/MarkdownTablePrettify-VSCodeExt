import * as assert from 'assert';
import { NotSetAlignmentMarker } from '../../../../src/viewModelFactories/alignmentMarking';

suite("NotSetAlignmentMarker tests", () => {

    test("mark() returns the given input", () => {
        const sut = createSut();
        let results: string[] = [];

        results.push(sut.mark("ab"));
        results.push(sut.mark("123"));
        results.push(sut.mark("----------"));
        results.push(sut.mark("x"));
        results.push(sut.mark(null));

        assert.strictEqual(results[0], "ab");
        assert.strictEqual(results[1], "123");
        assert.strictEqual(results[2], "----------");
        assert.strictEqual(results[3], "x");
        assert.strictEqual(results[4], null);
    });

    function createSut() {
        return new NotSetAlignmentMarker();
    }
});