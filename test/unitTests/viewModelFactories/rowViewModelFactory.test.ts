import * as assert from 'assert';
import { IMock, Mock, It, Times } from "typemoq";
import { assertExt } from "../../assertExtensions";
import { PadCalculator } from '../../../src/padCalculator';
import { RowViewModelFactory } from '../../../src/viewModelFactories/rowViewModelFactory';
import { Table } from '../../../src/models/table';
import { Alignment } from '../../../src/models/alignment';
import { Cell } from '../../../src/models/cell';

suite("RowViewModelFactory.buildRow() tests", () => {
    let _padCalculator: IMock<PadCalculator>;

    setup(() => {
        _padCalculator = Mock.ofType<PadCalculator>();
    });

    test("padCalculator called for all columns with expected values", () => {
        const sut = createFactory(_padCalculator.object);
        const row = 1;
        const table = threeColumnTable();

        const rowViewModel = sut.buildRow(row, table);

        _padCalculator.verify(_ => _.getLeftPadding(" ", table, row, 0), Times.once());
        _padCalculator.verify(_ => _.getLeftPadding(" ", table, row, 1), Times.once());
        _padCalculator.verify(_ => _.getLeftPadding(" ", table, row, 2), Times.once());

        _padCalculator.verify(_ => _.getRightPadding(" ", table, row, 0), Times.once());
        _padCalculator.verify(_ => _.getRightPadding(" ", table, row, 1), Times.once());
        _padCalculator.verify(_ => _.getRightPadding(" ", table, row, 2), Times.once());
    });

    test("value returned from padCalculator.getLeftPadding is used to start the row value", () => {
        const sut = createFactory(_padCalculator.object);
        const row = 1;
        const table = threeColumnTable();
        _padCalculator.setup(_ => _.getLeftPadding(It.isAny(), It.isAny(), It.isAny(), It.isAny())).returns(() => "test");
        
        const rowViewModel = sut.buildRow(row, table);

        assert.equal(rowViewModel.getValueAt(1).startsWith("test"), true);
    });

    test("value returned from padCalculator.getRightPadding is used to end the row value", () => {
        const sut = createFactory(_padCalculator.object);
        const row = 1;
        const table = threeColumnTable();
        _padCalculator.setup(_ => _.getRightPadding(It.isAny(), It.isAny(), row, It.isAny())).returns(() => "test");
        
        const rowViewModel = sut.buildRow(row, table);

        assert.equal(rowViewModel.getValueAt(1).endsWith("test"), true);
    });

    test("Empty middle column is tranformed into a single space", () => {
        const sut = createFactory(_padCalculator.object);
        const row = 1;
        const table = threeColumnTableWithEmptyMiddleColumn();
        _padCalculator.setup(_ => _.getLeftPadding(It.isAny(), It.isAny(), It.isAny(), It.isAny())).returns(() => "L");
        _padCalculator.setup(_ => _.getRightPadding(It.isAny(), It.isAny(), row, It.isAny())).returns(() => "R");
        
        const rowViewModel = sut.buildRow(row, table);

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(1), "L R");
    });
});

suite("RowViewModelFactory.buildSeparator() tests", () => {
    let _padCalculator: IMock<PadCalculator>;

    setup(() => {
        _padCalculator = Mock.ofType<PadCalculator>();
    });

    test("padCalculator called for all columns with expected values", () => {
        const sut = createFactory(_padCalculator.object);
        const table = threeColumnTable();

        const separatorRowViewModel = sut.buildSeparator(table);

        _padCalculator.verify(_ => _.getLeftPadding("-", It.isAny(), It.isAny(), 0), Times.once());
        _padCalculator.verify(_ => _.getLeftPadding("-", It.isAny(), It.isAny(), 1), Times.once());
        _padCalculator.verify(_ => _.getLeftPadding("-", It.isAny(), It.isAny(), 2), Times.once());

        _padCalculator.verify(_ => _.getRightPaddingForSeparator("-", It.isAny(), 0), Times.once());
        _padCalculator.verify(_ => _.getRightPaddingForSeparator("-", It.isAny(), 1), Times.once());
        _padCalculator.verify(_ => _.getRightPaddingForSeparator("-", It.isAny(), 2), Times.once());
    });

    test("value returned from padCalculator.getLeftPadding is used to start the row value", () => {
        const sut = createFactory(_padCalculator.object);
        const table = threeColumnTable();
        _padCalculator.setup(_ => _.getLeftPadding("-", It.isAny(), It.isAny(), 0)).returns(() => "test");

        const separatorRowViewModel = sut.buildSeparator(table);

        assert.equal(separatorRowViewModel.getValueAt(0).startsWith("test"), true);
    });

    test("value returned from padCalculator.getRightPadding is used to end the row value", () => {
        const sut = createFactory(_padCalculator.object);
        const table = threeColumnTable();
        _padCalculator.setup(_ => _.getRightPaddingForSeparator(It.isAny(), It.isAny(), It.isAny())).returns(() => "test");

        const separatorRowViewModel = sut.buildSeparator(table);

        assert.equal(separatorRowViewModel.getValueAt(1).endsWith("test"), true);
    });

    test("Empty middle column is tranformed into a single separator dash", () => {
        const sut = createFactory(_padCalculator.object);
        const table = threeColumnTableWithEmptyMiddleColumn();
        _padCalculator.setup(_ => _.getLeftPadding("-", It.isAny(), It.isAny(), It.isAny())).returns(() => "L");
        _padCalculator.setup(_ => _.getRightPaddingForSeparator("-", It.isAny(), It.isAny())).returns(() => "R");

        const separatorRowViewModel = sut.buildSeparator(table);

        assertExt.isNotNull(separatorRowViewModel);
        assert.equal(separatorRowViewModel.getValueAt(1), "LR");
    });
});

function threeColumnTable(): Table {
    return tableFor([
        [ "aaaaa", "bbbbb", "ccccc" ],
        [ "aaaaa", "bbbbb", "ccccc" ]
    ]);
}

function threeColumnTableWithEmptyMiddleColumn(): Table {
    return tableFor([
        [ "aaaaa", "", "ccccc" ],
        [ "aaaaa", "", "ccccc" ]
    ]);
}

function tableFor(rows: string[][]) {
    const alignments: Alignment[] = rows[0].map(r => Alignment.Left);
    let table = new Table(rows.map(row => row.map(c  => new Cell(c))), alignments);
    return table;
}

function createFactory(padCalculator: PadCalculator): RowViewModelFactory {
    return new RowViewModelFactory(padCalculator);
}