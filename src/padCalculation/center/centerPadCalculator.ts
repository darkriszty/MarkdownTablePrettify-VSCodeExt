import { Table } from "../../models/table";
import { Cell } from "../../models/cell";
import { BasePadCalculator } from "../basePadCalculator";

export abstract class CenterPadCalculator extends BasePadCalculator {
    public getLeftPadding(paddingChar: string, table: Table, row: number, column: number): string {
        return paddingChar.repeat(Math.floor(this.totalPadCount(table, column, row)));
    }

    public getRightPadding(paddingChar: string, table: Table, row: number, column: number): string {
        return paddingChar.repeat(Math.ceil(this.totalPadCount(table, column, row)));
    }

    protected totalPadCount(table: Table, column: number, row: number): number {
        const longestColumnLength = table.getLongestColumnLengths()[column];
        let padCount = longestColumnLength > 0
            ? longestColumnLength - table.rows[row][column].getLength()
            : 1;
        padCount += this.extraPadCount(table);
        return padCount / 2;
    }

    protected abstract extraPadCount(table: Table): number;
}