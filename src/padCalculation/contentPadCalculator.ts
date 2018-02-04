import { PadCalculator } from "./padCalculator";
import { Table } from "../models/table";
import { ColumnBasedPadCalculatorSelector } from "./columnBasedPadCalculatorSelector";

export class ContentPadCalculator implements PadCalculator {

    constructor(private _padCalculatorSelector: ColumnBasedPadCalculatorSelector) { }

    public getLeftPadding(paddingChar: string, table: Table, row: number, column: number): string {
        return this._padCalculatorSelector.select(table, column).getLeftPadding(paddingChar, table, table.rows[row][column]);
    }

    public getRightPadding(paddingChar: string, table: Table, row: number, column: number): string {
        return this._padCalculatorSelector.select(table, column).getRightPadding(paddingChar, table, row, column);
    }
}