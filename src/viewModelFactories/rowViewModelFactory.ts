import { RowViewModel } from "../viewModels/rowViewModel";
import { PadCalculator } from "../padCalculation/padCalculator";
import { Table } from "../models/table";
import { Alignment } from "../models/alignment";
import { AlignmentMarkerStrategy } from "./alignmentMarking";

export class RowViewModelFactory {
    private separatorChar : string = "-";

    constructor(
        private _contentPadCalculator: PadCalculator,
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

    public buildSeparator(rows: RowViewModel[], table: Table): RowViewModel {
        const columnCount = rows[0].columnCount;
        let lengths = Array(columnCount).fill(0);

        for (const row of rows) {
            for (let i = 0; i < columnCount; i++) {
                lengths[i] = Math.max(lengths[i], (row.getValueAt(i).length));
            }
        }

        const values = lengths.map(l => this.separatorChar.repeat(l)).map((val ,col) => this._alignmentMarkerStrategy.markerFor(table.alignments[col]).mark(val));
        return new RowViewModel(values);
    }
}
