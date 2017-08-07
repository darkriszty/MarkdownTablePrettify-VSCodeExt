import * as assert from 'assert';
import { assertExt } from "../assertExtensions";
import { RowViewModelBuilder } from "../../src/viewModelBuilders/rowViewModelBuilder";
import { RowViewModelBuilderParam } from "../../src/viewModelBuilders/rowViewModelBuilderParam";

suite("RowViewModelBuilder.buildRow() tests", () => {

    test("First column not left padded", () => {
        const sut = new RowViewModelBuilder();
        let param = new RowViewModelBuilderParam([5, 5, 5]);
        param.rowValues = ["c1", "c2", "c3"];

        const rowViewModel = sut.buildRow(param);

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(0).startsWith("c1"), true);
    });

    test("Middle column left padded with 1 space", () => {
        const sut = new RowViewModelBuilder();
        let param = new RowViewModelBuilderParam([5, 5, 5]);
        param.rowValues = ["c1", "c2", "c3"];

        const rowViewModel = sut.buildRow(param);

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(1).startsWith(" c2"), true);
    });

    test("Last column left padded with 1 space", () => {
        const sut = new RowViewModelBuilder();
        let param = new RowViewModelBuilderParam([5, 5, 5]);
        param.rowValues = ["c1", "c2", "c3"];

        const rowViewModel = sut.buildRow(param);

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(2).startsWith(" c3"), true);
    });

    test("First column right padded with one space", () => {
        const sut = new RowViewModelBuilder();
        let param = new RowViewModelBuilderParam([5, 5, 5]);
        param.rowValues = ["c1", "c2", "c3"];

        const rowViewModel = sut.buildRow(param);

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(0).endsWith("    "), true);
    });

    test("Middle column right padded with 1 space", () => {
        const sut = new RowViewModelBuilder();
        let param = new RowViewModelBuilderParam([5, 5, 5]);
        param.rowValues = ["c1", "c2", "c3"];

        const rowViewModel = sut.buildRow(param);

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(1).endsWith("    "), true);
    });

    test("Last column not right padded", () => {
        const sut = new RowViewModelBuilder();
        let param = new RowViewModelBuilderParam([5, 5, 5]);
        param.rowValues = ["c1", "c2", "c3"];

        const rowViewModel = sut.buildRow(param);

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(2).endsWith("c3"), true);
    });

    test("First column has no right padding if empty", () => {
        const sut = new RowViewModelBuilder();
        let param = new RowViewModelBuilderParam([0, 5, 5]);
        param.rowValues = ["", "c2", "c3"];

        const rowViewModel = sut.buildRow(param);
        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(0), "");
    });

    test("Last column has no left padding if empty", () => {
        const sut = new RowViewModelBuilder();
        let param = new RowViewModelBuilderParam([5, 5, 0]);
        param.rowValues = ["c1", "c2", ""];
        const rowViewModel = sut.buildRow(param);

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(2), "");
    });

    test("Empty middle column should be 3 spaces long", () => {
        const sut = new RowViewModelBuilder();
        let param = new RowViewModelBuilderParam([5, 0, 5]);
        param.rowValues = ["c1", "", "c3"];
        const rowViewModel = sut.buildRow(param);

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(1), "   ");
    });

    test("Regular middle gets padded both left and right with 1 space", () => {
        const sut = new RowViewModelBuilder();
        let param = new RowViewModelBuilderParam([5, 5, 5]);
        param.rowValues = ["c1", "c1", "c1"];
        const rowViewModel = sut.buildRow(param);

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(1), " c1    ");
    });

    test("Four columns with no empty first or last columns, all columns are padded correctly", () => {
        const sut = new RowViewModelBuilder();
        let param = new RowViewModelBuilderParam([5, 0, 8, 5]);
        param.rowValues = ["col1", "", "c3", "c4"];
        const rowViewModel = sut.buildRow(param);

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(0), "col1  ");
        assert.equal(rowViewModel.getValueAt(1), "   ");
        assert.equal(rowViewModel.getValueAt(2), " c3       ");
        assert.equal(rowViewModel.getValueAt(3), " c4");
    });

    test("Four columns with empty first and non-empty last, all columns are padded correctly", () => {
        const sut = new RowViewModelBuilder();
        let param = new RowViewModelBuilderParam([0, 4, 8, 5]);
        param.rowValues = ["", "c2", "c3", "c4"];
        const rowViewModel = sut.buildRow(param);

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(0), "");
        assert.equal(rowViewModel.getValueAt(1), " c2   ");
        assert.equal(rowViewModel.getValueAt(2), " c3       ");
        assert.equal(rowViewModel.getValueAt(3), " c4");
    });

    test("Four columns with non-empty first and empty last, all columns are padded correctly", () => {
        const sut = new RowViewModelBuilder();
        let param = new RowViewModelBuilderParam([3, 3, 3, 0]);
        param.rowValues = ["c1", "c2", "c3", ""];
        const rowViewModel = sut.buildRow(param);

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(0), "c1  ");
        assert.equal(rowViewModel.getValueAt(1), " c2  ");
        assert.equal(rowViewModel.getValueAt(2), " c3  ");
        assert.equal(rowViewModel.getValueAt(3), "");
    });

    test("TODO: add tests when there is left border and right border", () => {
        assert.equal(1, 0);
    });

});

