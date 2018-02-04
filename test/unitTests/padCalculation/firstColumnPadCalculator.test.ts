import * as assert from 'assert';
import { assertExt } from "../../assertExtensions";
import { ContentPadCalculator } from "../../../src/padCalculation/contentPadCalculator";
import { Table } from '../../../src/models/table';
import { Alignment } from '../../../src/models/alignment';
import { Cell } from '../../../src/models/cell';
import { PadCalculator } from '../../../src/padCalculation/padCalculator';
import { ColumnBasedPadCalculatorSelector } from '../../../src/padCalculation/columnBasedPadCalculatorSelector';
import { FirstColumnPadCalculator } from '../../../src/padCalculation/firstColumnPadCalculator';

suite("FirstColumnPadCalculator tests", () => {

    test("getLeftPadding() First column not left padded", () => {
        const sut = createSut();
        const table = tableFor([
            [ "aaaaa", "bbbbb", "ccccc" ],
            [ "aaaaa", "bbbbb", "ccccc" ]
        ]);

        const pad = sut.getLeftPadding(" ", table, table.rows[1][0]);

        assert.equal(pad, "");
    });

    function createSut(): FirstColumnPadCalculator {
        return new FirstColumnPadCalculator();
    }

    function tableFor(rows: string[][]) {
        const alignments: Alignment[] = rows[0].map(r => Alignment.Left);
        let table = new Table(rows.map(row => row.map(c  => new Cell(c))), alignments);
        return table;
    }
});