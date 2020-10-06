import * as assert from 'assert';
import { Table } from "../../../../src/models/table";
import { Alignment } from "../../../../src/models/alignment";
import { TrimmerTransformer } from '../../../../src/modelFactory/transformers/trimmerTransformer';
import { Cell } from '../../../../src/models/cell';
import { Row } from '../../../../src/models/row';

suite("TrimmerTransformer tests", () => {
    test("process() returns trimmed cells", () => {
        const rows = [ 
            [ "  h1  ",   " " ,   "  h3  " ],
            [ "c"     ,   "  ",   "e"      ]
        ];
        const table = tableFor(rows);

        const actual: Table = createSut().process(table);

        const expected = [
            [ "h1", "", "h3"],
            [ "c",  "", "e" ]
        ];
        assertRowsMatch(actual.rows, expected);
    });

    function createSut() {
        return new TrimmerTransformer(null);
    }

    function assertRowsMatch(actualRows: Row[], expectedRows: string[][]) {
        assert.strictEqual(actualRows.length, expectedRows.length);
        for (let i = 0; i < actualRows.length; i++) {
            assert.strictEqual(actualRows[i].cells.length, expectedRows[i].length);

            for (let j = 0; j < actualRows[i].cells.length; j++)
                assert.strictEqual(actualRows[i].cells[j].getValue(), expectedRows[i][j]);
        }
    }

    function tableFor(rows: string[][]) {
        const alignments: Alignment[] = rows[0].map(r => Alignment.Left);
        return new Table(rows.map(row => new Row(row.map(c  => new Cell(c)), "\r\n")), "\r\n", alignments);
    }
});