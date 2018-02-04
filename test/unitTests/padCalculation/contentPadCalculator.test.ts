import * as assert from 'assert';
import { assertExt } from "../../assertExtensions";
import { ContentPadCalculator } from "../../../src/padCalculation/contentPadCalculator";
import { Table } from '../../../src/models/table';
import { Alignment } from '../../../src/models/alignment';
import { Cell } from '../../../src/models/cell';
import { PadCalculator } from '../../../src/padCalculation/padCalculator';
import { ColumnBasedPadCalculatorSelector } from '../../../src/padCalculation/columnBasedPadCalculatorSelector';

suite("ContentPadCalculator tests", () => {

    function tableFor(rows: string[][]) {
        const alignments: Alignment[] = rows[0].map(r => Alignment.Left);
        let table = new Table(rows.map(row => row.map(c  => new Cell(c))), alignments);
        return table;
    }

    function createCalculator(): PadCalculator { 
        return new ContentPadCalculator(new ColumnBasedPadCalculatorSelector(), " "); 
    }
});