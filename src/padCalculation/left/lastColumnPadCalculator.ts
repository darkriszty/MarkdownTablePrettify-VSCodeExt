import { BasePadCalculator } from "../basePadCalculator";
import { Table } from "../../models/table";
import { Cell } from "../../models/cell";

export class LastColumnPadCalculator extends BasePadCalculator {
    public getLeftPadding(paddingChar: string, table: Table, cell: Cell): string {
        return (cell.getValue() == "" && !table.hasRightBorder) ? "" : paddingChar;
    }

    public getRightPadding(paddingChar: string, table: Table, row: number, column: number): string {
        if (!table.hasRightBorder) return "";
        return super.baseGetRightPadding(paddingChar, table, row, column);
    }
}