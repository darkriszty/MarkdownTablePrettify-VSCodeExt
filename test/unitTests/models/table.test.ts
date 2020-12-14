import * as assert from 'assert';
import { Table } from "../../../src/models/table";
import { Alignment } from "../../../src/models/alignment";
import { Cell } from '../../../src/models/cell';
import { Row } from '../../../src/models/row';

suite("Table tests", () => {
    test("isEmpty() returns true for null rows", () => {
        const table = new Table(null, null, null);

        assert.strictEqual(table.isEmpty(), true);
    });

    test("isEmpty() returns true for empty rows", () => {
        const table = new Table([], "", []);

        assert.strictEqual(table.isEmpty(), true);
    });

    test("isEmpty() returns false for a single element", () => {
        const table = tableFor([["test"]]);

        assert.strictEqual(table.isEmpty(), false);
    });

    test("columnCount() returns number of columns", () => {
        const table = tableFor([ 
            [ "  h1  ",   " " ,   "  h3  "],
            [ "c"     ,   "  ",   "e"     ]
        ]);

        assert.strictEqual(table.columnCount, 3);
    });

    test("rowCount() returns number of rows", () => {
        const table = tableFor([ 
            [ "  h1  ",   " " ,   "  h3  " ],
            [ "c"     ,   "  ",   "e"      ]
        ]);

        assert.strictEqual(table.rowCount, 2);
    });

    test("alignments() returns the given constructor alignments", () => {
        const rows = [ 
            [ "  h1  ",   " " ,   "  h3  " ],
            [ "c"     ,   "  ",   "e"      ]
        ];
        const expectedAlignments = getAlignmentsFor(rows);
        const table = new Table(rows.map(row => new Row(row.map(c  => new Cell(c)), "")), "", expectedAlignments);

        assert.strictEqual(table.alignments, expectedAlignments);
    });

    test("separatorEOL() returns the given constructor value", () => {
        const table = new Table([], "\r\n", []);

        assert.strictEqual(table.separatorEOL, "\r\n");
    });

    test("leftPad returns the given constructor value", () => {
        const table = new Table([], "", [], "\tHello\t");

        assert.strictEqual(table.leftPad, "\tHello\t");
    });

    test("getLongestColumnLengths() mixed CJK and english chars returns longest row length for each column", () => {
        const table = tableFor([
            ["a", "b"],
            ["cd", "efgh"],
            ["𠁻 test", "𣄿 content"]
        ]);
        
        const maxLengths: number[] = table.getLongestColumnLengths();

        assert.strictEqual(maxLengths.length, 2);
        assert.strictEqual(maxLengths[0], 7);
        assert.strictEqual(maxLengths[1], 10);
    });
    
    function tableFor(rows: string[][]) {
        return new Table(rows.map(row => new Row(row.map(c  => new Cell(c)), "\r\n")), "\r\n",  getAlignmentsFor(rows));
    }

    function getAlignmentsFor(rows: string[][], alignment: Alignment = Alignment.Left): Alignment[] {
        return rows[0].map(col => alignment);
    }

    function assertModelEquals(actual: Table, expected: Table) {
        assertRowsMatch(actual.rows, expected.rows)

        const actualAlignments = actual.alignments;
        const expectedAlignments = expected.alignments;
        assert.strictEqual(actualAlignments.length, expectedAlignments.length);
        for (let i = 0; i < actualAlignments.length; i++)
            assert.strictEqual(actualAlignments[i], expectedAlignments[i]);
    }

    function assertRowsMatch(actualRows: Row[], expectedRows: Row[]) {
        assert.strictEqual(actualRows.length, expectedRows.length);
        for (let i = 0; i < actualRows.length; i++) {
            assert.strictEqual(actualRows[i].cells.length, expectedRows[i].cells.length);

            for (let j = 0; j < actualRows[i].cells.length; j++)
                assert.strictEqual(actualRows[i].cells[j].getValue(), expectedRows[i].cells[j].getValue());
        }
    }
});