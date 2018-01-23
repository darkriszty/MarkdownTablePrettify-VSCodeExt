import { RowViewModel } from "../viewModels/rowViewModel";
import { PadCalculator } from "../padCalculator";
import { Table } from "../models/table";

export class RowViewModelFactory {
    constructor(
        private _padCalculator: PadCalculator)
    { }

    public buildRow(row: number, table: Table): RowViewModel {
        if (table == null) throw new Error("Paramter can't be null");

        return this.makeRow(table, " ", row, this._padCalculator.getRightPadding.bind(this._padCalculator));
    }

    public buildSeparator(table: Table): RowViewModel {
        let resultRow = new Array(table.columnCount);
        const padChar = "-";

        for(let col = 0; col < table.columnCount; col++) {
            const columnLength = table.getLongestColumnLength()[col];
            resultRow[col] =
                this._padCalculator.getLeftPadding(padChar, table, col) +
                padChar +
                this._padCalculator.getRightPaddingForSeparator(padChar, table, col);
        }
        return new RowViewModel(resultRow);
    }

    private makeRow(table: Table, 
        padChar: string, row: number,
        rightPadFunc: (paddingChar: string, table: Table, row: number, column: number) => string): RowViewModel
    {
        let resultRow = new Array(table.columnCount);
        for(let col = 0; col < table.columnCount; col++) {
            const columnLength = table.getLongestColumnLength()[col];
            const text = table.rows[row][col] == ""
                ? padChar
                : table.rows[row][col];
            resultRow[col] =
                this._padCalculator.getLeftPadding(padChar, table, col) +
                text +
                rightPadFunc(padChar, table, row, col);
        }
        return new RowViewModel(resultRow);
    }
}
