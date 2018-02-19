import { BasePadCalculator } from "../basePadCalculator";
import { Table } from "../../models/table";
import { Cell } from "../../models/cell";

export class MiddleColumnPadCalculator extends BasePadCalculator {
    public getLeftPadding(paddingChar: string, table: Table, row: number, column: number): string {
        return paddingChar.repeat(Math.floor(this.totalPadCount(table, column, row)));
    }

    public getRightPadding(paddingChar: string, table: Table, row: number, column: number): string {
        return paddingChar.repeat(Math.ceil(this.totalPadCount(table, column, row)));
    }

    private totalPadCount(table: Table, column: number, row: number): number {
        const longestColumnLength = table.getLongestColumnLengths()[column];
        let padCount = longestColumnLength > 0
            ? longestColumnLength - table.rows[row][column].getLength()
            : 1;
        padCount += 2;
        return padCount / 2;
    }
}