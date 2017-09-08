import * as assert from 'assert';
import { assertExt } from "../assertExtensions";
import { RowViewModelBuilder } from "../../src/viewModelBuilders/rowViewModelBuilder";
import { RowViewModelBuilderParam } from "../../src/viewModelBuilders/rowViewModelBuilderParam";
import { PadCalculator } from "../../src/viewModelBuilders/padCalculator";

suite("PadCalculator tests", () => {

    test("getLeftPadding() First column not left padded", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 5], false, false);

        const pad = sut.getLeftPadding(" ", param, 0);

        assert.equal(pad, "");
    });

    test("getLeftPadding() First column left padded with 1 character if there is a left border", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 5], true, false);

        const pad = sut.getLeftPadding(" ", param, 0);

        assert.equal(pad, " ");
    });

    test("getLeftPadding() Middle column left padded with 1 character", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 5], false, false);

        const pad = sut.getLeftPadding(" ", param, 1);

        assert.equal(pad, " ");
    });

    test("getLeftPadding() Last column left padded with 1 character", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 5], false, false);

        const pad = sut.getLeftPadding("X", param, 2);

        assert.equal(pad, "X");
    });

    test("getLeftPadding() Last column has no left padding if empty", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 0], false, false);

        const pad = sut.getLeftPadding(" ", param, 2);

        assert.equal(pad, "");
    });

    test("getRightPadding() First column equal to maxColLength gets right padded with one character", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 5], false, false);
        param.rowValues = [ "abcde", "b", "c" ];

        const pad = sut.getRightPadding(" ", param, 0);

        assert.equal(pad, " ");
    });

    test("getRightPadding() First column 1 char shorter than maxColLength gets right padded with 2 characters", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 5], false, false);
        param.rowValues = [ "abcd", "b", "c" ];

        const pad = sut.getRightPadding(" ", param, 0);

        assert.equal(pad, "  ");
    });

    test("getRightPadding() First column 2 char shorter than maxColLength gets right padded with 3 characters", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 5], false, false);
        param.rowValues = [ "abc", "b", "c" ];

        const pad = sut.getRightPadding(" ", param, 0);

        assert.equal(pad, "   ");
    });

    test("getRightPadding() First column 3 char shorter than maxColLength gets right padded with 4 characters", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 5], false, false);
        param.rowValues = [ "ab", "b", "c" ];

        const pad = sut.getRightPadding(" ", param, 0);

        assert.equal(pad, "    ");
    });

    test("getRightPadding() First column 4 char shorter than maxColLength gets right padded with 5 characters", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 5], false, false);
        param.rowValues = [ "a", "b", "c" ];

        const pad = sut.getRightPadding(" ", param, 0);

        assert.equal(pad, "     ");
    });

    test("getRightPadding() First column is empty string gets right padded with 6 characters", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 5], false, false);
        param.rowValues = [ "", "b", "c" ];

        const pad = sut.getRightPadding(" ", param, 0);

        assert.equal(pad, "      ");
    });

    test("getRightPadding() Middle column equal to maxColLength gets right padded with one character", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 4, 5], false, false);
        param.rowValues = [ "a", "abcd", "c" ];

        const pad = sut.getRightPadding(" ", param, 1);

        assert.equal(pad, " ");
    });

    test("getRightPadding() Middle column 1 char shorter than maxColLength gets right padded with 2 characters", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 4, 5], false, false);
        param.rowValues = [ "a", "abc", "c" ];

        const pad = sut.getRightPadding(" ", param, 1);

        assert.equal(pad, "  ");
    });

    test("getRightPadding() Middle column 2 char shorter than maxColLength gets right padded with 3 characters", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 4, 5], false, false);
        param.rowValues = [ "a", "ab", "c" ];

        const pad = sut.getRightPadding(" ", param, 1);

        assert.equal(pad, "   ");
    });

    test("getRightPadding() Middle column 3 char shorter than maxColLength gets right padded with 4 characters", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 4, 5], false, false);
        param.rowValues = [ "a", "a", "c" ];

        const pad = sut.getRightPadding(" ", param, 1);

        assert.equal(pad, "    ");
    });

    test("getRightPadding() Middle column is empty string gets right padded with 5 characters", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 4, 5], false, false);
        param.rowValues = [ "a", "", "c" ];

        const pad = sut.getRightPadding(" ", param, 1);

        assert.equal(pad, "     ");
    });

    test("getRightPadding() Middle column with 0 maxLength gets right padded with 2 characters", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 0, 5], false, false);
        param.rowValues = [ "a", "", "c" ];

        const pad = sut.getRightPadding(" ", param, 1);

        assert.equal(pad, "  ");
    });

    test("getRightPadding() Last column not right padded if there's no border", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 5], false, false);

        const pad = sut.getRightPadding(" ", param, 2);

        assert.equal(pad, "");
    });




    test("getRightPadding() Last column equal to maxColLength gets right padded with one character if there is right border", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 4], false, true);
        param.rowValues = [ "a", "b", "abcd" ];

        const pad = sut.getRightPadding(" ", param, 2);

        assert.equal(pad, " ");
    });

    test("getRightPadding() Last column 1 char shorter than maxColLength gets right padded with 2 characters if there is right border", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 4], false, true);
        param.rowValues = [ "a", "b", "abc" ];

        const pad = sut.getRightPadding(" ", param, 2);

        assert.equal(pad, "  ");
    });

    test("getRightPadding() Last column 2 char shorter than maxColLength gets right padded with 3 characters if there is right border", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 4], false, true);
        param.rowValues = [ "a", "b", "ab" ];

        const pad = sut.getRightPadding(" ", param, 2);

        assert.equal(pad, "   ");
    });

    test("getRightPadding() Last column 3 char shorter than maxColLength gets right padded with 4 characters if there is right border", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 4], false, true);
        param.rowValues = [ "a", "b", "a" ];

        const pad = sut.getRightPadding(" ", param, 2);

        assert.equal(pad, "    ");
    });

    test("getRightPadding() Last column is empty string gets right padded with 5 characters if there is right border", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 4], false, true);
        param.rowValues = [ "a", "b", "" ];

        const pad = sut.getRightPadding(" ", param, 2);

        assert.equal(pad, "     ");
    });

    test("getRightPadding() ??? Last column with 0 maxLength gets right padded with 2 characters if there is right border", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 0], false, true);
        param.rowValues = [ "a", "b", "" ];

        const pad = sut.getRightPadding(" ", param, 1);

        assert.equal(pad, "  ");
    });

    test("Regular middle gets padded both left and right with expected amount", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 5], false, false);
        param.rowValues = [ "a", "b", "c" ];

        const leftPad = sut.getLeftPadding(" ", param, 1);
        const rightPad = sut.getRightPadding(" ", param, 1);

        assert.equal(leftPad, " ");
        assert.equal(rightPad, "     ");
    });

    function createCalculator(): PadCalculator { 
        return new PadCalculator(); 
    }
});