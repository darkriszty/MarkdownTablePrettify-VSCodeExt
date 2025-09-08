import { ValuePaddingProvider } from "./valuePaddingProvider";
import { TableViewModel } from "../viewModels/tableViewModel";
import { RowViewModel } from "../viewModels/rowViewModel";

export class TableStringWriter {
    public constructor(
        private readonly _valuePaddingProvider: ValuePaddingProvider
    ) {  }

    public writeTable(table: TableViewModel): string {
        if (table == null) throw new Error("Table can't be null.");
        if (table.header == null) throw new Error("Table must have a header.");
        if (table.separator == null) throw new Error("Table must have a separator.");
        if (table.rows == null) throw new Error("Table rows can't be null.");
        if (table.columnCount == 0) throw new Error("Table must have at least one column.");

        const buffer: string[] = [];
        buffer.push(this.writeRowViewModel(table.header, table, true));
        buffer.push(this.writeRowViewModel(table.separator, table, table.rowCount > 0));
        buffer.push(this.writeRows(table));

        return buffer.join('');
    }

    private writeRows(table: TableViewModel): string {
        const buffer: string[] = [];
        for (let row = 0; row < table.rowCount; row++) {
            buffer.push(this.writeRowViewModel(table.rows[row], table, row != table.rowCount - 1));
        }
        return buffer.join('');
    }

    private writeRowViewModel(row: RowViewModel, table: TableViewModel, addEndOfLine: boolean): string {
        const buffer: string[] = [];
        buffer.push(table.leftPad);
        buffer.push(this.getLeftBorderIfNeeded(table));
        for (let col = 0; col < table.columnCount; col++) {
            buffer.push(this._valuePaddingProvider.getLeftPadding());
            buffer.push(row.getValueAt(col));
            buffer.push(this._valuePaddingProvider.getRightPadding(table, col));
            buffer.push(this.getSeparatorIfNeeded(table, col));
        }
        buffer.push(this.getRightBorderIfNeeded(table));
        if (addEndOfLine)
            buffer.push(row.EOL);
        return buffer.join('');
    }

    private getSeparatorIfNeeded(table: TableViewModel, currentColumn: number): string {
        return currentColumn != table.columnCount - 1 ? "|" : "";
    }

    private getLeftBorderIfNeeded(table: TableViewModel): string {
        return table.hasLeftBorder ? "|" : "";
    }

    private getRightBorderIfNeeded(table: TableViewModel): string {
        return table.hasRightBorder ? "|" : "";
    }
}