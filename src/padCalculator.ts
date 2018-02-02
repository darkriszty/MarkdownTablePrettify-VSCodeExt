import { Table } from "./models/table";
import { CellLengthCalculator } from "./cellLengthCalculator";

export class PadCalculator {

    public getLeftPadding(paddingChar: string, table: Table, column: number): string {
        let result;
        if (column == 0) {
            result = table.hasLeftBorder
                ? paddingChar
                : "";
        } else if (column == table.columnCount - 1) {
            result = (table.getLongestColumnLength()[column] == 0 && !table.hasRightBorder)
                ? ""
                : paddingChar;
        } else {
            result = paddingChar;
        }

        return result;
    }

    public getRightPadding(paddingChar: string, table: Table, row: number, column: number): string {
        if (column == table.columnCount - 1 && !table.hasRightBorder)
            return "";
        return this.getRightPaddingInner(paddingChar, table, row, column);
    }

    public getRightPaddingForSeparator(paddingChar: string, table: Table, column: number): string {
        return paddingChar.repeat(this.getRightPadCountForSeparator(table, column));
    }

    private getRightPadCountForSeparator(table: Table, column: number): number {
        const cellLength = table.getLongestColumnLength()[column];
        const minLength = cellLength == 0 ? 1 : 0;
        return Math.max(cellLength, minLength) + 1;
    }

    private getRightPaddingInner(paddingChar: string, table: Table, row: number, column: number): string {
        let result;
        const cellTextLength = CellLengthCalculator.getLength(table.rows[row][column]);
        if (column <= table.columnCount - 1 || table.hasRightBorder) {
            let rightPadCount = table.getLongestColumnLength()[column] > 0
                ? table.getLongestColumnLength()[column] - cellTextLength
                : 1;
            if (table.getLongestColumnLength()[column] > 0 && cellTextLength > 0)
                rightPadCount++;
            result = paddingChar.repeat(rightPadCount);
        } else {
            result = paddingChar;
        }

        return result;
    }
}