import * as assert from 'assert';
import { Table } from "../../src/models/table";

suite("Table tests", () => {

    test("items() returns parameter given to constructor", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = new Table(rows);

        assert.equal(table.items, rows);
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

        const table = new Table(originalRows);
        const tableWithoutEmptyColumns = table.withoutEmptyColumns();

        const actualNoEmptyColumnItems = tableWithoutEmptyColumns.items;
        assert.equal(actualNoEmptyColumnItems.length, expectedNoEmptyColumns.length);
        for (let i = 0; i < actualNoEmptyColumnItems.length; i++) {
            assert.equal(actualNoEmptyColumnItems[i].length, expectedNoEmptyColumns[i].length);

            for (let j = 0; j < actualNoEmptyColumnItems[i].length; j++)
                assert.equal(actualNoEmptyColumnItems[i][j], expectedNoEmptyColumns[i][j]);
        }

        assert.equal(table.items, originalRows);
    });

    test("isEmpty() returns true for null rows", () => {
        const table = new Table(null);

        assert.equal(table.isEmpty(), true);
    });

    test("isEmpty() returns true for empty rows", () => {
        const table = new Table([]);

        assert.equal(table.isEmpty(), true);
    });

    test("isEmpty() returns true false for a single element", () => {

        const table = new Table([["test"]]);

        assert.equal(table.isEmpty(), false);
    });
});