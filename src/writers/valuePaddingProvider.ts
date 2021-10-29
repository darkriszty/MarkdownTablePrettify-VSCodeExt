import { TableViewModel } from "../viewModels/tableViewModel";

export class ValuePaddingProvider {
    private readonly _columnPad: string;

    public constructor(columnPadding: number) {
        if (columnPadding < 0) throw new Error("Column padding must be greater than or equal to 0!");

        this._columnPad = " ".repeat(columnPadding);
    }

    public getLeftPadding(): string {
        return this._columnPad;
    }

    public getRightPadding(table: TableViewModel, currentColumn: number): string {
        return currentColumn != table.columnCount - 1
            ? this._columnPad
            : table.hasRightBorder
                ? this._columnPad
                : "";
    }
}