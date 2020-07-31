import { TableViewModel } from "../viewModels/tableViewModel";
import { RowViewModel } from "../viewModels/rowViewModel";

export class TableStringWriter {
    public writeTable(table: TableViewModel): string {
        if (table == null) throw new Error("Table can't be null.");
        if (table.header == null) throw new Error("Table must have a header.");
        if (table.separator == null) throw new Error("Table must have a separator.");
        if (table.rows == null || table.rowCount == 0) throw new Error("Table must have rows.");

        let buffer = "";
        buffer += this.writeRowViewModel(table.header, table);
        buffer += this.writeRowViewModel(table.separator, table);
        buffer += this.writeRows(table);

        return buffer;
    }

    private writeRows(table: TableViewModel): string {
        let buffer = "";
        for (let row = 0; row < table.rowCount; row++) {
            buffer += this.writeRowViewModel(table.rows[row], table);
        }
        return buffer;
    }

    private writeRowViewModel(row: RowViewModel, table: TableViewModel): string {
        let buffer = "";
        buffer += this.getLeftBorderIfNeeded(table);
        for (let col = 0; col < table.columnCount; col++) {
            buffer += row.getValueAt(col);
            buffer += this.getSeparatorIfNeeded(table, col);
        }
        buffer += this.getRightBorderIfNeeded(table);

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