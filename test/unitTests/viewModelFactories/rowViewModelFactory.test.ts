import * as assert from 'assert';
import { IMock, Mock, It, Times } from "typemoq";
import { assertExt } from "../../assertExtensions";
import { PadCalculator } from "../../../src/padCalculation/padCalculator";
import { RowViewModelFactory } from '../../../src/viewModelFactories/rowViewModelFactory';
import { Table } from '../../../src/models/table';
import { Alignment } from '../../../src/models/alignment';
import { Cell } from '../../../src/models/cell';

suite("RowViewModelFactory.buildRow() tests", () => {
    let _contentPadCalculator: IMock<PadCalculator>;
    let _separatorPadCalculator: IMock<PadCalculator>;

    setup(() => {
        _contentPadCalculator = Mock.ofType<PadCalculator>();
        _separatorPadCalculator = Mock.ofType<PadCalculator>();
    });

    test("padCalculator called for all columns with expected values", () => {
        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object);
        const row = 1;
        const table = threeColumnTable();

        const rowViewModel = sut.buildRow(row, table);

        _contentPadCalculator.verify(_ => _.getLeftPadding(table, row, 0), Times.once());
        _contentPadCalculator.verify(_ => _.getLeftPadding(table, row, 1), Times.once());
        _contentPadCalculator.verify(_ => _.getLeftPadding(table, row, 2), Times.once());

        _contentPadCalculator.verify(_ => _.getRightPadding(table, row, 0), Times.once());
        _contentPadCalculator.verify(_ => _.getRightPadding(table, row, 1), Times.once());
        _contentPadCalculator.verify(_ => _.getRightPadding(table, row, 2), Times.once());
    });

    test("value returned from padCalculator.getLeftPadding is used to start the row value", () => {
        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object);
        const row = 1;
        const table = threeColumnTable();
        _contentPadCalculator.setup(_ => _.getLeftPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "test");
        
        const rowViewModel = sut.buildRow(row, table);

        assert.equal(rowViewModel.getValueAt(1).startsWith("test"), true);
    });

    test("value returned from padCalculator.getRightPadding is used to end the row value", () => {
        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object);
        const row = 1;
        const table = threeColumnTable();
        _contentPadCalculator.setup(_ => _.getRightPadding(It.isAny(), row, It.isAny())).returns(() => "test");
        
        const rowViewModel = sut.buildRow(row, table);

        assert.equal(rowViewModel.getValueAt(1).endsWith("test"), true);
    });

    test("Empty middle column uses left and right pad and also the pad char", () => {
        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object);
        const row = 1;
        const table = threeColumnTableWithEmptyMiddleColumn();
        _contentPadCalculator.setup(_ => _.getLeftPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "L");
        _contentPadCalculator.setup(_ => _.getRightPadding(It.isAny(), row, It.isAny())).returns(() => "R");
        _contentPadCalculator.setup(_ => _.getPadChar()).returns(() => "x");
        
        const rowViewModel = sut.buildRow(row, table);

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(1), "LxR");
    });
});

suite("RowViewModelFactory.buildSeparator() tests", () => {
    let _contentPadCalculator: IMock<PadCalculator>;
    let _separatorPadCalculator: IMock<PadCalculator>;

    setup(() => {
        _contentPadCalculator = Mock.ofType<PadCalculator>();
        _separatorPadCalculator = Mock.ofType<PadCalculator>();
    });

    test("padCalculator called for all columns with expected values", () => {
        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object);
        const table = threeColumnTable();

        const separatorRowViewModel = sut.buildSeparator(table);

        _separatorPadCalculator.verify(_ => _.getLeftPadding(It.isAny(), It.isAny(), 0), Times.once());
        _separatorPadCalculator.verify(_ => _.getLeftPadding(It.isAny(), It.isAny(), 1), Times.once());
        _separatorPadCalculator.verify(_ => _.getLeftPadding(It.isAny(), It.isAny(), 2), Times.once());

        _separatorPadCalculator.verify(_ => _.getRightPadding(It.isAny(), It.isAny(), 0), Times.once());
        _separatorPadCalculator.verify(_ => _.getRightPadding(It.isAny(), It.isAny(), 1), Times.once());
        _separatorPadCalculator.verify(_ => _.getRightPadding(It.isAny(), It.isAny(), 2), Times.once());
    });

    test("value returned from padCalculator.getLeftPadding is used to start the row value", () => {
        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object);
        const table = threeColumnTable();
        _separatorPadCalculator.setup(_ => _.getLeftPadding(It.isAny(), It.isAny(), 0)).returns(() => "test");

        const separatorRowViewModel = sut.buildSeparator(table);

        assert.equal(separatorRowViewModel.getValueAt(0).startsWith("test"), true);
    });

    test("value returned from padCalculator.getRightPadding is used to end the row value", () => {
        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object);
        const table = threeColumnTable();
        _separatorPadCalculator.setup(_ => _.getRightPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "test");

        const separatorRowViewModel = sut.buildSeparator(table);

        assert.equal(separatorRowViewModel.getValueAt(1).endsWith("test"), true);
    });

    test("Empty middle column does not use pad char", () => {
        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object);
        const table = threeColumnTableWithEmptyMiddleColumn();
        _separatorPadCalculator.setup(_ => _.getLeftPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "Left");
        _separatorPadCalculator.setup(_ => _.getRightPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "Right");
        _separatorPadCalculator.setup(_ => _.getPadChar()).returns(() => "x");

        const separatorRowViewModel = sut.buildSeparator(table);

        assertExt.isNotNull(separatorRowViewModel);
        assert.equal(separatorRowViewModel.getValueAt(1), "LeftRight");
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

function createFactory(contentPadCalculator: PadCalculator, separatorPadCalculator: PadCalculator): RowViewModelFactory {
    return new RowViewModelFactory(contentPadCalculator, separatorPadCalculator);
}