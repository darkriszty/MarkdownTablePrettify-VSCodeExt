import * as assert from 'assert';
import { AlignmentFactory } from "../../../src/modelFactory/alignmentFactory";
import { Alignment } from "../../../src/models/alignment";

suite("AlignmentFactory tests", () => {

    test("createAlignments() with null throws error", () => {
        const separatorCells = null;
        const sut = createFactory();

        assert.throws(() => sut.createAlignments(separatorCells))
    });

    test("createAlignments() with separators without alignment defaults to NotSet alignment", () => {
        const separatorCells: string[] = ["---", "--", "-------"];
        const sut = createFactory();

        const alignments = sut.createAlignments(separatorCells);
        assert.strictEqual(alignments.length, 3);
        assert.strictEqual(alignments[0], Alignment.NotSet);
        assert.strictEqual(alignments[1], Alignment.NotSet);
        assert.strictEqual(alignments[2], Alignment.NotSet);
    });

    test("createAlignments() with separators having mixed alignments returns expected alignments", () => {
        const separatorCells: string[] = [":---:", ":-", ":---", "----", "-:", ":-:"];
        const sut = createFactory();

        const alignments = sut.createAlignments(separatorCells);
        assert.strictEqual(alignments.length, 6);
        assert.strictEqual(alignments[0], Alignment.Center);
        assert.strictEqual(alignments[1], Alignment.Left);
        assert.strictEqual(alignments[2], Alignment.Left);
        assert.strictEqual(alignments[3], Alignment.NotSet);
        assert.strictEqual(alignments[4], Alignment.Right);
        assert.strictEqual(alignments[5], Alignment.Center);
    });

    function createFactory(): AlignmentFactory {
        return new AlignmentFactory();
    }
});