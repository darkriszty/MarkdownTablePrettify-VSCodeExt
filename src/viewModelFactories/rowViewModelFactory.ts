import { RowViewModel } from "../viewModels/rowViewModel";
import { PadCalculator } from "../padCalculator";
import { Table } from "../models/table";

export class RowViewModelFactory {
    constructor(
        private _padCalculator: PadCalculator)
    { }

    public buildRow(row: number, table: Table): RowViewModel {
        if (table == null) throw new Error("Paramter can't be null");

        let resultRow = new Array(table.columnCount);
        const padChar = " ";

        for(let col = 0; col < table.columnCount; col++) {
            let text = "";
            if (col == table.columnCount - 1) {
                if (table.rows[row][col].getValue() == "") {
                    if (!table.hasRightBorder)
                        text = "";
                    else
                        text = padChar;
                }
                else {
                    text = table.rows[row][col].getValue();
                }
            }
            else {
                text = table.rows[row][col].getValue() == ""
                    ? padChar
                    : table.rows[row][col].getValue();
            }

            resultRow[col] =
                this._padCalculator.getLeftPadding(padChar, table, row, col) +
                text +
                this._padCalculator.getRightPadding(padChar, table, row, col);
        }
        return new RowViewModel(resultRow);
    }

    public buildSeparator(table: Table): RowViewModel {
        let resultRow = new Array(table.columnCount);
        const padChar = "-";

        for(let col = 0; col < table.columnCount; col++) {
            resultRow[col] =
                this._padCalculator.getLeftPadding(padChar, table, 1, col) +
                this._padCalculator.getRightPaddingForSeparator(padChar, table, col);
        }
        return new RowViewModel(resultRow);
    }
}
