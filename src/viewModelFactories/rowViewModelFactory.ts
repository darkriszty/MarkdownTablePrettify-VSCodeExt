import { RowViewModel } from "../viewModels/rowViewModel";
import { PadCalculator } from "../padCalculation/padCalculator";
import { Table } from "../models/table";
import { AlignmentMarkerStrategy } from "./alignmentMarking";

export class RowViewModelFactory {
    private separatorChar : string = "-";

    constructor(
        private _contentPadCalculator: PadCalculator,
        private _alignmentMarkerStrategy: AlignmentMarkerStrategy)
    { }

    public buildRow(row: number, table: Table): RowViewModel {
        if (table == null) throw new Error("Paramter can't be null");

        let resultRow: string[] = new Array(table.columnCount);
        let displayWidths: number[] = new Array(table.columnCount);

        for(let col = 0; col < table.columnCount; col++) {
            const leftPadding = this._contentPadCalculator.getLeftPadding(table, row, col);
            const rightPadding = this._contentPadCalculator.getRightPadding(table, row, col);

            resultRow[col] = leftPadding + table.rows[row].cells[col].getValue() + rightPadding;
            displayWidths[col] = leftPadding.length + table.rows[row].cells[col].getLength() + rightPadding.length;
        }

        return new RowViewModel(resultRow, displayWidths, table.rows[row].EOL);
    }

    public buildSeparator(rows: RowViewModel[], table: Table): RowViewModel {
        const columnCount: number = rows[0].columnCount;
        let lengths: number[] = Array(columnCount).fill(0);

        for (const row of rows) {
            for (let col = 0; col < columnCount; col++) {
                lengths[col] = Math.max(lengths[col], row.getDisplayWidthAt(col));
            }
        }

        const values: string[] = lengths
            .map(l => this.separatorChar.repeat(l))
            .map((val, col) => this._alignmentMarkerStrategy.markerFor(table.alignments[col]).mark(val));

        return new RowViewModel(values, lengths, table.separatorEOL);
    }
}
