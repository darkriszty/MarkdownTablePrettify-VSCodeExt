import { Table } from "../models/table";

export interface PadCalculator {
    getLeftPadding(table: Table, row: number, column: number): string;
    getRightPadding(table: Table, row: number, column: number): string;
    getPadChar(): string;
}