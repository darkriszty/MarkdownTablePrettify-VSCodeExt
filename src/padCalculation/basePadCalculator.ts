import { Table } from "../models/table";
import { Cell } from "../models/cell";

export abstract class BasePadCalculator {
    public abstract getLeftPadding(paddingChar: string, table: Table, cell: Cell): string;
    public abstract getRightPadding(paddingChar: string, table: Table, row: number, column: number): string;

    protected baseGetRightPadding(paddingChar: string, table: Table, row: number, column: number): string {
        const cellTextLength = table.rows[row][column].getLength();
        let rightPadCount = table.getLongestColumnLengths()[column] > 0
            ? table.getLongestColumnLengths()[column] - cellTextLength
            : 1;
        if (table.getLongestColumnLengths()[column] > 0 && cellTextLength > 0)
            rightPadCount++;
        return paddingChar.repeat(rightPadCount);
    }
}