import * as assert from 'assert';
import { IMock, Mock, It, Times } from 'typemoq';
import { ContentPadCalculator } from "../../../src/padCalculation/contentPadCalculator";
import { Table } from '../../../src/models/table';
import { Alignment } from '../../../src/models/alignment';
import { Cell } from '../../../src/models/cell';
import { PadCalculatorSelector } from '../../../src/padCalculation/padCalculatorSelector';
import { BasePadCalculator } from '../../../src/padCalculation/basePadCalculator';
import { PadCalculator } from '../../../src/padCalculation/padCalculator';

suite("ContentPadCalculator tests", () => {

    let _selector: IMock<PadCalculatorSelector>;
    let _mockCalculator: IMock<BasePadCalculator>;

    setup(() => {
        _selector = Mock.ofType<PadCalculatorSelector>();
        _mockCalculator = Mock.ofType<BasePadCalculator>();
    });

    test("getLeftPadding() Uses selector and returns left padding from the pad calculator chosen by the selector", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);
        _selector.setup(_ => _.select(table, It.isAny())).returns(() => _mockCalculator.object).verifiable(Times.once());
        _mockCalculator.setup(_ => _.getLeftPadding(It.isAny(), table, It.isAny(), It.isAny())).returns(() => "test").verifiable(Times.once());

        const pad = sut.getLeftPadding(table, 1, 2);

        assert.equal(pad, "test");
        _selector.verifyAll();
        _mockCalculator.verifyAll();
    });

    test("getRightPadding() Uses selector and returns right padding from the pad calculator chosen by the selector", () => {
        const sut = createCalculator();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);
        _selector.setup(_ => _.select(table, It.isAny())).returns(() => _mockCalculator.object).verifiable(Times.once());
        _mockCalculator.setup(_ => _.getRightPadding(It.isAny(), table, 1, 2)).returns(() => "foo bar").verifiable(Times.once());

        const pad = sut.getRightPadding(table, 1, 2);

        assert.equal(pad, "foo bar");
        _selector.verifyAll();
        _mockCalculator.verifyAll();
    });

    function tableFor(rows: string[][]) {
        const alignments: Alignment[] = rows[0].map(() => Alignment.Left);
        let table = new Table(rows.map(row => row.map(c  => new Cell(c))), alignments);
        return table;
    }

    function createCalculator(): PadCalculator { 
        return new ContentPadCalculator(_selector.object, " "); 
    }
});