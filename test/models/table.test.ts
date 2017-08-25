import * as assert from 'assert';
import { Table } from "../../src/models/table";
import { Alignment } from "../../src/models/alignment";

suite("Table tests", () => {

    test("items() returns parameter given to constructor", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = new Table(rows, [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ]);

        assert.equal(table.rows, rows);
    });

    test("withoutEmptyColumns() create instance without empty columns and leaves original intact", () => {
        const originalRows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const expectedNoEmptyColumns = [ 
            [ "  h1  ", "  h3  " ],
            [ " - "   , "---"    ],
            [ "c"     , "e"      ]
        ];

        const table = new Table(originalRows, [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ]);
        const tableWithoutEmptyColumns = table.withoutEmptyColumns();

        const actualNoEmptyColumnItems = tableWithoutEmptyColumns.rows;
        assert.equal(actualNoEmptyColumnItems.length, expectedNoEmptyColumns.length);
        for (let i = 0; i < actualNoEmptyColumnItems.length; i++) {
            assert.equal(actualNoEmptyColumnItems[i].length, expectedNoEmptyColumns[i].length);

            for (let j = 0; j < actualNoEmptyColumnItems[i].length; j++)
                assert.equal(actualNoEmptyColumnItems[i][j], expectedNoEmptyColumns[i][j]);
        }

        assert.equal(table.rows, originalRows);
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
        const table = new Table(rows, [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ]);

        assert.equal(table.columnCount, 5);
    });

    test("rowCount() returns number of rows", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = new Table(rows, [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ]);

        assert.equal(table.rowCount, 3);
    });

    test("alignments() returns the given constructor alignments", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const expectedAlignments = [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ]
        const table = new Table(rows, expectedAlignments);

        assert.equal(table.alignments, expectedAlignments);
    });
});