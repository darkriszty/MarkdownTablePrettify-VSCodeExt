import * as assert from "assert";
import { assertExt } from "../../assertExtensions";
import { IMock, Mock, It, Times } from "typemoq";
import { Table } from "../../../src/models/table";
import { Alignment } from "../../../src/models/alignment";
import { TableViewModel } from "../../../src/viewModels/tableViewModel";
import { RowViewModel } from "../../../src/viewModels/rowViewModel";
import { RowViewModelFactory } from "../../../src/viewModelFactories/rowViewModelFactory";
import { TableViewModelFactory } from "../../../src/viewModelFactories/tableViewModelFactory";
import { Cell } from "../../../src/models/cell";
import { Row } from "../../../src/models/row";

suite("TableViewModelFactory tests", () => {
    let _rowVmb: IMock<RowViewModelFactory>;

    setup(() => {
        _rowVmb = Mock.ofType<RowViewModelFactory>();
    });

    test("build() with calls rowVmb methods", () => {
        const table = tableFor([
            ["c1", "c2"],
            ["v1", "v2"],
            ["v3", "v4"],
        ]);
        const expectedSeparator = new RowViewModel([], [], "");
        const expectedRow = new RowViewModel([], [], "");

        _rowVmb
            .setup(m => m.buildSeparator(It.isAny(), It.isAny()))
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
        const table = tableFor([
            ["c1", "c2"],
            ["v1", "v2"],
            ["v3", "v4"],
        ]);
        const expectedSeparator = new RowViewModel([], [], "");
        const expectedRow = new RowViewModel([], [], "");
        _rowVmb.setup(m => m.buildSeparator(It.isAny(), It.isAny())).returns(() => expectedSeparator)
        _rowVmb.setup(m => m.buildRow(It.isAny(), It.isAny())).returns(() => expectedRow);

        const tableVm = createViewModelFactory().build(table);

        assertExt.isNotNull(tableVm);
        assert.strictEqual(tableVm.header, expectedRow);
        assert.strictEqual(tableVm.separator, expectedSeparator);
        assertExt.isNotNull(tableVm.rows);
        assert.strictEqual(tableVm.rows.length, 2);
        assert.strictEqual(tableVm.rows[0], expectedRow);
        assert.strictEqual(tableVm.rows[1], expectedRow);
    });

    test("build() with table having left border sets hasLeftBorder on viewModel", () => {
        const table = tableFor([
            ["c1", "c2"],
            ["v1", "v2"],
            ["v3", "v4"],
        ]);
        table.hasLeftBorder = true;

        const tableVm = createViewModelFactory().build(table);

        assertExt.isNotNull(tableVm);
        assert.strictEqual(tableVm.hasLeftBorder, true);
    });

    test("build() with table without left border sets hasLeftBorder on viewModel to false", () => {
        const table = tableFor([
            ["c1", "c2"],
            ["v1", "v2"],
            ["v3", "v4"],
        ]);

        const tableVm = createViewModelFactory().build(table);

        assertExt.isNotNull(tableVm);
        assert.strictEqual(tableVm.hasLeftBorder, false);
    });

    test("build() with table having right border sets hasRightBorder on viewModel", () => {
        const table = tableFor([
            ["c1", "c2"],
            ["v1", "v2"],
            ["v3", "v4"],
        ]);
        table.hasRightBorder = true;

        const tableVm = createViewModelFactory().build(table);

        assertExt.isNotNull(tableVm);
        assert.strictEqual(tableVm.hasRightBorder, true);
    });

    test("build() with table without right border sets hasRightBorder on viewModel to false", () => {
        const table = tableFor([
            ["c1", "c2"],
            ["v1", "v2"],
            ["v3", "v4"],
        ]);

        const tableVm = createViewModelFactory().build(table);

        assertExt.isNotNull(tableVm);
        assert.strictEqual(tableVm.hasRightBorder, false);
    });

    test("build() with table without leftPad has a default empty string leftPad on the viewModel", () => {
        const table = tableFor([
            ["c1", "c2"],
            ["v1", "v2"],
            ["v3", "v4"],
        ]);

        const tableVm = createViewModelFactory().build(table);

        assertExt.isNotNull(tableVm);
        assert.strictEqual(tableVm.leftPad, "");
    });

    test("build() with table having leftPad sets leftPad on viewModel", () => {
        const table = tableFor([
            ["c1", "c2"],
            ["v1", "v2"],
            ["v3", "v4"],
        ], "\t");

        const tableVm = createViewModelFactory().build(table);

        assertExt.isNotNull(tableVm);
        assert.strictEqual(tableVm.leftPad, "\t");
    });

    function tableFor(rows: string[][], leftPad: string = "") {
        const alignments: Alignment[] = rows[0].map(r => Alignment.Left);
        return new Table(rows.map(row => new Row(row.map(c => new Cell(c)), "\r\n")), "\r\n", alignments, leftPad);
    }

    function createViewModelFactory(): TableViewModelFactory {
        return new TableViewModelFactory(_rowVmb.object);
    }
});