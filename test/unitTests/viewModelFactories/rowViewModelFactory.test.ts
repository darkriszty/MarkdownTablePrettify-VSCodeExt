import * as assert from 'assert';
import { IMock, Mock, It, Times } from "typemoq";
import { IFunc2 } from 'typemoq/Common/Func';
import { assertExt } from "../../assertExtensions";
import { PadCalculator } from '../../../src/viewModelFactories/padCalculator';
import { RowViewModelFactoryParam } from '../../../src/viewModelFactories/rowViewModelFactoryParam';
import { RowViewModelFactory } from '../../../src/viewModelFactories/rowViewModelFactory';

suite("RowViewModelFactory.buildRow() tests", () => {
    let _padCalculator: IMock<PadCalculator>;

    setup(() => {
        _padCalculator = Mock.ofType<PadCalculator>();
    });

    test("padCalculator called for all columns with expected values", () => {
        const sut = createFactory(_padCalculator.object);
        let param = new RowViewModelFactoryParam([5, 5, 5], false, false);
        param.rowValues = ["c1", "c2", "c3"];

        const rowViewModel = sut.buildRow(param);

        _padCalculator.verify(_ => _.getLeftPadding(" ", param, 0), Times.once());
        _padCalculator.verify(_ => _.getLeftPadding(" ", param, 1), Times.once());
        _padCalculator.verify(_ => _.getLeftPadding(" ", param, 2), Times.once());

        _padCalculator.verify(_ => _.getRightPadding(" ", param, 0), Times.once());
        _padCalculator.verify(_ => _.getRightPadding(" ", param, 1), Times.once());
        _padCalculator.verify(_ => _.getRightPadding(" ", param, 2), Times.once());
    });

    test("value returned from padCalculator.getLeftPadding is used to start the row value", () => {
        const sut = createFactory(_padCalculator.object);
        let param = new RowViewModelFactoryParam([5, 5, 5], false, false);
        param.rowValues = ["c1", "c2", "c3"];
        _padCalculator.setup(_ => _.getLeftPadding(" ", param, 0)).returns(() => "test");
        
        const rowViewModel = sut.buildRow(param);

        assert.equal(rowViewModel.getValueAt(0).startsWith("test"), true);
    });

    test("value returned from padCalculator.getRightPadding is used to end the row value", () => {
        const sut = createFactory(_padCalculator.object);
        let param = new RowViewModelFactoryParam([5, 5, 5], false, false);
        param.rowValues = ["c1", "c2", "c3"];
        _padCalculator.setup(_ => _.getRightPadding(" ", param, 0)).returns(() => "test");
        
        const rowViewModel = sut.buildRow(param);

        assert.equal(rowViewModel.getValueAt(0).endsWith("test"), true);
    });

    test("Empty middle column is tranformed into a single space", () => {
        const sut = createFactory(_padCalculator.object);
        let param = new RowViewModelFactoryParam([5, 0, 5], false, false);
        param.rowValues = ["c1", "", "c3"];
        _padCalculator.setup(_ => _.getLeftPadding(" ", param, 1)).returns(() => "L");
        _padCalculator.setup(_ => _.getRightPadding(" ", param, 1)).returns(() => "R");
        
        const rowViewModel = sut.buildRow(param);

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
        let param = new RowViewModelFactoryParam([5, 5, 5], false, false);

        const separatorRowViewModel = sut.buildSeparator(param);

        _padCalculator.verify(_ => _.getLeftPadding("-", It.isAny(), 0), Times.once());
        _padCalculator.verify(_ => _.getLeftPadding("-", It.isAny(), 1), Times.once());
        _padCalculator.verify(_ => _.getLeftPadding("-", It.isAny(), 2), Times.once());

        _padCalculator.verify(_ => _.getRightPaddingForSeparator("-", It.isAny(), 0), Times.once());
        _padCalculator.verify(_ => _.getRightPaddingForSeparator("-", It.isAny(), 1), Times.once());
        _padCalculator.verify(_ => _.getRightPaddingForSeparator("-", It.isAny(), 2), Times.once());
    });

    test("value returned from padCalculator.getLeftPadding is used to start the row value", () => {
        const sut = createFactory(_padCalculator.object);
        let param = new RowViewModelFactoryParam([5, 5, 5], false, false);
        _padCalculator.setup(_ => _.getLeftPadding("-", It.isAny(), 0)).returns(() => "test");

        const separatorRowViewModel = sut.buildSeparator(param);

        assert.equal(separatorRowViewModel.getValueAt(0).startsWith("test"), true);
    });

    test("value returned from padCalculator.getRightPadding is used to end the row value", () => {
        const sut = createFactory(_padCalculator.object);
        let param = new RowViewModelFactoryParam([5, 5, 5], false, false);
        _padCalculator.setup(_ => _.getRightPaddingForSeparator("-", It.isAny(), 0)).returns(() => "test");

        const separatorRowViewModel = sut.buildSeparator(param);

        assert.equal(separatorRowViewModel.getValueAt(0).endsWith("test"), true);
    });

    test("Empty middle column is tranformed into a single separator dash", () => {
        const sut = createFactory(_padCalculator.object);
        let param = new RowViewModelFactoryParam([5, 0, 5], false, false);
        _padCalculator.setup(_ => _.getLeftPadding("-", It.isAny(), 1)).returns(() => "L");
        _padCalculator.setup(_ => _.getRightPaddingForSeparator("-", It.isAny(), 1)).returns(() => "R");

        const separatorRowViewModel = sut.buildSeparator(param);

        assertExt.isNotNull(separatorRowViewModel);
        assert.equal(separatorRowViewModel.getValueAt(1), "L-R");
    });
});

function createFactory(padCalculator: PadCalculator): RowViewModelFactory {
    return new RowViewModelFactory(padCalculator);
}