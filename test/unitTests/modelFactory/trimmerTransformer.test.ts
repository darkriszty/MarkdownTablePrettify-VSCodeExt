import * as assert from 'assert';
import { Table } from "../../../src/models/table";
import { Alignment } from "../../../src/models/alignment";
import { TrimmerTransformer } from '../../../src/modelFactory/transformers/trimmerTransformer';
import { Cell } from '../../../src/models/cell';

suite("TrimmerTransformer tests", () => {
    test("process() returns trimmed cells", () => {
        const rows = [ 
            [ "  h1  ",   " " ,   "  h3  " ],
            [ "c"     ,   "  ",   "e"      ]
        ];
        const table = tableFor(rows);

        const actual = createSut().process(table);

        const expected = [
            [ "h1", "", "h3"],
            [ "c",  "", "e" ]
        ];
        assertRowsMatch(actual.rows, expected);
    });

    function createSut() {
        return new TrimmerTransformer(null);
    }

    function assertRowsMatch(actualRows: Cell[][], expectedRows: string[][]) {
        assert.equal(actualRows.length, expectedRows.length);
        for (let i = 0; i < actualRows.length; i++) {
            assert.equal(actualRows[i].length, expectedRows[i].length);

            for (let j = 0; j < actualRows[i].length; j++)
                assert.equal(actualRows[i][j].getValue(), expectedRows[i][j]);
        }
    }

    function tableFor(rows: string[][]) {
        const alignments: Alignment[] = rows[0].map(r => Alignment.Left);
        let table = new Table(rows.map(row => row.map(c  => new Cell(c))), alignments);
        return table;
    }
});