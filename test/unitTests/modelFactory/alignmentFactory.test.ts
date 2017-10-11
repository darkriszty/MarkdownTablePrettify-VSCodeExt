import * as assert from 'assert';
import { assertExt } from "../../assertExtensions";
import { AlignmentFactory } from "../../../src/modelFactory/alignmentFactory";
import { Alignment } from "../../../src/models/alignment";

suite("AlignmentFactory tests", () => {

    test("createAlignments() with null throws error", () => {
        const separatorCells = null;
        const sut = createFactory();

        assert.throws(() => sut.createAlignments(separatorCells))
    });

    test("createAlignments() with separators without alignment defaults to left alignment", () => {
        const separatorCells: string[] = ["---", "--", "-------"];
        const sut = createFactory();

        const alignments = sut.createAlignments(separatorCells);
        assert.equal(alignments.length, 3);
        assert.equal(alignments[0], Alignment.Left);
        assert.equal(alignments[1], Alignment.Left);
        assert.equal(alignments[2], Alignment.Left);
    });

    test("createAlignments() with separators having mixed alignments returns expected alignments", () => {
        const separatorCells: string[] = [":---:", ":-", ":---", "----", "-:", ":-:"];
        const sut = createFactory();

        const alignments = sut.createAlignments(separatorCells);
        assert.equal(alignments.length, 6);
        assert.equal(alignments[0], Alignment.Center);
        assert.equal(alignments[1], Alignment.Left);
        assert.equal(alignments[2], Alignment.Left);
        assert.equal(alignments[3], Alignment.Left);
        assert.equal(alignments[4], Alignment.Right);
        assert.equal(alignments[5], Alignment.Center);
    });

    function createFactory(): AlignmentFactory {
        return new AlignmentFactory();
    }
});