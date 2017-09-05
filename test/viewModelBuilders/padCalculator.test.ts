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

    test("getRightPadding() First column right padded with one character", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 5], false, false);

        const pad = sut.getRightPadding(" ", param, 0);

        assert.equal(pad, " ");
    });

    test("getRightPadding() Middle column right padded with 1 character", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 5], false, false);

        const pad = sut.getRightPadding(" ", param, 1);

        assert.equal(pad, " ");
    });

    test("getRightPadding() Last column not right padded", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 5], false, false);

        const pad = sut.getRightPadding(" ", param, 1);

        assert.equal(pad, "");
    });

    test("getRightPadding() First column has no right padding if empty", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([0, 5, 5], false, false);

        const pad = sut.getRightPadding(" ", param, 0);

        assert.equal(pad, "");
    });

    test("getLeftPadding() Last column has no left padding if empty", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([5, 5, 0], false, false);

        const pad = sut.getLeftPadding(" ", param, 2);

        assert.equal(pad, "");
    });

    test("Regular middle gets padded both left and right with 1 space", () => {
        const sut = createCalculator();
        let param = new RowViewModelBuilderParam([0, 5, 5], false, false);

        const leftPad = sut.getLeftPadding(" ", param, 1);
        const rightPad = sut.getRightPadding(" ", param, 1);

        assert.equal(leftPad, " ");
        assert.equal(rightPad, "    ");
    });

    function createCalculator(): PadCalculator { 
        return new PadCalculator(); 
    }
});