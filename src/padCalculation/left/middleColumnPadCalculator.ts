import { BasePadCalculator } from "../basePadCalculator";
import { Table } from "../../models/table";

export class MiddleColumnPadCalculator extends BasePadCalculator {
    public getLeftPadding(paddingChar: string, table: Table, row: number, column: number): string {
        return paddingChar;
    }
    public getRightPadding(paddingChar: string, table: Table, row: number, column: number): string {
        return super.baseGetRightPadding(paddingChar, table, row, column);
    }
}