suite("RowViewModelBuilder.buildSeparator() tests", () => {

    test("Regular first column not left padded and right padded with 1 dash", () => {
        const sut = new RowViewModelBuilder();

        const rowViewModel = sut.buildSeparator(new RowViewModelBuilderParam([5, 5, 5]));

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(0), "------");
    });

    test("Regular middle column left and right padded 1 dash each", () => {
        const sut = new RowViewModelBuilder();

        const rowViewModel = sut.buildSeparator(new RowViewModelBuilderParam([5, 5, 5]));

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(1), "-------");
    });

    test("Regular last column left and right padded with 1 dash each", () => {
        const sut = new RowViewModelBuilder();

        const rowViewModel = sut.buildSeparator(new RowViewModelBuilderParam([5, 5, 5]));

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(2), "-------");
    });

    test("Empty first column has no padding", () => {
        const sut = new RowViewModelBuilder();

        const rowViewModel = sut.buildSeparator(new RowViewModelBuilderParam([0, 5, 5]));

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(0), "");
    });

    test("Empty middle column should be 3 dashes long", () => {
        const sut = new RowViewModelBuilder();

        const rowViewModel = sut.buildSeparator(new RowViewModelBuilderParam([5, 0, 5]));

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(1), "---");
    });

    test("Empty last column has no padding", () => {
        const sut = new RowViewModelBuilder();

        const rowViewModel = sut.buildSeparator(new RowViewModelBuilderParam([5, 5, 0]));

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(2), "");
    });

    test("Four columns with no empty first or last columns, all columns are correctly padded with dashes", () => {
        const sut = new RowViewModelBuilder();

        const rowViewModel = sut.buildSeparator(new RowViewModelBuilderParam([5, 0, 8, 5]));

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(0), "------");
        assert.equal(rowViewModel.getValueAt(1), "---");
        assert.equal(rowViewModel.getValueAt(2), "----------");
        assert.equal(rowViewModel.getValueAt(3), "-------");
    });

    test("Four columns with empty first and non-empty last, all columns are correctly padded with dashes", () => {
        const sut = new RowViewModelBuilder();

        const rowViewModel = sut.buildSeparator(new RowViewModelBuilderParam([0, 4, 8, 5]));

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(0), "");
        assert.equal(rowViewModel.getValueAt(1), "------");
        assert.equal(rowViewModel.getValueAt(2), "----------");
        assert.equal(rowViewModel.getValueAt(3), "-------");
    });

    test("Four columns with non-empty first and empty last, all columns are correctly padded with dashes", () => {
        const sut = new RowViewModelBuilder();

        const rowViewModel = sut.buildSeparator(new RowViewModelBuilderParam([3, 3, 3, 0]));

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(0), "----");
        assert.equal(rowViewModel.getValueAt(1), "-----");
        assert.equal(rowViewModel.getValueAt(2), "-----");
        assert.equal(rowViewModel.getValueAt(3), "");
    });

    test("TODO: add tests when there is left border and right border", () => {
        assert.equal(1, 0);
    });
});

function createBuilder(): RowViewModelBuilder {
    var rowVmb = new RowViewModelBuilder();
    return rowVmb;
}