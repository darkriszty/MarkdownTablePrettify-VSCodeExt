import * as assert from 'assert';
import { Table } from '../../../../src/models/table';
import { Alignment } from '../../../../src/models/alignment';
import { Cell } from '../../../../src/models/cell';
import { Row } from '../../../../src/models/row';
import { FirstColumnPadCalculator } from '../../../../src/padCalculation/center/firstColumnPadCalculator';

suite("CenterAlign - FirstColumnPadCalculator tests", () => {

    test("getLeftPadding() First column left by half the length", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaa", "bbbbb", "ccccc" ],
            [ "aa", "bbbbb", "ccccc" ]
        ]);

        assert.equal(sut.getLeftPadding(" ", table, 0, 0), "");
        assert.equal(sut.getLeftPadding(" ", table, 1, 0), " ");
    });

    test("getLeftPadding() First column left padded with 1 extra character if there is a left border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaa", "bbbbb", "ccccc" ],
            [ "aa", "bbbbb", "ccccc" ]
        ]);
        table.hasLeftBorder = true;

        assert.equal(sut.getLeftPadding(" ", table, 0, 0), " ");
        assert.equal(sut.getLeftPadding(" ", table, 1, 0), "  ");
    });

    test("getRightPadding() First column equal to maxColLength gets padded with one character", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);

        assert.equal(sut.getRightPadding(" ", table, 1, 0), " ");
    });

    test("getLeftPadding() First column equal to maxColLength is not padded", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);

        assert.equal(sut.getLeftPadding(" ", table, 1, 0), "");
    });

    test("getRightPadding() First column 1 char shorter than maxColLength gets padded with one character", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaa", "bbbbb", "ccccc" ]
        ]);

        assert.equal(sut.getRightPadding(" ", table, 1, 0), " ");
    });

    test("getLeftPadding() First column 1 char shorter than maxColLength gets padded with one character", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaa", "bbbbb", "ccccc" ]
        ]);

        assert.equal(sut.getLeftPadding(" ", table, 1, 0), " ");
    });

    test("getRightPadding() First column 2 char shorter than maxColLength gets padded with 2 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaa", "bbbbb", "ccccc" ]
        ]);

        assert.equal(sut.getRightPadding(" ", table, 1, 0), "  ");
    });

    test("getLeftPadding() First column 2 char shorter than maxColLength is padded with one character", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaa", "bbbbb", "ccccc" ]
        ]);

        assert.equal(sut.getLeftPadding(" ", table, 1, 0), " ");
    });

    test("getRightPadding() First column 3 char shorter than maxColLength gets padded with 2 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aa", "bbbbb", "ccccc" ]
        ]);

        assert.equal(sut.getRightPadding(" ", table, 1, 0), "  ");
    });

    test("getLeftPadding() First column 3 char shorter than maxColLength gets padded with 2 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aa", "bbbbb", "ccccc" ]
        ]);

        assert.equal(sut.getLeftPadding(" ", table, 1, 0), "  ");
    });

    test("getRightPadding() First column 4 char shorter than maxColLength gets padded with 3 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "a", "bbbbb", "ccccc" ]
        ]);

        assert.equal(sut.getRightPadding(" ", table, 1, 0), "   ");
    });

    test("getLeftPadding() First column 4 char shorter than maxColLength gets padded with 2 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "a", "bbbbb", "ccccc" ]
        ]);

        assert.equal(sut.getLeftPadding(" ", table, 1, 0), "  ");
    });

    test("getRightPadding() First column is empty string gets padded with 3 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "", "bbbbb", "ccccc" ]
        ]);

        assert.equal(sut.getRightPadding(" ", table, 1, 0), "   ");
    });

    test("getLeftPadding() First column is empty string gets padded with 3 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "", "bbbbb", "ccccc" ]
        ]);

        assert.equal(sut.getLeftPadding(" ", table, 1, 0), "   ");
    });

    function createCalculator(): FirstColumnPadCalculator {
        return new FirstColumnPadCalculator();
    }

    function tableFor(rows: string[][]) {
        const alignments: Alignment[] = rows[0].map(r => Alignment.Center);
        return new Table(rows.map(row => new Row(row.map(c  => new Cell(c)), "\r\n")), "\r\n", alignments);
    }
});