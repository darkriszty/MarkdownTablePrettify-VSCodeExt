import { BasePadCalculator } from "../basePadCalculator";
import { Table } from "../../models/table";

export abstract class RightPadCalculator extends BasePadCalculator {
    public getLeftPadding(paddingChar: string, table: Table, row: number, column: number): string {
        return paddingChar.repeat(this.getLeftPaddingCount(table, row, column));
    }

    public getRightPadding(paddingChar: string, table: Table, row: number, column: number): string {
        return paddingChar;
    }

    private getLeftPaddingCount(table: Table, row: number, column: number) {
        let longestColumnLength = table.getLongestColumnLengths()[column];
        let leftPadCount = longestColumnLength > 0
            ? longestColumnLength - table.rows[row].cells[column].getLength()
            : 1;
        leftPadCount += this.extraPadCount(table);
        return leftPadCount;
    }

    protected extraPadCount(table: Table): number {
        return 1;
    };
}