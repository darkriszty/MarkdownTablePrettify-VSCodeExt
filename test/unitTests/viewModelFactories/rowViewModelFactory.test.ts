import * as assert from 'assert';
import { IMock, Mock, It, Times } from "typemoq";
import { assertExt } from "../../assertExtensions";
import { PadCalculator } from "../../../src/padCalculation/padCalculator";
import { RowViewModelFactory } from '../../../src/viewModelFactories/rowViewModelFactory';
import { Table } from '../../../src/models/table';
import { Alignment } from '../../../src/models/alignment';
import { Cell } from '../../../src/models/cell';
import { AlignmentMarkerStrategy, IAlignmentMarker } from '../../../src/viewModelFactories/alignmentMarking';

suite("RowViewModelFactory.buildRow() tests", () => {
    let _contentPadCalculator: IMock<PadCalculator>;
    let _separatorPadCalculator: IMock<PadCalculator>;

    setup(() => {
        _contentPadCalculator = Mock.ofType<PadCalculator>();
        _separatorPadCalculator = Mock.ofType<PadCalculator>();
    });

    test("PadCalculator called for all columns with expected values", () => {
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

    test("Value returned from padCalculator.getLeftPadding is used to start the row value", () => {
        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object);
        const row = 1;
        const table = threeColumnTable();
        _contentPadCalculator.setup(_ => _.getLeftPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "test");
        
        const rowViewModel = sut.buildRow(row, table);

        assert.equal(rowViewModel.getValueAt(1).startsWith("test"), true);
    });

    test("Value returned from padCalculator.getRightPadding is used to end the row value", () => {
        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object);
        const row = 1;
        const table = threeColumnTable();
        _contentPadCalculator.setup(_ => _.getRightPadding(It.isAny(), row, It.isAny())).returns(() => "test");
        
        const rowViewModel = sut.buildRow(row, table);

        assert.equal(rowViewModel.getValueAt(1).endsWith("test"), true);
    });

    test("Empty middle column uses only left and right pad to create the value", () => {
        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object);
        const row = 1;
        const table = threeColumnTableWithEmptyMiddleColumn();
        _contentPadCalculator.setup(_ => _.getLeftPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "L");
        _contentPadCalculator.setup(_ => _.getRightPadding(It.isAny(), row, It.isAny())).returns(() => "R");
        _contentPadCalculator.setup(_ => _.getPadChar()).returns(() => "x");
        
        const rowViewModel = sut.buildRow(row, table);

        assertExt.isNotNull(rowViewModel);
        assert.equal(rowViewModel.getValueAt(1), "LR");
    });
});

