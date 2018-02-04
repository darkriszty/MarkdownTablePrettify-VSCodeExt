import { Table } from "../models/table";

export interface PadCalculator {
    getLeftPadding(paddingChar: string, table: Table, row: number, column: number): string;
    getRightPadding(paddingChar: string, table: Table, row: number, column: number): string;
}