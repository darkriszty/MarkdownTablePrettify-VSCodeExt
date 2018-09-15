import * as assert from 'assert';
import { Table } from '../../../../src/models/table';
import { Alignment } from '../../../../src/models/alignment';
import { Cell } from '../../../../src/models/cell';
import { MiddleColumnPadCalculator } from '../../../../src/padCalculation/left/middleColumnPadCalculator';

suite("LeftAlign - MiddleColumnPadCalculator tests", () => {

    test("getLeftPadding() Middle column left padded with 1 character", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);

        const pad = getLeftPad(sut, table);

        assert.equal(pad, " ");
    });

    test("getLeftPadding() Middle column is empty cell gets left padded with one character", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaa", "bbbb", "ccccc" ],
            [ "a", "", "c" ]
        ]);

        const pad = getLeftPad(sut, table);

        assert.equal(pad, " ");
    });

    test("getRightPadding() Middle column is empty cell gets right padded with maxColLength characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "", "ccccc" ]
        ]);

        const pad = getRightPad(sut, table);

        assert.equal(pad, "      ");
    });

    test("getRightPadding() Middle column equal to maxColLength gets right padded with one character", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);

        const pad = getRightPad(sut, table);

        assert.equal(pad, " ");
    });

    test("getRightPadding() Middle column 1 char shorter than maxColLength gets right padded with 2 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbb", "ccccc" ]
        ]);

        const pad = getRightPad(sut, table);

        assert.equal(pad, "  ");
    });

    test("getRightPadding() Middle column 2 char shorter than maxColLength gets right padded with 3 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbb", "ccccc" ]
        ]);

        const pad = getRightPad(sut, table);

        assert.equal(pad, "   ");
    });

    test("getRightPadding() Middle column 3 char shorter than maxColLength gets right padded with 4 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bb", "ccccc" ]
        ]);

        const pad = getRightPad(sut, table);

        assert.equal(pad, "    ");
    });

    test("getRightPadding() Middle column is empty string gets right padded with maxColLength+1 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "", "ccccc" ]
        ]);

        const pad = getRightPad(sut, table);

        assert.equal(pad, "      ");
    });

    test("getRightPadding() Middle column with 0 maxLength gets right padded with 2 character", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "", "ccccc" ],
            [ "aaaaa", "", "ccccc" ]
        ]);

        const pad = getRightPad(sut, table);

        assert.equal(pad, "  ");
    });

    test("Regular middle gets padded both left and right with expected amount", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "b", "ccccc" ]
        ]);

        const leftPad = sut.getLeftPadding(" ", table, 1, 1);
        const rightPad = sut.getRightPadding(" ", table, 1, 1);

        assert.equal(leftPad, " ");
        assert.equal(rightPad, "     ");
    });

    function getLeftPad(sut: MiddleColumnPadCalculator, table: Table): string {
        return sut.getLeftPadding(" ", table, 1, 1);
    }

    function getRightPad(sut: MiddleColumnPadCalculator, table: Table): string {
        return sut.getRightPadding(" ", table, 1, 1);
    }

    function createCalculator(): MiddleColumnPadCalculator {
        return new MiddleColumnPadCalculator();
    }

    function tableFor(rows: string[][]) {
        const alignments: Alignment[] = rows[0].map(() => Alignment.Left);
        let table = new Table(rows.map(row => row.map(c  => new Cell(c))), alignments);
        return table;
    }
});