suite("RowViewModelFactory.buildSeparator() tests", () => {
    let _contentPadCalculator: IMock<PadCalculator>;
    let _separatorPadCalculator: IMock<PadCalculator>;

    setup(() => {
        _contentPadCalculator = Mock.ofType<PadCalculator>();
        _separatorPadCalculator = Mock.ofType<PadCalculator>();
    });

    test("PadCalculator called for all columns with expected values", () => {
        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object);
        const table = threeColumnTable();

        _separatorPadCalculator.setup(_ => _.getLeftPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "");
        _separatorPadCalculator.setup(_ => _.getRightPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "");

        const separatorRowViewModel = sut.buildSeparator(table);

        _separatorPadCalculator.verify(_ => _.getLeftPadding(It.isAny(), It.isAny(), 0), Times.once());
        _separatorPadCalculator.verify(_ => _.getLeftPadding(It.isAny(), It.isAny(), 1), Times.once());
        _separatorPadCalculator.verify(_ => _.getLeftPadding(It.isAny(), It.isAny(), 2), Times.once());

        _separatorPadCalculator.verify(_ => _.getRightPadding(It.isAny(), It.isAny(), 0), Times.once());
        _separatorPadCalculator.verify(_ => _.getRightPadding(It.isAny(), It.isAny(), 1), Times.once());
        _separatorPadCalculator.verify(_ => _.getRightPadding(It.isAny(), It.isAny(), 2), Times.once());
    });

    test("Value returned from padCalculator.getLeftPadding is used to start the row value", () => {
        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object);
        const table = threeColumnTable();

        _separatorPadCalculator.setup(_ => _.getRightPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "");
        _separatorPadCalculator.setup(_ => _.getLeftPadding(It.isAny(), It.isAny(), 0)).returns(() => "test");

        const separatorRowViewModel = sut.buildSeparator(table);

        assert.equal(separatorRowViewModel.getValueAt(0).startsWith("test"), true);
    });

    test("Value returned from padCalculator.getRightPadding is used to end the row value", () => {
        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object);
        const table = threeColumnTable();
        _separatorPadCalculator.setup(_ => _.getRightPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "test");

        const separatorRowViewModel = sut.buildSeparator(table);

        assert.equal(separatorRowViewModel.getValueAt(1).endsWith("test"), true);
    });

    test("Empty middle column uses only left and right pad to create the value", () => {
        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object);
        const table = threeColumnTableWithEmptyMiddleColumn();
        _separatorPadCalculator.setup(_ => _.getLeftPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "Left");
        _separatorPadCalculator.setup(_ => _.getRightPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "Right");
        _separatorPadCalculator.setup(_ => _.getPadChar()).returns(() => "x");

        const separatorRowViewModel = sut.buildSeparator(table);

        assertExt.isNotNull(separatorRowViewModel);
        assert.equal(separatorRowViewModel.getValueAt(1), "LeftRight");
    });

    test("Not set alignment column separator does not contain :", () => {
        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object);
        const table = threeColumnTable(Alignment.NotSet);

        _separatorPadCalculator.setup(_ => _.getLeftPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "--");
        _separatorPadCalculator.setup(_ => _.getRightPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "--");

        const separatorRowViewModel = sut.buildSeparator(table);

        for (let col = 0; col < separatorRowViewModel.columnCount; col++)
            assert.equal(separatorRowViewModel.getValueAt(col), "----");
    });

    test("Calls alignment marker strategy and the marker returned from it", () => {
        const alignment = Alignment.Left;
        let marker = Mock.ofType<IAlignmentMarker>();
        marker.setup(_ => _.mark("abcd")).returns((param) => param).verifiable(Times.exactly(3));
        let alignmentMarkerStrategy = Mock.ofType<AlignmentMarkerStrategy>();
        alignmentMarkerStrategy.setup(_ => _.markerFor(alignment)).returns(() => marker.object).verifiable(Times.exactly(3));

        const sut = createFactory(_contentPadCalculator.object, _separatorPadCalculator.object, alignmentMarkerStrategy.object);
        const table = threeColumnTable(alignment);

        _separatorPadCalculator.setup(_ => _.getLeftPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "ab");
        _separatorPadCalculator.setup(_ => _.getRightPadding(It.isAny(), It.isAny(), It.isAny())).returns(() => "cd");

        sut.buildSeparator(table);

        marker.verifyAll();
        alignmentMarkerStrategy.verifyAll();
    });
});

function threeColumnTable(alignment: Alignment = Alignment.NotSet): Table {
    return tableFor([
        [ "aaaaa", "bbbbb", "ccccc" ],
        [ "aaaaa", "bbbbb", "ccccc" ]
    ], alignment);
}

function threeColumnTableWithEmptyMiddleColumn(alignment: Alignment = Alignment.NotSet): Table {
    return tableFor([
        [ "aaaaa", "", "ccccc" ],
        [ "aaaaa", "", "ccccc" ]
    ], alignment);
}

function tableFor(rows: string[][], alignment: Alignment) {
    const alignments: Alignment[] = rows[0].map(r => alignment);
    let table = new Table(rows.map(row => row.map(c  => new Cell(c))), alignments);
    return table;
}

function createFactory(contentPadCalculator: PadCalculator, separatorPadCalculator: PadCalculator, 
    alignmentStrategy: AlignmentMarkerStrategy = null): RowViewModelFactory 
{
    alignmentStrategy = alignmentStrategy == null ? new AlignmentMarkerStrategy(":") : alignmentStrategy;
    return new RowViewModelFactory(contentPadCalculator, separatorPadCalculator, alignmentStrategy);
}