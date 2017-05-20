import * as assert from 'assert';
import { RowValue } from "../../src/viewModelBuilders/rowValue";
import { RowViewModelBuilder } from "../../src/viewModelBuilders/rowViewModelBuilder";

suite("RowViewModelBuilder.buildRow() tests", () => {

    test("First column not left padded", () => {
        const inputRows: RowValue[] = [
            new RowValue("c1", 5),
            new RowValue("c1", 5),
            new RowValue("c2", 5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(0).startsWith("c1"), true);
    });

    test("Middle column left padded with 1 space", () => {
        const inputRows: RowValue[] = [
            new RowValue("c1", 5),
            new RowValue("c1", 5),
            new RowValue("c2", 5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(1).startsWith(" c1"), true);
    });

    test("Last column left padded with 1 space", () => {
        const inputRows: RowValue[] = [
            new RowValue("c1", 5),
            new RowValue("c1", 5),
            new RowValue("c2", 5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(2).startsWith(" c1"), true);
    });

    test("First column right padded with one space", () => {
        const inputRows: RowValue[] = [
            new RowValue("c1", 5),
            new RowValue("c1", 5),
            new RowValue("c2", 5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(0).endsWith("    "), true);
    });

    test("Middle column right padded with 1 space", () => {
        const inputRows: RowValue[] = [
            new RowValue("c1", 5),
            new RowValue("c1", 5),
            new RowValue("c2", 5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(1).endsWith("    "), true);
    });

    test("Last column not right padded", () => {
        const inputRows: RowValue[] = [
            new RowValue("c1", 5),
            new RowValue("c1", 5),
            new RowValue("c2", 5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(2).endsWith("c1"), true);
    });

    test("First column has no right padding if empty", () => {
        const inputRows: RowValue[] = [
            new RowValue("", 0),
            new RowValue("c1", 5),
            new RowValue("c2", 5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(0), "");
    });

    test("Last column has no left padding if empty", () => {
        const inputRows: RowValue[] = [
            new RowValue("c1", 5),
            new RowValue("c1", 5),
            new RowValue("", 0)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(2), "");
    });

    test("Empty middle column should be 3 spaces long", () => {
        const inputRows: RowValue[] = [
            new RowValue("c1", 5),
            new RowValue("", 0),
            new RowValue("c1", 5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(1), "   ");
    });

    test("Regular middle gets padded both left and right with 1 space", () => {
        const inputRows: RowValue[] = [
            new RowValue("c1", 5),
            new RowValue("c1", 5),
            new RowValue("c1", 5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(1), " c1    ");
    });

    test("Four columns with no empty first or last columns, all columns are padded correctly", () => {
        const inputRows: RowValue[] = [
            new RowValue("col1", 5),
            new RowValue("", 0),
            new RowValue("c3", 8),
            new RowValue("c4", 5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(0), "col1  ");
        assert.equal(rowViewModel.getValueAt(1), "   ");
        assert.equal(rowViewModel.getValueAt(2), " c3       ");
        assert.equal(rowViewModel.getValueAt(3), " c4");
    });

    test("Four columns with empty first and non-empty last, all columns are padded correctly", () => {
        const inputRows: RowValue[] = [
            new RowValue("", 0),
            new RowValue("c2", 4),
            new RowValue("c3", 8),
            new RowValue("c4", 5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(0), "");
        assert.equal(rowViewModel.getValueAt(1), " c2   ");
        assert.equal(rowViewModel.getValueAt(2), " c3       ");
        assert.equal(rowViewModel.getValueAt(3), " c4");
    });

    test("Four columns with non-empty first and empty last, all columns are padded correctly", () => {
        const inputRows: RowValue[] = [
            new RowValue("c1", 3),
            new RowValue("c2", 3),
            new RowValue("c3", 4),
            new RowValue("", 0)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(0), "c1  ");
        assert.equal(rowViewModel.getValueAt(1), " c2  ");
        assert.equal(rowViewModel.getValueAt(2), " c3   ");
        assert.equal(rowViewModel.getValueAt(3), "");
    });

    function createBuilder(): RowViewModelBuilder {
        return new RowViewModelBuilder();
    }
});