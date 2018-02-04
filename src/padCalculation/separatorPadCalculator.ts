import { PadCalculator } from "./padCalculator";
import { ContentPadCalculator } from "./contentPadCalculator";
import { Table } from "../models/table";
import { ColumnBasedPadCalculatorSelector } from "./columnBasedPadCalculatorSelector";

export class SeparatorPadCalculator extends ContentPadCalculator implements PadCalculator  {
   
    constructor(
        padCalculatorSelector: ColumnBasedPadCalculatorSelector,
        paddingChar: string) 
    {
        super(padCalculatorSelector, paddingChar);
    }

    public getRightPadding(table: Table, row: number, column: number): string {
        return this._paddingChar.repeat(this.getRightPadCountForSeparator(table, column));
    }

    private getRightPadCountForSeparator(table: Table, column: number): number {
        const cellLength = table.getLongestColumnLengths()[column];
        const minLength = cellLength == 0 ? 1 : 0;
        return Math.max(cellLength, minLength) + 1;
    }
}