import { BasePadCalculator } from "../basePadCalculator";
import { Table } from "../../models/table";
import { Cell } from "../../models/cell";

export class FirstColumnPadCalculator extends BasePadCalculator {
    public getLeftPadding(paddingChar: string, table: Table, cell: Cell): string {
        return table.hasLeftBorder ? paddingChar : "";
    }
    public getRightPadding(paddingChar: string, table: Table, row: number, column: number): string {
        return super.baseGetRightPadding(paddingChar, table, row, column);
    }
}