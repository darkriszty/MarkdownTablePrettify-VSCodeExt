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

        assert.equal(results[0], "ab");
        assert.equal(results[1], "123");
        assert.equal(results[2], "----------");
        assert.equal(results[3], "x");
        assert.equal(results[4], null);
    });

    function createSut() {
        return new NotSetAlignmentMarker();
    }
});