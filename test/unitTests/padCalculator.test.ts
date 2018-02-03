import * as assert from 'assert';
import { assertExt } from "../assertExtensions";
import { PadCalculator } from '../../src/padCalculator';
import { Table } from '../../src/models/table';
import { Alignment } from '../../src/models/alignment';
import { Cell } from '../../src/models/cell';

suite("PadCalculator tests", () => {

    test("getLeftPadding() First column not left padded", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);

        const pad = sut.getLeftPadding(" ", table, 1, 0);

        assert.equal(pad, "");
    });

    test("getLeftPadding() First column left padded with 1 character if there is a left border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);
        table.hasLeftBorder = true;
        const pad = sut.getLeftPadding(" ", table, 1, 1);

        assert.equal(pad, " ");
    });

    test("getLeftPadding() Middle column left padded with 1 character", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);

        const pad = sut.getLeftPadding(" ", table, 1, 1);

        assert.equal(pad, " ");
    });

    test("getLeftPadding() Middle column is empty cell gets left padded with one character", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaa", "bbbb", "ccccc" ],
            [ "a", "", "c" ]
        ]);

        const pad = sut.getLeftPadding(" ", table, 1, 1);

        assert.equal(pad, " ");
    });

    test("getLeftPadding() Last column left padded with 1 character", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);

        const pad = sut.getLeftPadding("X", table, 1, 2);

        assert.equal(pad, "X");
    });

    test("getRightPadding() First column equal to maxColLength gets right padded with one character", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);

        const pad = sut.getRightPadding(" ", table, 1, 0);

        assert.equal(pad, " ");
    });

    test("getRightPadding() First column 1 char shorter than maxColLength gets right padded with 2 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaa", "bbbbb", "ccccc" ]
        ]);

        const pad = sut.getRightPadding(" ", table, 1, 0);

        assert.equal(pad, "  ");
    });

    test("getRightPadding() First column 2 char shorter than maxColLength gets right padded with 3 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaa", "bbbbb", "ccccc" ]
        ]);

        const pad = sut.getRightPadding(" ", table, 1, 0);

        assert.equal(pad, "   ");
    });

    test("getRightPadding() First column 3 char shorter than maxColLength gets right padded with 4 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aa", "bbbbb", "ccccc" ]
        ]);

        const pad = sut.getRightPadding(" ", table, 1, 0);

        assert.equal(pad, "    ");
    });

    test("getRightPadding() First column 4 char shorter than maxColLength gets right padded with 5 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "a", "bbbbb", "ccccc" ]
        ]);

        const pad = sut.getRightPadding(" ", table, 1, 0);

        assert.equal(pad, "     ");
    });

    test("getRightPadding() First column is empty string gets right padded with 5 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "", "bbbbb", "ccccc" ]
        ]);

        const pad = sut.getRightPadding(" ", table, 1, 0);

        assert.equal(pad, "     ");
    });

    test("getRightPadding() Middle column is empty cell gets right padded with maxColLength-1 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "", "ccccc" ]
        ]);

        const pad = sut.getRightPadding(" ", table, 1, 1);

        assert.equal(pad, "     ");
    });

    test("getRightPadding() Middle column equal to maxColLength gets right padded with one character", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);

        const pad = sut.getRightPadding(" ", table, 1, 1);

        assert.equal(pad, " ");
    });

    test("getRightPadding() Middle column 1 char shorter than maxColLength gets right padded with 2 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbb", "ccccc" ]
        ]);

        const pad = sut.getRightPadding(" ", table, 1, 1);

        assert.equal(pad, "  ");
    });

    test("getRightPadding() Middle column 2 char shorter than maxColLength gets right padded with 3 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbb", "ccccc" ]
        ]);

        const pad = sut.getRightPadding(" ", table, 1, 1);

        assert.equal(pad, "   ");
    });

    test("getRightPadding() Middle column 3 char shorter than maxColLength gets right padded with 4 characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bb", "ccccc" ]
        ]);

        const pad = sut.getRightPadding(" ", table, 1, 1);

        assert.equal(pad, "    ");
    });

    test("getRightPadding() Middle column is empty string gets right padded with maxColLength characters", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "", "ccccc" ]
        ]);

        const pad = sut.getRightPadding(" ", table, 1, 1);

        assert.equal(pad, "     ");
    });

    test("getRightPadding() Middle column with 0 maxLength gets right padded with 1 character", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "", "ccccc" ],
            [ "aaaaa", "", "ccccc" ]
        ]);

        const pad = sut.getRightPadding(" ", table, 1, 1);

        assert.equal(pad, " ");
    });

    test("getRightPadding() Last column not right padded if there's no border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "c" ]
        ]);
        
        const pad = sut.getRightPadding(" ", table, 1, 2);

        assert.equal(pad, "");
    });




    test("getRightPadding() Last column equal to maxColLength gets right padded with one character if there is right border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);
        table.hasRightBorder = true;

        const pad = sut.getRightPadding(" ", table, 1, 2);

        assert.equal(pad, " ");
    });

    test("getRightPadding() Last column 1 char shorter than maxColLength gets right padded with 2 characters if there is right border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "cccc" ]
        ]);
        table.hasRightBorder = true;

        const pad = sut.getRightPadding(" ", table, 1, 2);

        assert.equal(pad, "  ");
    });

    test("getRightPadding() Last column 2 chars shorter than maxColLength gets right padded with 3 characters if there is right border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccc" ]
        ]);
        table.hasRightBorder = true;

        const pad = sut.getRightPadding(" ", table, 1, 2);

        assert.equal(pad, "   ");
    });

    test("getRightPadding() Last column 3 char shorter than maxColLength gets right padded with 4 characters if there is right border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "cc" ]
        ]);
        table.hasRightBorder = true;

        const pad = sut.getRightPadding(" ", table, 1, 2);

        assert.equal(pad, "    ");
    });

    test("getRightPadding() Last column is empty string gets right padded with maxColLength characters if there is right border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "" ]
        ]);
        table.hasRightBorder = true;

        const pad = sut.getRightPadding(" ", table, 1, 2);

        assert.equal(pad, "     ");
    });

    test("getRightPadding() Last column with 0 maxLength gets right padded with 1 characters if there is right border", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "" ],
            [ "aaaaa", "bbbbb", "" ]
        ]);
        table.hasRightBorder = true;

        const pad = sut.getRightPadding(" ", table, 1, 2);

        assert.equal(pad, " ");
    });

    test("getRightPaddingForSeparator() First column gets right padded with maxColLength+1 dashes", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);

        const pad = sut.getRightPaddingForSeparator("-", table, 0);

        assert.equal(pad, "------");
    });

    test("getRightPaddingForSeparator() First column with left border gets right padded with maxColLength+1 dashes", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);
        table.hasLeftBorder = true;
        
        const pad = sut.getRightPaddingForSeparator("-", table, 0);

        assert.equal(pad, "------");
    });

    test("getRightPaddingForSeparator() Middle column gets right padded with maxColLength+1 dashes", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);

        const pad = sut.getRightPaddingForSeparator("-", table, 1);

        assert.equal(pad, "------");
    });

    test("getRightPaddingForSeparator() Empty middle column gets right padded with 2 dashes", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "", "ccccc" ],
            [ "aaaaa", "", "ccccc" ]
        ]);

        const pad = sut.getRightPaddingForSeparator("-", table, 1);

        assert.equal(pad, "--");
    });

    test("getRightPaddingForSeparator() Last column gets right padded with maxColLength+1 dashes", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);

        const pad = sut.getRightPaddingForSeparator("-", table, 2);

        assert.equal(pad, "------");
    });

    test("getRightPaddingForSeparator() Last column with right border gets right padded with maxColLength+1 dashes", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);
        table.hasRightBorder = true;

        const pad = sut.getRightPaddingForSeparator("-", table, 2);

        assert.equal(pad, "------");
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

    function tableFor(rows: string[][]) {
        const alignments: Alignment[] = rows[0].map(r => Alignment.Left);
        let table = new Table(rows.map(row => row.map(c  => new Cell(c))), alignments);
        return table;
    }

    function createCalculator(): PadCalculator { 
        return new PadCalculator(); 
    }
});