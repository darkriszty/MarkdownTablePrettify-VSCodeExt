import { Table } from "../../models/table";
import { RightPadCalculator } from "./rightPadCalculator";

export class LastColumnPadCalculator extends RightPadCalculator {
    public getRightPadding(paddingChar: string, table: Table, row: number, column: number): string {
        return table.hasLeftBorder ? super.getRightPadding(paddingChar, table, row, column) : "";
    }
}