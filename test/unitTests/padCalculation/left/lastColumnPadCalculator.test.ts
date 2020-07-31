import * as assert from 'assert';
import { Table } from '../../../../src/models/table';
import { Alignment } from '../../../../src/models/alignment';
import { Cell } from '../../../../src/models/cell';
import { LastColumnPadCalculator } from '../../../../src/padCalculation/left/lastColumnPadCalculator';
import { Row } from '../../../../src/models/row';

suite("LeftAlign - LastColumnPadCalculator tests", () => {

    test("getLeftPadding() Last column left padded with 1 character", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);

        const pad = getLeftPad(sut, table);

        assert.equal(pad, " ");
    });

    test("getRightPadding() Last column not right padded if there's no border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "c" ]
        ]);
        
        const pad = getRightPad(sut, table);

        assert.equal(pad, "");
    });

    test("getRightPadding() Last column equal to maxColLength gets right padded with one character if there is right border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);
        table.hasRightBorder = true;

        const pad = getRightPad(sut, table);

        assert.equal(pad, " ");
    });

    test("getRightPadding() Last column 1 char shorter than maxColLength gets right padded with 2 characters if there is right border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "cccc" ]
        ]);
        table.hasRightBorder = true;

        const pad = getRightPad(sut, table);

        assert.equal(pad, "  ");
    });

    test("getRightPadding() Last column 2 chars shorter than maxColLength gets right padded with 3 characters if there is right border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccc" ]
        ]);
        table.hasRightBorder = true;

        const pad = getRightPad(sut, table);

        assert.equal(pad, "   ");
    });

    test("getRightPadding() Last column 3 char shorter than maxColLength gets right padded with 4 characters if there is right border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "cc" ]
        ]);
        table.hasRightBorder = true;

        const pad = getRightPad(sut, table);

        assert.equal(pad, "    ");
    });

    test("getRightPadding() Last column is empty string gets right padded with maxColLength+1 characters if there is right border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "" ]
        ]);
        table.hasRightBorder = true;

        const pad = getRightPad(sut, table);

        assert.equal(pad, "      ");
    });

    test("getRightPadding() Last column with 0 maxLength gets right padded with 2 characters if there is right border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "" ],
            [ "aaaaa", "bbbbb", "" ]
        ]);
        table.hasRightBorder = true;

        const pad = getRightPad(sut, table);

        assert.equal(pad, "  ");
    });

    function getLeftPad(sut: LastColumnPadCalculator, table: Table): string {
        return sut.getLeftPadding(" ", table, 1, 2);
    }

    function getRightPad(sut: LastColumnPadCalculator, table: Table): string {
        return sut.getRightPadding(" ", table, 1, 2);
    }

    function createCalculator(): LastColumnPadCalculator {
        return new LastColumnPadCalculator();
    }

    function tableFor(rows: string[][]) {
        const alignments: Alignment[] = rows[0].map(r => Alignment.Left);
        return new Table(rows.map(row => new Row(row.map(c  => new Cell(c)), "\r\n")), "\r\n", alignments);
    }
});