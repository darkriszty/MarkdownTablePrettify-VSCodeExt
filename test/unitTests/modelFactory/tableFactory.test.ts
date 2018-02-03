import * as assert from 'assert';
import { IMock, Mock, It, Times } from "typemoq";
import { Alignment } from "../../../src/models/alignment";
import { TableFactory } from "../../../src/modelFactory/tableFactory";
import { AlignmentFactory } from "../../../src/modelFactory/alignmentFactory";
import { TableValidator } from "../../../src/modelFactory/tableValidator";
import { assertExt } from "../../assertExtensions";
import { Transformer } from '../../../src/modelFactory/transformers/transformer';
import { SelectionInterpreter } from '../../../src/modelFactory/selectionInterpreter';
import { Table } from '../../../src/models/table';

suite("TableFactory tests", () => {
    let _alignmentFactoryMock: IMock<AlignmentFactory>;
    let _transformer: IMock<Transformer>;

    setup(() => {
        _alignmentFactoryMock = Mock.ofType<AlignmentFactory>();
        _transformer = Mock.ofType<Transformer>();
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
        _transformer.setup(_ => _.process(It.isAny())).returns((input) => input);
        
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
        _transformer.setup(_ => _.process(It.isAny())).returns((input) => input);
        
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
        _transformer.setup(_ => _.process(It.isAny())).returns((input) => input);
        const sut = createFactory();

        const actualAlignments: Alignment[] = sut.getModel(tableText).alignments;
        assert.equal(expectedAlignmets.length == actualAlignments.length && expectedAlignmets.every((l,i) => l === actualAlignments[i]), true);
        _alignmentFactoryMock.verifyAll();
    });

    test("getModel() calls transformer and returns its result", () => {
        const tableText = `
           c1 | c2 |   | c4
          :---|--- |:-:|-:
           a  | b  |   | d`;
        const expectedAlignmets: Alignment[] = [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ];
        const transformedTable = new Table([["c1", "c2", "", "c4"], ["a", "b", "", "d"]], expectedAlignmets);
        _alignmentFactoryMock.setup(m => m.createAlignments(It.isAny())).returns(() => expectedAlignmets);
        _transformer.setup(_ => _.process(It.isAny())).returns(() => transformedTable);
        const sut = createFactory();

        const result = sut.getModel(tableText);

        _transformer.verify(_ => _.process(It.isAny()), Times.once());
        assert.equal(result, transformedTable);
    });

    function createFactory(): TableFactory {
        return new TableFactory(_alignmentFactoryMock.object, new SelectionInterpreter(), _transformer.object);
    }
});