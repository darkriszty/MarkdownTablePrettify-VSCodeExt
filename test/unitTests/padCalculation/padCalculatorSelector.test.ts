import * as assert from 'assert';
import { PadCalculatorSelector } from '../../../src/padCalculation/padCalculatorSelector';
import { Table } from '../../../src/models/table';
import { Alignment } from '../../../src/models/alignment';
import { Cell } from '../../../src/models/cell';
import { Row } from '../../../src/models/row';
import * as LeftAlignment from '../../../src/padCalculation/left';
import * as RightAlignment from '../../../src/padCalculation/right';
import * as CenterAlignment from '../../../src/padCalculation/center';

suite("PadCalculatorSelector tests", () => {

    test("select() First column with left alignment in bordered table returns left first column calculator", () => {
        const sut = createSelector();
        const table = createTable([["a", "b", "c"]], [Alignment.Left, Alignment.Left, Alignment.Left]);
        table.hasLeftBorder = true;

        const calculator = sut.select(table, 0);

        assert.ok(calculator instanceof LeftAlignment.FirstColumnPadCalculator);
    });

    test("select() First column with center alignment in bordered table returns center first column calculator", () => {
        const sut = createSelector();
        const table = createTable([["a", "b", "c"]], [Alignment.Center, Alignment.Left, Alignment.Left]);
        table.hasLeftBorder = true;

        const calculator = sut.select(table, 0);

        assert.ok(calculator instanceof CenterAlignment.FirstColumnPadCalculator);
    });

    test("select() First column with right alignment in bordered table returns right first column calculator", () => {
        const sut = createSelector();
        const table = createTable([["a", "b", "c"]], [Alignment.Right, Alignment.Left, Alignment.Left]);
        table.hasLeftBorder = true;

        const calculator = sut.select(table, 0);

        assert.ok(calculator instanceof RightAlignment.FirstColumnPadCalculator);
    });

    test("select() First column with left alignment in unbordered table returns left first column calculator", () => {
        const sut = createSelector();
        const table = createTable([["a", "b", "c"]], [Alignment.Left, Alignment.Left, Alignment.Left]);
        table.hasLeftBorder = false;

        const calculator = sut.select(table, 0);

        assert.ok(calculator instanceof LeftAlignment.FirstColumnPadCalculator);
    });

    test("select() First column with center alignment in unbordered table returns left first column calculator", () => {
        const sut = createSelector();
        const table = createTable([["a", "b", "c"]], [Alignment.Center, Alignment.Left, Alignment.Left]);
        table.hasLeftBorder = false;

        const calculator = sut.select(table, 0);

        assert.ok(calculator instanceof LeftAlignment.FirstColumnPadCalculator);
    });

    test("select() First column with right alignment in unbordered table returns left first column calculator", () => {
        const sut = createSelector();
        const table = createTable([["a", "b", "c"]], [Alignment.Right, Alignment.Left, Alignment.Left]);
        table.hasLeftBorder = false;

        const calculator = sut.select(table, 0);

        assert.ok(calculator instanceof LeftAlignment.FirstColumnPadCalculator);
    });

    test("select() Middle column with left alignment returns left middle column calculator", () => {
        const sut = createSelector();
        const table = createTable([["a", "b", "c"]], [Alignment.Left, Alignment.Left, Alignment.Left]);

        const calculator = sut.select(table, 1);

        assert.ok(calculator instanceof LeftAlignment.MiddleColumnPadCalculator);
    });

    test("select() Middle column with center alignment returns center middle column calculator", () => {
        const sut = createSelector();
        const table = createTable([["a", "b", "c"]], [Alignment.Left, Alignment.Center, Alignment.Left]);

        const calculator = sut.select(table, 1);

        assert.ok(calculator instanceof CenterAlignment.MiddleColumnPadCalculator);
    });

    test("select() Middle column with right alignment returns right middle column calculator", () => {
        const sut = createSelector();
        const table = createTable([["a", "b", "c"]], [Alignment.Left, Alignment.Right, Alignment.Left]);

        const calculator = sut.select(table, 1);

        assert.ok(calculator instanceof RightAlignment.MiddleColumnPadCalculator);
    });

    test("select() Last column with left alignment returns left last column calculator", () => {
        const sut = createSelector();
        const table = createTable([["a", "b", "c"]], [Alignment.Left, Alignment.Left, Alignment.Left]);

        const calculator = sut.select(table, 2);

        assert.ok(calculator instanceof LeftAlignment.LastColumnPadCalculator);
    });

    test("select() Last column with center alignment returns center last column calculator", () => {
        const sut = createSelector();
        const table = createTable([["a", "b", "c"]], [Alignment.Left, Alignment.Left, Alignment.Center]);

        const calculator = sut.select(table, 2);

        assert.ok(calculator instanceof CenterAlignment.LastColumnPadCalculator);
    });

    test("select() Last column with right alignment returns right last column calculator", () => {
        const sut = createSelector();
        const table = createTable([["a", "b", "c"]], [Alignment.Left, Alignment.Left, Alignment.Right]);

        const calculator = sut.select(table, 2);

        assert.ok(calculator instanceof RightAlignment.LastColumnPadCalculator);
    });

    function createSelector(): PadCalculatorSelector {
        return new PadCalculatorSelector();
    }

    function createTable(rows: string[][], alignments: Alignment[]): Table {
        const table = new Table(
            rows.map(row => new Row(row.map(c => new Cell(c)), "\r\n")), 
            "\r\n", 
            alignments
        );
        return table;
    }
});
