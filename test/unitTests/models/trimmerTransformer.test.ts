import * as assert from 'assert';
import { Table } from "../../../src/models/table";
import { Alignment } from "../../../src/models/alignment";
import { TrimmerTransformer } from '../../../src/modelFactory/transformers/trimmerTransformer';

suite("TrimmerTransformer tests", () => {
    test("process() returns trimmed cells", () => {
        const rows = [ 
            [ "  h1  ",   " " ,   "  h3  " ],
            [ "c"     ,   "  ",   "e"      ]
        ];
        const table = new Table(rows, rows[0].map(r => Alignment.Left));

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

    function assertRowsMatch(actualRows: string[][], expectedRows: string[][]) {
        assert.equal(actualRows.length, expectedRows.length);
        for (let i = 0; i < actualRows.length; i++) {
            assert.equal(actualRows[i].length, expectedRows[i].length);

            for (let j = 0; j < actualRows[i].length; j++)
                assert.equal(actualRows[i][j], expectedRows[i][j]);
        }
    }
});