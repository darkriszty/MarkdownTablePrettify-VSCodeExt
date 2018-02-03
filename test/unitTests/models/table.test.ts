import * as assert from 'assert';
import { Table } from "../../../src/models/table";
import { Alignment } from "../../../src/models/alignment";

suite("Table tests", () => {

    test("items() returns trimmed cells without empty first and last columns and without separator row", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = new Table(rows, getAlignmentsFor(rows));

        const trimmedRowsWithoutSeparator = [
            [ "h1", "", "h3"],
            [ "c",  "", "e" ]
        ];
        assertRowsMatch(table.rows, trimmedRowsWithoutSeparator);
    });

    test("isEmpty() returns true for null rows", () => {
        const table = new Table(null, null);

        assert.equal(table.isEmpty(), true);
    });

    test("isEmpty() returns true for empty rows", () => {
        const table = new Table([], []);

        assert.equal(table.isEmpty(), true);
    });

    test("isEmpty() returns false for a single element", () => {

        const table = new Table([["test"]], [ Alignment.Left ]);

        assert.equal(table.isEmpty(), false);
    });

    test("columnCount() returns number of columns without empty first and last columns", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = new Table(rows, getAlignmentsFor(rows));

        assert.equal(table.columnCount, 3);
    });

    test("rowCount() returns number of rows", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = new Table(rows, getAlignmentsFor(rows));

        assert.equal(table.rowCount, 2);
    });

    test("alignments() returns the given constructor alignments", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const expectedAlignments = getAlignmentsFor(rows);
        const table = new Table(rows, expectedAlignments);

        assert.equal(table.alignments, expectedAlignments);
    });

    test("separator() returns the second row without empty first and last columns", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = new Table(rows, getAlignmentsFor(rows));

        const separator = [ "-" , "", "---" ];
        assert.equal(table.separator.length, separator.length);
        for (let i = 0; i < separator.length; i++)
            assert.equal(table.separator[i], separator[i]);
    });

    test("hasLeftBorder() returns true for empty first column", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = new Table(rows, getAlignmentsFor(rows));

        assert.equal(table.hasLeftBorder, true);
    });

    test("hasLeftBorder() returns false for non-empty first column", () => {
        const rows = [ 
            [ "  h1  ",   " " ,   "  h3  ", "" ],
            [ " - "   ,   ""  ,   "---"   , "" ],
            [ "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = new Table(rows, getAlignmentsFor(rows));

        assert.equal(table.hasLeftBorder, false);
    });

    test("hasRightBorder() returns true when there is a left border and a right border", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = new Table(rows, getAlignmentsFor(rows));

        assert.equal(table.hasRightBorder, true);
    });

    test("hasRightBorder() returns true when there is a left border and no right border", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  " ],
            [ "",   " - "   ,   ""  ,   "---"    ],
            [ "",   "c"     ,   "  ",   "e"      ]
        ];
        const table = new Table(rows, getAlignmentsFor(rows));

        assert.equal(table.hasRightBorder, true);
    });

    test("hasRightBorder() returns false if there is a right border without a left border", () => {
        const rows = [ 
            [ "  h1  ",   " " ,   "  h3  ", "" ],
            [ " - "   ,   ""  ,   "---"   , "" ],
            [ "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = new Table(rows, getAlignmentsFor(rows));

        assert.equal(table.hasRightBorder, false);
    });

    test("getLongestColumnLength() mixed CJK and english chars returns longest row length for each column", () => {
        const table = new Table([
            ["a", "b"],
            ["-", "-"],
            ["cd", "efgh"],
            ["𠁻 test", "𣄿 content"]
        ], [ Alignment.Left, Alignment.Left ]);
        
        const maxLengths: number[] = table.getLongestColumnLength();

        assert.equal(maxLengths.length, 2);
        assert.equal(maxLengths[0], 7);
        assert.equal(maxLengths[1], 10);
    });

    test("getLongestColumnLength() does not consider extra white spaces", () => {
        const table = new Table([
            ["a", "   b"],
            ["-", "-"],
            ["cd", "efgh                                        "],
            ["𠁻 test                ", "𣄿 content"]
        ], [ Alignment.Left, Alignment.Left ]);
        
        const maxLengths: number[] = table.getLongestColumnLength();

        assert.equal(maxLengths.length, 2);
        assert.equal(maxLengths[0], 7);
        assert.equal(maxLengths[1], 10);
    });

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

    function assertRowsMatch(actualRows: string[][], expectedRows: string[][]) {
        assert.equal(actualRows.length, expectedRows.length);
        for (let i = 0; i < actualRows.length; i++) {
            assert.equal(actualRows[i].length, expectedRows[i].length);

            for (let j = 0; j < actualRows[i].length; j++)
                assert.equal(actualRows[i][j], expectedRows[i][j]);
        }
    }
});