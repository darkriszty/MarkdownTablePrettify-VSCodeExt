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

        let buffer = "";
        buffer += this.writeRowViewModel(table.header, table, true);
        buffer += this.writeRowViewModel(table.separator, table, table.rowCount > 0);
        buffer += this.writeRows(table);

        return buffer;
    }

    private writeRows(table: TableViewModel): string {
        let buffer = "";
        for (let row = 0; row < table.rowCount; row++) {
            buffer += this.writeRowViewModel(table.rows[row], table, row != table.rowCount - 1);
        }
        return buffer;
    }

    private writeRowViewModel(row: RowViewModel, table: TableViewModel, addEndOfLine: boolean): string {
        let buffer = "";
        buffer += table.leftPad;
        buffer += this.getLeftBorderIfNeeded(table);
        for (let col = 0; col < table.columnCount; col++) {
            buffer += this._valuePaddingProvider.getLeftPadding();
            buffer += row.getValueAt(col);
            buffer += this._valuePaddingProvider.getRightPadding(table, col);
            buffer += this.getSeparatorIfNeeded(table, col);
        }
        buffer += this.getRightBorderIfNeeded(table);
        if (addEndOfLine)
            buffer += row.EOL;
        return buffer;
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