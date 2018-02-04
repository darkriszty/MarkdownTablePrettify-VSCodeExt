import { PadCalculator } from "./padCalculator";
import { Table } from "../models/table";
import { ColumnBasedPadCalculatorSelector } from "./columnBasedPadCalculatorSelector";

export class ContentPadCalculator implements PadCalculator {

    constructor(
        protected _padCalculatorSelector: ColumnBasedPadCalculatorSelector,
        protected _paddingChar: string) 
    { }

    public getLeftPadding(table: Table, row: number, column: number): string {
        return this._padCalculatorSelector.select(table, column).getLeftPadding(this._paddingChar, table, table.rows[row][column]);
    }

    public getRightPadding(table: Table, row: number, column: number): string {
        return this._padCalculatorSelector.select(table, column).getRightPadding(this._paddingChar, table, row, column);
    }

    public getPadChar(): string{ 
        return this._paddingChar;
    }
}