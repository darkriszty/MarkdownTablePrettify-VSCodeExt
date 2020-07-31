import { Table } from "../models/table";

export abstract class BasePadCalculator {
    public abstract getLeftPadding(paddingChar: string, table: Table, row: number, column: number): string;
    public abstract getRightPadding(paddingChar: string, table: Table, row: number, column: number): string;

    protected baseGetRightPadding(paddingChar: string, table: Table, row: number, column: number): string {
        return paddingChar.repeat(this.getRightPadCount(table.getLongestColumnLengths()[column], table.rows[row].cells[column].getLength()));
    }

    private getRightPadCount(longestColumnLength: number, cellTextLength: number) {
        let rightPadCount = longestColumnLength > 0
            ? longestColumnLength - cellTextLength
            : 1;
        if ((cellTextLength == 0) || (longestColumnLength > 0 && cellTextLength > 0))
            rightPadCount++;
        return rightPadCount;
    }
}