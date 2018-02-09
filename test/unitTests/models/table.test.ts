import * as assert from 'assert';
import { Table } from "../../../src/models/table";
import { Alignment } from "../../../src/models/alignment";
import { Cell } from '../../../src/models/cell';

suite("Table tests", () => {
    test("isEmpty() returns true for null rows", () => {
        const table = new Table(null, null);

        assert.equal(table.isEmpty(), true);
    });

    test("isEmpty() returns true for empty rows", () => {
        const table = new Table([], []);

        assert.equal(table.isEmpty(), true);
    });

    test("isEmpty() returns false for a single element", () => {
        const table = tableFor([["test"]]);

        assert.equal(table.isEmpty(), false);
    });

    test("columnCount() returns number of columns", () => {
        const table = tableFor([ 
            [ "  h1  ",   " " ,   "  h3  "],
            [ "c"     ,   "  ",   "e"     ]
        ]);

        assert.equal(table.columnCount, 3);
    });

    test("rowCount() returns number of rows", () => {
        const table = tableFor([ 
            [ "  h1  ",   " " ,   "  h3  " ],
            [ "c"     ,   "  ",   "e"      ]
        ]);

        assert.equal(table.rowCount, 2);
    });

    test("alignments() returns the given constructor alignments", () => {
        const rows = [ 
            [ "  h1  ",   " " ,   "  h3  " ],
            [ "c"     ,   "  ",   "e"      ]
        ];
        const expectedAlignments = getAlignmentsFor(rows);
        const table = new Table(rows.map(row => row.map(c  => new Cell(c))), expectedAlignments);

        assert.equal(table.alignments, expectedAlignments);
    });

    test("getLongestColumnLengths() mixed CJK and english chars returns longest row length for each column", () => {
        const table = tableFor([
            ["a", "b"],
            ["cd", "efgh"],
            ["𠁻 test", "𣄿 content"]
        ]);
        
        const maxLengths: number[] = table.getLongestColumnLengths();

        assert.equal(maxLengths.length, 2);
        assert.equal(maxLengths[0], 7);
        assert.equal(maxLengths[1], 10);
    });
    
    function tableFor(rows: string[][]) {
        return new Table(rows.map(row => row.map(c  => new Cell(c))), getAlignmentsFor(rows));
    }

    function getAlignmentsFor(rows: string[][], alignment: Alignment = Alignment.Left): Alignment[] {
        return rows[0].map(col => alignment);
    }

    function assertModelEquals(actual: Table, expected: Table) {
        assertRowsMatch(actual.rows, expected.rows)

        const actualAlignments = actual.alignments;
        const expectedAlignments = expected.alignments;
        assert.equal(actualAlignments.length, expectedAlignments.length);
        for (let i = 0; i < actualAlignments.length; i++)
            assert.equal(actualAlignments[i], expectedAlignments[i]);
    }

    function assertRowsMatch(actualRows: Cell[][], expectedRows: Cell[][]) {
        assert.equal(actualRows.length, expectedRows.length);
        for (let i = 0; i < actualRows.length; i++) {
            assert.equal(actualRows[i].length, expectedRows[i].length);

            for (let j = 0; j < actualRows[i].length; j++)
                assert.equal(actualRows[i][j].getValue(), expectedRows[i][j].getValue());
        }
    }
});