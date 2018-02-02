import * as assert from 'assert';
import { assertExt } from "../assertExtensions";
import { PadCalculator } from '../../src/padCalculator';
import { Table } from '../../src/models/table';
import { Alignment } from '../../src/models/alignment';

suite("PadCalculator tests", () => {

    test("getLeftPadding() First column not left padded", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aaaaa", "bbbbb", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getLeftPadding(" ", table, 1, 0);

        assert.equal(pad, "");
    });

    test("getLeftPadding() First column left padded with 1 character if there is a left border", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "", "aaaaa", "bbbbb", "ccccc" ],
                [ "", "-", "-", "-" ],
                [ "", "aaaaa", "bbbbb", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getLeftPadding(" ", table, 1, 1);

        assert.equal(pad, " ");
    });

    test("getLeftPadding() Middle column left padded with 1 character", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aaaaa", "bbbbb", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getLeftPadding(" ", table, 1, 1);

        assert.equal(pad, " ");
    });

    test("getLeftPadding() Middle column is empty cell gets left padded with one character", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaa", "bbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "a", "", "c" ]
            ],
            [ Alignment.Left, Alignment.Left, Alignment.Left ]
        );

        const pad = sut.getLeftPadding(" ", table, 1, 1);

        assert.equal(pad, " ");
    });

    test("getLeftPadding() Last column left padded with 1 character", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aaaaa", "bbbbb", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getLeftPadding("X", table, 1, 2);

        assert.equal(pad, "X");
    });

    test("getLeftPadding() Last column has no left padding if empty", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "" ],
                [ "-", "-", "" ],
                [ "a", "b", "" ] 
            ],
            [ Alignment.Left, Alignment.Left, Alignment.Left ]);

        const pad = sut.getLeftPadding(" ", table, 1, 2);

        assert.equal(pad, "");
    });

    test("getRightPadding() First column equal to maxColLength gets right padded with one character", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aaaaa", "bbbbb", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 0);

        assert.equal(pad, " ");
    });

    test("getRightPadding() First column 1 char shorter than maxColLength gets right padded with 2 characters", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aaaa", "bbbbb", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 0);

        assert.equal(pad, "  ");
    });

    test("getRightPadding() First column 2 char shorter than maxColLength gets right padded with 3 characters", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aaa", "bbbbb", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 0);

        assert.equal(pad, "   ");
    });

    test("getRightPadding() First column 3 char shorter than maxColLength gets right padded with 4 characters", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aa", "bbbbb", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 0);

        assert.equal(pad, "    ");
    });

    test("getRightPadding() First column 4 char shorter than maxColLength gets right padded with 5 characters", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "a", "bbbbb", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 0);

        assert.equal(pad, "     ");
    });

    test("getRightPadding() First column is empty string gets right padded with 6 characters", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "", "bbbbb", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 0);

        assert.equal(pad, "      ");
    });

    test("getRightPadding() Middle column is empty cell gets right padded with maxColLength characters", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aaaaa", "", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 1);

        assert.equal(pad, "      ");
    });

    test("getRightPadding() Middle column equal to maxColLength gets right padded with one character", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aaaaa", "bbbbb", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 1);

        assert.equal(pad, " ");
    });

    test("getRightPadding() Middle column 1 char shorter than maxColLength gets right padded with 2 characters", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aaaaa", "bbbb", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 1);

        assert.equal(pad, "  ");
    });

    test("getRightPadding() Middle column 2 char shorter than maxColLength gets right padded with 3 characters", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aaaaa", "bbb", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 1);

        assert.equal(pad, "   ");
    });

    test("getRightPadding() Middle column 3 char shorter than maxColLength gets right padded with 4 characters", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aaaaa", "bb", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 1);

        assert.equal(pad, "    ");
    });

    test("getRightPadding() Middle column is empty string gets right padded with maxColLength+1 characters", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aaaaa", "", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 1);

        assert.equal(pad, "      ");
    });

    test("getRightPadding() Middle column with 0 maxLength gets right padded with 1 character", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aaaaa", "", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 1);

        assert.equal(pad, " ");
    });

    test("getRightPadding() Last column not right padded if there's no border", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aaaaa", "bbbbb", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );
        
        const pad = sut.getRightPadding(" ", table, 1, 2);

        assert.equal(pad, "");
    });




    test("getRightPadding() Last column equal to maxColLength gets right padded with one character if there is right border", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc", "" ],
                [ "-", "-", "-", "" ],
                [ "aaaaa", "bbbbb", "ccccc", "" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 2);

        assert.equal(pad, " ");
    });

    test("getRightPadding() Last column 1 char shorter than maxColLength gets right padded with 2 characters if there is right border", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc", "" ],
                [ "-", "-", "-", "" ],
                [ "aaaaa", "bbbbb", "cccc", "" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 2);

        assert.equal(pad, "  ");
    });

    test("getRightPadding() Last column 2 chars shorter than maxColLength gets right padded with 3 characters if there is right border", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc", "" ],
                [ "-", "-", "-", "" ],
                [ "aaaaa", "bbbbb", "ccc", "" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 2);

        assert.equal(pad, "   ");
    });

    test("getRightPadding() Last column 3 char shorter than maxColLength gets right padded with 4 characters if there is right border", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc", "" ],
                [ "-", "-", "-", "" ],
                [ "aaaaa", "bbbbb", "cc", "" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 2);

        assert.equal(pad, "    ");
    });

    test("getRightPadding() Last column is empty string gets right padded with maxColLength+1 characters if there is right border", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc", "" ],
                [ "-", "-", "-", "" ],
                [ "aaaaa", "bbbbb", "", "" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 2);

        assert.equal(pad, "      ");
    });

    test("getRightPadding() Last column with 0 maxLength gets right padded with 1 characters if there is right border", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "", "" ],
                [ "-", "-", "", "" ],
                [ "aaaaa", "bbbbb", "", "" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const pad = sut.getRightPadding(" ", table, 1, 2);

        assert.equal(pad, " ");
    });

    test("getRightPaddingForSeparator() TODO", () => {
        assert.equal(1, 0, "TODO");
    });

    test("Regular middle gets padded both left and right with expected amount", () => {
        const sut = createCalculator();
        const table = new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aaaaa", "b", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );

        const leftPad = sut.getLeftPadding(" ", table, 1, 1);
        const rightPad = sut.getRightPadding(" ", table, 1, 1);

        assert.equal(leftPad, " ");
        assert.equal(rightPad, "     ");
    });

    function createCalculator(): PadCalculator { 
        return new PadCalculator(); 
    }
});