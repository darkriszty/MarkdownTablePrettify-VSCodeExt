import * as assert from 'assert';
import { Table } from "../../../../src/models/table";
import { Alignment } from "../../../../src/models/alignment";
import { BorderTransformer } from '../../../../src/modelFactory/transformers/borderTransformer';
import { Cell } from '../../../../src/models/cell';
import { Row } from '../../../../src/models/row';

suite("BorderTransformer tests", () => {
    test("process() sets hasLeftBorder to true for empty first column", () => {
        const rows = [ 
            [ "", "  h1  ",   " " ,   "  h3  " ],
            [ "", "c"     ,   "  ",   "e"      ]
        ];
        const table = createSut().process(tableFor(rows));

        assert.strictEqual(table.hasLeftBorder, true);
    });

    test("process() sets hasLeftBorder to false for non-empty first column", () => {
        const rows = [ 
            [ "  h1  ",   " " ,   "  h3  " ],
            [ "c"     ,   "  ",   "e"      ]
        ];
        const table = createSut().process(tableFor(rows));

        assert.strictEqual(table.hasLeftBorder, false);
    });

    test("process() sets hasRightBorder to true when there is a left border and a right border", () => {
        const rows = [ 
            [ "", "  h1  ",   " " ,   "  h3  ", "" ],
            [ "", "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = createSut().process(tableFor(rows));

        assert.strictEqual(table.hasRightBorder, true);
    });

    test("process() sets hasRightBorder to true when there is a left border and no right border", () => {
        const rows = [ 
            [ "", "  h1  ",   " " ,   "  h3  " ],
            [ "", "c"     ,   "  ",   "e"      ]
        ];
        const table = createSut().process(tableFor(rows));

        assert.strictEqual(table.hasRightBorder, true);
    });

    test("process() sets hasRightBorder to false if there is a right border without a left border", () => {
        const rows = [ 
            [ "  h1  ",   " " ,   "  h3  ", "" ],
            [ "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = createSut().process(tableFor(rows));

        assert.strictEqual(table.hasRightBorder, false);
    });

    test("process() keeps leftPad if table has a left border", () => {
        const rows = [
            ["", "  h1  ", " ", "  h3  "],
            ["", "c", "  ", "e"]
        ];
        const table = createSut().process(tableFor(rows, "\t"));

        assert.strictEqual(table.leftPad, "\t");
    });

    test("process() does not keep leftPad if table has no left border", () => {
        const rows = [
            ["  h1  ", " ", "  h3  "],
            ["c", "  ", "e"]
        ];
        const table = createSut().process(tableFor(rows, "\t"));

        assert.strictEqual(table.leftPad, "");
    });

    function tableFor(rows: string[][], leftPad: string = "") {
        const alignments: Alignment[] = rows[0].map(r => Alignment.Left);
        return new Table(rows.map(row => new Row(row.map(c  => new Cell(c)), "\r\n")), "\r\n", alignments, leftPad);
    }

    function createSut() {
        return new BorderTransformer(null);
    }
});