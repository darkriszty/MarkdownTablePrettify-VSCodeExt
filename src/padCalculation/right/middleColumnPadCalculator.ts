import { BasePadCalculator } from "../basePadCalculator";
import { Table } from "../../models/table";
import { Cell } from "../../models/cell";

export class MiddleColumnPadCalculator extends BasePadCalculator {
    public getLeftPadding(paddingChar: string, table: Table, row: number, column: number): string {
        return paddingChar.repeat(
            this.getLeftPaddingCount(table.getLongestColumnLengths()[column], table.rows[row][column].getLength(), table.hasLeftBorder)
        );
    }

    private getLeftPaddingCount(longestColumnLength: number, cellTextLength: number, hasLeftBorder: boolean) {
        let leftPadCount = longestColumnLength > 0
            ? longestColumnLength - cellTextLength
            : 1;
        leftPadCount++;
        return leftPadCount;
    }

    public getRightPadding(paddingChar: string, table: Table, row: number, column: number): string {
        return paddingChar;
    }
}