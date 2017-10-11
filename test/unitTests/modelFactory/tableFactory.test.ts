import * as assert from 'assert';
import { IMock, Mock, It, Times } from "typemoq";
import { Alignment } from "../../../src/models/alignment";
import { TableFactory } from "../../../src/modelFactory/tableFactory";
import { AlignmentFactory } from "../../../src/modelFactory/alignmentFactory";
import { TableValidator } from "../../../src/modelFactory/tableValidator";
import { assertExt } from "../../assertExtensions";

suite("TableFactory tests", () => {
    let _alignmentFactoryMock: IMock<AlignmentFactory>;

    setup(() => {
        _alignmentFactoryMock = Mock.ofType<AlignmentFactory>();
    });

    test("getModel() removes empty rows", () => {
        const tableText = `
          
          c1 | c2 | | c4
            -|-|-|-
           a | b || d
           
           `;
        const sut = createFactory();
        _alignmentFactoryMock
            .setup(m => m.createAlignments(It.isAny()))
            .returns(() => [ Alignment. Left, Alignment.Left, Alignment.Left, Alignment.Left]);

        const rows: string[][] = sut.getModel(tableText).rows;

        assertExt.isNotNull(rows);
        assert.equal(rows.length, 2);
        assert.equal(rows.every(r => r.length == 4), true);
    });

    test("getModel() removes separator row and returns expected cells", () => {
        const tableText = 
        ` c1 | c2 | | c4
            -|-|-|-
           a | b || d`;
        const sut = createFactory();
        _alignmentFactoryMock
            .setup(m => m.createAlignments(It.isAny()))
            .returns(() => [ Alignment. Left, Alignment.Left, Alignment.Left, Alignment.Left]);
        const rows: string[][] = sut.getModel(tableText).rows;

        assertExt.isNotNull(rows);
        assert.equal(rows.length, 2);
        assert.equal(rows.every(r => r.length == 4), true);
        assert.equal(rows[0][0], " c1 ");
        assert.equal(rows[0][1], " c2 ");
        assert.equal(rows[0][2], " ");
        assert.equal(rows[0][3], " c4");
        assert.equal(rows[1][0], "           a ");
        assert.equal(rows[1][1], " b ");
        assert.equal(rows[1][2], "");
        assert.equal(rows[1][3], " d");
    });

    test("getModel() calls alignmentFactory to create alignments for the table columns", () => {
        const tableText = `
          | c1 | c2 |   | c4
          |:---|--- |:-:|-:
          | a  | b  |   | d`;
        const expectedAlignmets: Alignment[] = [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ];
        _alignmentFactoryMock
            .setup(m => m.createAlignments(It.isAny()))
            .returns(() => expectedAlignmets)
            .verifiable(Times.once());
        const sut = createFactory();

        const actualAlignments: Alignment[] = sut.getModel(tableText).alignments;
        assert.equal(actualAlignments, expectedAlignmets);
        _alignmentFactoryMock.verifyAll();
    });

    function createFactory(): TableFactory {
        return new TableFactory(_alignmentFactoryMock.object);
    }
});