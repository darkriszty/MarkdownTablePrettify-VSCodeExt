import * as assert from "assert";
import { assertExt } from "../../assertExtensions";
import { IMock, Mock, It, Times } from "typemoq";
import { Table } from "../../../src/models/table";
import { Alignment } from "../../../src/models/alignment";
import { TableValidator } from "../../../src/modelFactory/tableValidator";
import { TableViewModel } from "../../../src/viewModels/tableViewModel";
import { RowViewModel } from "../../../src/viewModels/rowViewModel";
import { RowViewModelFactory } from "../../../src/viewModelFactories/rowViewModelFactory";
import { PadCalculator } from "../../../src/padCalculator";
import { TableViewModelFactory } from "../../../src/viewModelFactories/tableViewModelFactory";

suite("TableViewModelFactory tests", () => {
    let _rowVmb: IMock<RowViewModelFactory>;

    setup(() => {
        _rowVmb = Mock.ofType<RowViewModelFactory>();
    });

    test("build() with calls rowVmb methods", () => {
        const table = new Table([
            ["c1", "c2"],
            ["--", "--"],
            ["v1", "v2"],
            ["v3", "v4"],
        ], [ Alignment.Left, Alignment.Left ]);
        const expectedSeparator = new RowViewModel([]);
        const expectedRow = new RowViewModel([]);

        _rowVmb
            .setup(m => m.buildSeparator(It.isAny()))
            .returns(() => expectedSeparator)
            .verifiable(Times.once());
        _rowVmb
            .setup(m => m.buildRow(It.isAny(), It.isAny()))
            .returns(() => expectedRow)
            .verifiable(Times.exactly(3));

        const vmb = createViewModelFactory();
        vmb.build(table);

        _rowVmb.verifyAll();
    });

    test("build() returns expected view model properties", () => {
        const table = new Table([
            ["c1", "c2"],
            ["--", "--"],
            ["v1", "v2"],
            ["v3", "v4"],
        ], [ Alignment.Left, Alignment.Left ]);
        const expectedSeparator = new RowViewModel([]);
        const expectedRow = new RowViewModel([]);
        _rowVmb.setup(m => m.buildSeparator(It.isAny())).returns(() => expectedSeparator)
        _rowVmb.setup(m => m.buildRow(It.isAny(), It.isAny())).returns(() => expectedRow);

        const tableVm = createViewModelFactory().build(table);

        assertExt.isNotNull(tableVm);
        assert.equal(tableVm.header, expectedRow);
        assert.equal(tableVm.separator, expectedSeparator);
        assertExt.isNotNull(tableVm.rows);
        assert.equal(tableVm.rows.length, 2);
        assert.equal(tableVm.rows[0], expectedRow);
        assert.equal(tableVm.rows[1], expectedRow);
    });

    test("build() with table having left border sets hasLeftBorder on viewModel", () => {
        const table = new Table([
            ["", "c1", "c2"],
            ["", "--", "--"],
            ["", "v1", "v2"],
            ["", "v3", "v4"],
        ], [ Alignment.Left, Alignment.Left, Alignment.Left ]);
        const expectedSeparator = new RowViewModel([]);
        const expectedRow = new RowViewModel([]);

        const tableVm = createViewModelFactory().build(table);

        assertExt.isNotNull(tableVm);
        assert.equal(tableVm.hasLeftBorder, true);
    });

    test("build() with table without left border sets hasLeftBorder on viewModel to false", () => {
        const table = new Table([
            ["c1", "c2"],
            ["--", "--"],
            ["v1", "v2"],
            ["v3", "v4"],
        ], [ Alignment.Left, Alignment.Left ]);
        const expectedSeparator = new RowViewModel([]);
        const expectedRow = new RowViewModel([]);

        const tableVm = createViewModelFactory().build(table);

        assertExt.isNotNull(tableVm);
        assert.equal(tableVm.hasLeftBorder, false);
    });

    test("build() with table having right border sets hasRightBorder on viewModel", () => {
        const table = new Table([
            ["c1", "c2", ""],
            ["--", "--", ""],
            ["v1", "v2", ""],
            ["v3", "v4", ""],
        ], [ Alignment.Left, Alignment.Left, Alignment.Left ]);
        const expectedSeparator = new RowViewModel([]);
        const expectedRow = new RowViewModel([]);

        const tableVm = createViewModelFactory().build(table);

        assertExt.isNotNull(tableVm);
        assert.equal(tableVm.hasRightBorder, true);
    });

    test("build() with table without right border sets hasRightBorder on viewModel to false", () => {
        const table = new Table([
            ["c1", "c2"],
            ["--", "--"],
            ["v1", "v2"],
            ["v3", "v4"],
        ], [ Alignment.Left, Alignment.Left ]);
        const expectedSeparator = new RowViewModel([]);
        const expectedRow = new RowViewModel([]);

        const tableVm = createViewModelFactory().build(table);

        assertExt.isNotNull(tableVm);
        assert.equal(tableVm.hasRightBorder, false);
    });

    function assertViewModelPropertiesSet(viewModel: TableViewModel) {
        assertExt.isNotNull(viewModel);
        assertExt.isNotNull(viewModel.header);
        assertExt.isNotNull(viewModel.separator);
        assertExt.isNotNull(viewModel.rows);
    }

    function createViewModelFactory(): TableViewModelFactory {
        return new TableViewModelFactory(_rowVmb.object);
    }
});