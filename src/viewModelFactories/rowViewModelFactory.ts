import { RowViewModel } from "../viewModels/rowViewModel";
import { PadCalculator } from "../padCalculation/padCalculator";
import { Table } from "../models/table";
import { Alignment } from "../models/alignment";
import { AlignmentMarkerStrategy } from "./alignmentMarking";

export class RowViewModelFactory {

    constructor(
        private _contentPadCalculator: PadCalculator,
        private _separatorPadCalculator: PadCalculator,
        private _alignmentMarkerStrategy: AlignmentMarkerStrategy)
    { }

    public buildRow(row: number, table: Table): RowViewModel {
        if (table == null) throw new Error("Paramter can't be null");

        let resultRow = new Array(table.columnCount);

        for(let col = 0; col < table.columnCount; col++)
            resultRow[col] =
                this._contentPadCalculator.getLeftPadding(table, row, col) +
                table.rows[row][col].getValue() +
                this._contentPadCalculator.getRightPadding(table, row, col);

        return new RowViewModel(resultRow);
    }

    public buildSeparator(table: Table): RowViewModel {
        let resultRow = new Array(table.columnCount);

        for(let col = 0; col < table.columnCount; col++)
            resultRow[col] = this._alignmentMarkerStrategy.markerFor(table.alignments[col]).mark(
                this._separatorPadCalculator.getLeftPadding(table, 1, col) +
                this._separatorPadCalculator.getRightPadding(table, 0, col)
            );

        return new RowViewModel(resultRow);
    }
}
