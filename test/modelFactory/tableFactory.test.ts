import * as assert from 'assert';
import { IMock, Mock, It, Times } from "typemoq";
import { Alignment } from "../../src/models/alignment";
import { TableFactory } from "../../src/modelFactory/tableFactory";
import { AlignmentFactory } from "../../src/modelFactory/alignmentFactory";
import { TableValidator } from "../../src/modelFactory/tableValidator";
import { assertExt } from "../assertExtensions";

suite("TableFactory tests", () => {
    let _validatorMock: IMock<TableValidator>;
    let _alignmentFactoryMock: IMock<AlignmentFactory>;

    setup(() => {
        _validatorMock = Mock.ofType<TableValidator>();
        _alignmentFactoryMock = Mock.ofType<AlignmentFactory>();
    });

    test("getModel() with invalid table throws error and calls validator", () => {
        const tableText = "invalid";
        _validatorMock.setup(m => m.isValid(It.isAny(), true)).returns(() => false).verifiable(Times.once());
        const sut = createFactory();

        assert.throws(() => sut.getModel(tableText))
        _validatorMock.verifyAll();
    });

    test("getModel() removes empty rows", () => {
        const tableText = `
          
          c1 | c2 | | c4
            -|-|-|-
           a | b || d
           
           `;
        _validatorMock.setup(m => m.isValid(It.isAny(), true)).returns(() => true).verifiable(Times.once());
        const sut = createFactory();

        const rows: string[][] = sut.getModel(tableText).rows;

        assertExt.isNotNull(rows);
        assert.equal(rows.length, 2);
        assert.equal(rows.every(r => r.length == 4), true);
        _validatorMock.verifyAll();
    });

    test("getModel() removes separator row and returns expected cells", () => {
        const tableText = 
        ` c1 | c2 | | c4
            -|-|-|-
           a | b || d`;
        _validatorMock.setup(m => m.isValid(It.isAny(), true)).returns(() => true).verifiable(Times.once());
        const sut = createFactory();

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
        _validatorMock.verifyAll();
    });

    test("getModel() calls alignmentFactory to create alignments for the table columns", () => {
        const tableText = `
          | c1 | c2 |   | c4
          |:---|--- |:-:|-:
          | a  | b  |   | d`;
        const expectedAlignmets: Alignment[] = [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ];
        _validatorMock.setup(m => m.isValid(It.isAny(), true)).returns(() => true);
        _alignmentFactoryMock.setup(m => m.createAlignments(It.isAny())).returns(() => expectedAlignmets).verifiable(Times.once());
        const sut = createFactory();

        const alignments: Alignment[] = sut.getModel(tableText).alignments;
        assert.equal(alignments, expectedAlignmets);
        _alignmentFactoryMock.verifyAll();
    });

    function createFactory(): TableFactory {
        return new TableFactory(_validatorMock.object, _alignmentFactoryMock.object);
    }
});