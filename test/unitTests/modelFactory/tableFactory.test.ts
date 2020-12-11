import * as assert from 'assert';
import { IMock, Mock, It, Times } from "typemoq";
import { Alignment } from "../../../src/models/alignment";
import { TableFactory } from "../../../src/modelFactory/tableFactory";
import { AlignmentFactory } from "../../../src/modelFactory/alignmentFactory";
import { assertExt } from "../../assertExtensions";
import { Transformer } from '../../../src/modelFactory/transformers/transformer';
import { SelectionInterpreter } from '../../../src/modelFactory/selectionInterpreter';
import { TableIndentationDetector } from '../../../src/modelFactory/tableIndentationDetector';
import { Table } from '../../../src/models/table';
import { Cell } from '../../../src/models/cell';
import { Document } from '../../../src/models/doc/document';
import { Row } from '../../../src/models/row';
import { Range } from '../../../src/models/doc/range';

suite("TableFactory tests", () => {
    let _alignmentFactoryMock: IMock<AlignmentFactory>;
    let _transformer: IMock<Transformer>;
    let _tableIndentationDetector: IMock<TableIndentationDetector>;

    setup(() => {
        _alignmentFactoryMock = Mock.ofType<AlignmentFactory>();
        _transformer = Mock.ofType<Transformer>();
        _tableIndentationDetector = Mock.ofType<TableIndentationDetector>();
    });

    test("getModel() removes empty rows", () => {
        const tableText = `
          
          c1 | c2 | | c4
            -|-|-|-
           a | b || d
           
           `;
        const document = new Document(tableText);
        const sut = createFactory();
        _alignmentFactoryMock
            .setup(m => m.createAlignments(It.isAny()))
            .returns(() => [ Alignment. Left, Alignment.Left, Alignment.Left, Alignment.Left]);
        _transformer.setup(_ => _.process(It.isAny())).returns((input) => input);

        const rows: Row[] = sut.getModel(document, new Range(2, 4)).rows;

        assertExt.isNotNull(rows);
        assert.strictEqual(rows.length, 2);
        assert.strictEqual(rows.every(r => r.cells.length == 4), true);
    });

    test("getModel() removes separator row and returns expected cells", () => {
        const tableText = 
        ` c1 | c2 | | c4
            -|-|-|-
           a | b || d`;
        const document = new Document(tableText);
        const sut = createFactory();
        _alignmentFactoryMock
            .setup(m => m.createAlignments(It.isAny()))
            .returns(() => [ Alignment. Left, Alignment.Left, Alignment.Left, Alignment.Left]);
        _transformer.setup(_ => _.process(It.isAny())).returns((input) => input);

        const rows: Row[] = sut.getModel(document, document.fullRange).rows;

        assertExt.isNotNull(rows);
        assert.strictEqual(rows.length, 2);
        assert.strictEqual(rows.every(r => r.cells.length == 4), true);
        assert.strictEqual(rows[0].cells[0].getValue(), " c1 ");
        assert.strictEqual(rows[0].cells[1].getValue(), " c2 ");
        assert.strictEqual(rows[0].cells[2].getValue(), " ");
        assert.strictEqual(rows[0].cells[3].getValue(), " c4");
        assert.strictEqual(rows[1].cells[0].getValue(), "           a ");
        assert.strictEqual(rows[1].cells[1].getValue(), " b ");
        assert.strictEqual(rows[1].cells[2].getValue(), "");
        assert.strictEqual(rows[1].cells[3].getValue(), " d");
    });

    test("getModel() calls alignmentFactory to create alignments for the table columns", () => {
        const tableText = 
         `| c1 | c2 |   | c4
          |:---|--- |:-:|-:
          | a  | b  |   | d`;
        const document = new Document(tableText);
        const expectedAlignmets: Alignment[] = [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ];
        _alignmentFactoryMock
            .setup(m => m.createAlignments(It.isAny()))
            .returns(() => expectedAlignmets)
            .verifiable(Times.once());
        _transformer.setup(_ => _.process(It.isAny())).returns((input) => input);
        const sut = createFactory();

        const actualAlignments: Alignment[] = sut.getModel(document, document.fullRange).alignments;
        assert.strictEqual(expectedAlignmets.length == actualAlignments.length && expectedAlignmets.every((l,i) => l === actualAlignments[i]), true);
        _alignmentFactoryMock.verifyAll();
    });

    test("getModel() calls transformer and returns its result", () => {
        const tableText = 
         ` c1 | c2 |   | c4
          :---|--- |:-:|-:
           a  | b  |   | d`;
        const document = new Document(tableText);
        const expectedAlignmets: Alignment[] = [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ];
        const transformedTable = tableFor([["c1", "c2", "", "c4"], ["a", "b", "", "d"]], expectedAlignmets);
        _alignmentFactoryMock.setup(m => m.createAlignments(It.isAny())).returns(() => expectedAlignmets);
        _transformer.setup(_ => _.process(It.isAny())).returns(() => transformedTable);
        const sut = createFactory();

        const result = sut.getModel(document, document.fullRange);

        _transformer.verify(_ => _.process(It.isAny()), Times.once());
        assert.strictEqual(result, transformedTable);
    });

    test("getModel() calls selection interpreter to split lines for each line (incl. separator)", () => {
        const tableText = 
         ` c1 | c2 |   | c4
          :---|--- |:-:|-:
           a  | b  |   | d`;
        const expectedAlignmets: Alignment[] = [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ];
        const tableData: string[][] = [["c1", "c2", "", "c4"], ["a", "b", "", "d"]];
        const transformedTable = tableFor(tableData, expectedAlignmets);
        _alignmentFactoryMock.setup(m => m.createAlignments(It.isAny())).returns(() => expectedAlignmets);
        _transformer.setup(_ => _.process(It.isAny())).returns(() => transformedTable);

        let selectionInterpreter: IMock<SelectionInterpreter> = Mock.ofType<SelectionInterpreter>();
        selectionInterpreter.setup(_ => _.splitLine(It.isAny())).returns(() => []);
        const sut = createFactory(selectionInterpreter.object);
        const document = new Document(tableText);

        sut.getModel(document, document.fullRange);

        selectionInterpreter.verify(_ => _.splitLine(It.isAny()), Times.exactly(3));
    });

    test("getModel() calls indentation detector and creates a table with its result", () => {
        const tableText =
            ` c1 | c2 |   | c4
          :---|--- |:-:|-:
           a  | b  |   | d`;
        const expectedAlignmets: Alignment[] = [Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left];
        const tableData: string[][] = [["c1", "c2", "", "c4"], ["a", "b", "", "d"]];
        const transformedTable = tableFor(tableData, expectedAlignmets, "  \t  ");
        _alignmentFactoryMock.setup(m => m.createAlignments(It.isAny())).returns(() => expectedAlignmets);
        _transformer.setup(_ => _.process(It.isAny())).returns(() => transformedTable);

        let selectionInterpreter: IMock<SelectionInterpreter> = Mock.ofType<SelectionInterpreter>();
        selectionInterpreter.setup(_ => _.splitLine(It.isAny())).returns(() => []);

        _tableIndentationDetector.setup(_ => _.getLeftPad(It.isAny())).returns(() => "test");

        const sut = createFactory(selectionInterpreter.object);
        const document = new Document(tableText);

        const table = sut.getModel(document, document.fullRange);

        _tableIndentationDetector.verify(_ => _.getLeftPad(It.isAny()), Times.exactly(1));
        assert.strictEqual(table.leftPad, "  \t  ");
    });


    function tableFor(rows: string[][], alignments: Alignment[], leftPad: string = "") {
        return new Table(rows.map(row => new Row(row.map(c  => new Cell(c)), "\r\n")), "\r\n", alignments, leftPad);
    }

    function createFactory(selectionInterpreter: SelectionInterpreter = null): TableFactory {
        return new TableFactory(_alignmentFactoryMock.object, 
            selectionInterpreter == null ? new SelectionInterpreter(false) : selectionInterpreter, 
            _transformer.object, _tableIndentationDetector.object);
    }
});