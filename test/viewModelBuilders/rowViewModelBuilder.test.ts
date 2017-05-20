import * as assert from 'assert';
import { RowValue } from "../../src/viewModelBuilders/rowValue";
import { RowViewModelBuilder } from "../../src/viewModelBuilders/rowViewModelBuilder";

suite("RowViewModelBuilder.buildRow() tests", () => {

    test("First column not left padded", () => {
        const inputRows: RowValue[] = [
            new RowValue(5, "c1"),
            new RowValue(5, "c1"),
            new RowValue(5, "c2")
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(0).startsWith("c1"), true);
    });

    test("Middle column left padded with 1 space", () => {
        const inputRows: RowValue[] = [
            new RowValue(5, "c1"),
            new RowValue(5, "c1"),
            new RowValue(5, "c2")
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(1).startsWith(" c1"), true);
    });

    test("Last column left padded with 1 space", () => {
        const inputRows: RowValue[] = [
            new RowValue(5, "c1"),
            new RowValue(5, "c1"),
            new RowValue(5, "c2")
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(2).startsWith(" c1"), true);
    });

    test("First column right padded with one space", () => {
        const inputRows: RowValue[] = [
            new RowValue(5, "c1"),
            new RowValue(5, "c1"),
            new RowValue(5, "c2")
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(0).endsWith("    "), true);
    });

    test("Middle column right padded with 1 space", () => {
        const inputRows: RowValue[] = [
            new RowValue(5, "c1"),
            new RowValue(5, "c1"),
            new RowValue(5, "c2")
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(1).endsWith("    "), true);
    });

    test("Last column not right padded", () => {
        const inputRows: RowValue[] = [
            new RowValue(5, "c1"),
            new RowValue(5, "c1"),
            new RowValue(5, "c2")
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(2).endsWith("c1"), true);
    });

    test("First column has no right padding if empty", () => {
        const inputRows: RowValue[] = [
            new RowValue(0, ""),
            new RowValue(5, "c1"),
            new RowValue(5, "c2")
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(0), "");
    });

    test("Last column has no left padding if empty", () => {
        const inputRows: RowValue[] = [
            new RowValue(5, "c1"),
            new RowValue(5, "c1"),
            new RowValue(0, "")
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(2), "");
    });

    test("Empty middle column should be 3 spaces long", () => {
        const inputRows: RowValue[] = [
            new RowValue(5, "c1"),
            new RowValue(0, ""),
            new RowValue(5, "c1")
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(1), "   ");
    });

    test("Regular middle gets padded both left and right with 1 space", () => {
        const inputRows: RowValue[] = [
            new RowValue(5, "c1"),
            new RowValue(5, "c1"),
            new RowValue(5, "c1")
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(1), " c1    ");
    });

    test("Four columns with no empty first or last columns, all columns are padded correctly", () => {
        const inputRows: RowValue[] = [
            new RowValue(5, "col1"),
            new RowValue(0, ""),
            new RowValue(8, "c3"),
            new RowValue(5, "c4")
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
            new RowValue(0, ""),
            new RowValue(4, "c2"),
            new RowValue(8, "c3"),
            new RowValue(5, "c4")
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
            new RowValue(3, "c1"),
            new RowValue(3, "c2"),
            new RowValue(3, "c3"),
            new RowValue(0, "")
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildRow(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(0), "c1  ");
        assert.equal(rowViewModel.getValueAt(1), " c2  ");
        assert.equal(rowViewModel.getValueAt(2), " c3  ");
        assert.equal(rowViewModel.getValueAt(3), "");
    });

});

suite("RowViewModelBuilder.buildSeparator() tests", () => {

    test("Regular first column not left padded and right padded with 1 dash", () => {
        const inputRows: RowValue[] = [
            new RowValue(5),
            new RowValue(5),
            new RowValue(5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildSeparator(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(0), "------");
    });

    test("Regular middle column left and right padded 1 dash each", () => {
        const inputRows: RowValue[] = [
            new RowValue(5),
            new RowValue(5),
            new RowValue(5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildSeparator(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(1), "-------");
    });

    test("Regular last column left and right padded with 1 dash each", () => {
        const inputRows: RowValue[] = [
            new RowValue(5),
            new RowValue(5),
            new RowValue(5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildSeparator(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(2), "-------");
    });

    test("Empty first column has no padding", () => {
        const inputRows: RowValue[] = [
            new RowValue(0),
            new RowValue(5),
            new RowValue(5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildSeparator(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(0), "");
    });

    test("Empty middle column should be 3 dashes long", () => {
        const inputRows: RowValue[] = [
            new RowValue(5),
            new RowValue(0),
            new RowValue(5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildSeparator(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(1), "---");
    });

    test("Empty last column has no padding", () => {
        const inputRows: RowValue[] = [
            new RowValue(5),
            new RowValue(5),
            new RowValue(0)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildSeparator(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(2), "");
    });

    test("Four columns with no empty first or last columns, all columns are correctly padded with dashes", () => {
        const inputRows: RowValue[] = [
            new RowValue(5),
            new RowValue(0),
            new RowValue(8),
            new RowValue(5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildSeparator(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(0), "------");
        assert.equal(rowViewModel.getValueAt(1), "---");
        assert.equal(rowViewModel.getValueAt(2), "----------");
        assert.equal(rowViewModel.getValueAt(3), "-------");
    });

    test("Four columns with empty first and non-empty last, all columns are correctly padded with dashes", () => {
        const inputRows: RowValue[] = [
            new RowValue(0),
            new RowValue(4),
            new RowValue(8),
            new RowValue(5)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildSeparator(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(0), "");
        assert.equal(rowViewModel.getValueAt(1), "------");
        assert.equal(rowViewModel.getValueAt(2), "----------");
        assert.equal(rowViewModel.getValueAt(3), "-------");
    });

    test("Four columns with non-empty first and empty last, all columns are correctly padded with dashes", () => {
        const inputRows: RowValue[] = [
            new RowValue(3),
            new RowValue(3),
            new RowValue(3),
            new RowValue(0)
        ];
        const sut = createBuilder();

        const rowViewModel = sut.buildSeparator(inputRows);

        assert.equal(rowViewModel != null, true);
        assert.equal(rowViewModel.getValueAt(0), "----");
        assert.equal(rowViewModel.getValueAt(1), "-----");
        assert.equal(rowViewModel.getValueAt(2), "-----");
        assert.equal(rowViewModel.getValueAt(3), "");
    });

});

function createBuilder(): RowViewModelBuilder {
    return new RowViewModelBuilder();
}