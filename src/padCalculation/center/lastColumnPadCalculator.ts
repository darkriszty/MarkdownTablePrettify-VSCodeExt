import { Table } from "../../models/table";
import { CenterPadCalculator } from "./centerPadCalculator";

export class LastColumnPadCalculator extends CenterPadCalculator {

    public getRightPadding(paddingChar: string, table: Table, row: number, column: number): string {
        if (!table.hasRightBorder) return "";
        return super.getRightPadding(paddingChar, table, row, column);
    }

    protected extraPadCount(table: Table): number {
        return 2;
    }
}