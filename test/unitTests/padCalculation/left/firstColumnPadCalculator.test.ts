import * as assert from 'assert';
import { Table } from '../../../../src/models/table';
import { Alignment } from '../../../../src/models/alignment';
import { Cell } from '../../../../src/models/cell';
import { FirstColumnPadCalculator } from '../../../../src/padCalculation/left/firstColumnPadCalculator';
import { Row } from '../../../../src/models/row';

suite("LeftAlign - FirstColumnPadCalculator tests", () => {

    test("getLeftPadding() First column not left padded", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);

        const pad = getLeftPad(sut, table);

        assert.strictEqual(pad, "");
    });

    test("getLeftPadding() First column left padded with 1 character if there is a left border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);
        table.hasLeftBorder = true;
        const pad = getLeftPad(sut, table);

        assert.strictEqual(pad, " ");
    });

    test("getRightPadding() First column equal to maxColLength gets right padded with one character", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);

        const pad = getRightPad(sut, table);

        assert.strictEqual(pad, " ");
    });

    test("getRightPadding() First column 1 char shorter than maxColLength gets right padded with 2 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaa", "bbbbb", "ccccc" ]
        ]);

        const pad = getRightPad(sut, table);

        assert.strictEqual(pad, "  ");
    });

    test("getRightPadding() First column 2 char shorter than maxColLength gets right padded with 3 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaa", "bbbbb", "ccccc" ]
        ]);

        const pad = getRightPad(sut, table);

        assert.strictEqual(pad, "   ");
    });

    test("getRightPadding() First column 3 char shorter than maxColLength gets right padded with 4 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aa", "bbbbb", "ccccc" ]
        ]);

        const pad = getRightPad(sut, table);

        assert.strictEqual(pad, "    ");
    });

    test("getRightPadding() First column 4 char shorter than maxColLength gets right padded with 5 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "a", "bbbbb", "ccccc" ]
        ]);

        const pad = getRightPad(sut, table);

        assert.strictEqual(pad, "     ");
    });

    test("getRightPadding() First column is empty string gets right padded with 6 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "", "bbbbb", "ccccc" ]
        ]);

        const pad = getRightPad(sut, table);

        assert.strictEqual(pad, "      ");
    });

    function getLeftPad(sut: FirstColumnPadCalculator, table: Table): string {
        return sut.getLeftPadding(" ", table, 1, 0);
    }

    function getRightPad(sut: FirstColumnPadCalculator, table: Table): string {
        return sut.getRightPadding(" ", table, 1, 0);
    }

    function createCalculator(): FirstColumnPadCalculator {
        return new FirstColumnPadCalculator();
    }

    function tableFor(rows: string[][]) {
        const alignments: Alignment[] = rows[0].map(r => Alignment.Left);
        return new Table(rows.map(row => new Row(row.map(c  => new Cell(c)), "\r\n")), "\r\n", alignments);
    }
});