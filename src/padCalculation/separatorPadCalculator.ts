import { PadCalculator } from "./padCalculator";
import { ContentPadCalculator } from "./contentPadCalculator";
import { Table } from "../models/table";

export class SeparatorPadCalculator extends ContentPadCalculator implements PadCalculator  {
    public getRightPadding(paddingChar: string, table: Table, row: number, column: number): string {
        return paddingChar.repeat(this.getRightPadCountForSeparator(table, column));
    }

    private getRightPadCountForSeparator(table: Table, column: number): number {
        const cellLength = table.getLongestColumnLengths()[column];
        const minLength = cellLength == 0 ? 1 : 0;
        return Math.max(cellLength, minLength) + 1;
    }
}