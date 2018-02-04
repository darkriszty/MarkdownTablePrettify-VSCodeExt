import { RowViewModel } from "../viewModels/rowViewModel";
import { PadCalculator } from "../padCalculation/padCalculator";
import { Table } from "../models/table";

export class RowViewModelFactory {
    constructor(
        private _contentPadCalculator: PadCalculator,
        private _separatorPadCalculator: PadCalculator)
    { }

    public buildRow(row: number, table: Table): RowViewModel {
        if (table == null) throw new Error("Paramter can't be null");

        let resultRow = new Array(table.columnCount);

        for(let col = 0; col < table.columnCount; col++) {
            let text = "";
            if (col == table.columnCount - 1) {
                if (table.rows[row][col].getValue() == "") {
                    if (!table.hasRightBorder)
                        text = "";
                    else
                        text = this._contentPadCalculator.getPadChar();
                }
                else {
                    text = table.rows[row][col].getValue();
                }
            }
            else {
                text = table.rows[row][col].getValue() == ""
                    ? this._contentPadCalculator.getPadChar()
                    : table.rows[row][col].getValue();
            }

            resultRow[col] =
                this._contentPadCalculator.getLeftPadding(table, row, col) +
                text +
                this._contentPadCalculator.getRightPadding(table, row, col);
        }
        return new RowViewModel(resultRow);
    }

    public buildSeparator(table: Table): RowViewModel {
        let resultRow = new Array(table.columnCount);
        for(let col = 0; col < table.columnCount; col++) {
            resultRow[col] =
                this._separatorPadCalculator.getLeftPadding( table, 1, col) +
                this._separatorPadCalculator.getRightPadding( table, 0, col);
        }
        return new RowViewModel(resultRow);
    }
}
