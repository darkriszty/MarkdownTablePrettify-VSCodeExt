import * as assert from 'assert';
import { Table } from "../../src/models/table";
import { Alignment } from "../../src/models/alignment";

suite("Table tests", () => {

    test("items() returns parameter given to constructor except for separator row", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = new Table(rows, getAlignmentsFor(rows));

        const rowsWithoutSeparator = rows.filter((v, i) => i != 1);
        assertRowsMatch(table.rows, rowsWithoutSeparator);
    });

    test("withoutEmptyColumns() create instance without empty columns and leaves original intact", () => {
        const originalRows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   "-"  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const expectedNoEmptyColumns = [ 
            [ "  h1  ",  " " , "  h3  " ],
            [ " - "   ,  "-" , "---"    ],
            [ "c"     ,  "  ", "e"      ]
        ];

        const table = new Table(originalRows, getAlignmentsFor(originalRows));
        const tableWithoutEmptyColumns = table.withoutEmptyColumns();

        const expectedTable = new Table(expectedNoEmptyColumns, [ Alignment.Left, Alignment.Left, Alignment.Left ]);

        assertModelEquals(tableWithoutEmptyColumns, expectedTable);
        assertRowsMatch(table.rows, originalRows.filter((v, i) => i != 1));
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

    test("columnCount() returns number of columns", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = new Table(rows, getAlignmentsFor(rows));

        assert.equal(table.columnCount, 5);
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

    test("trimColumnValues() removes spaces from beginning and end of each cell", () => {
        const rows = [ 
            [ "   ",   "  h1  ",   " " ,   "  h3  ", "    expected   3   spaces   " ],
            [ "			",   " - "   ,   ""  ,   "---"   , "     " ],
            [ "  	  	",   "c"     ,   "  ",   "e f  "     , "" ]
        ];
        const expectedColumns = [ 
            [ "", "h1", "", "h3",  "expected   3   spaces" ],
            [ "", "-",  "", "---", "" ],
            [ "", "c",  "", "e f", "" ]
        ];
        const alignments = getAlignmentsFor(rows);
        const table = new Table(rows, alignments).trimValues();

        assertModelEquals(table, new Table(expectedColumns, alignments));
    });

    test("separator() returns the second row", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = new Table(rows, getAlignmentsFor(rows));

        const separator = [ "",   " - "   ,   ""  ,   "---"   , "" ];
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

    test("hasRightBorder() returns true for empty last column", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = new Table(rows, getAlignmentsFor(rows));

        assert.equal(table.hasRightBorder, true);
    });

    test("hasRightBorder() returns false for non empty last column", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  " ],
            [ "",   " - "   ,   ""  ,   "---"    ],
            [ "",   "c"     ,   "  ",   "e"      ]
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