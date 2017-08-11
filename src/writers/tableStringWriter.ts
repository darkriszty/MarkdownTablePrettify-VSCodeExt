import { TableViewModel } from "../viewModels/tableViewModel";

export class TableStringWriter {
    public writeTable(table: TableViewModel): string {
        if (table == null) throw new Error("Table can't be null.");
        if (table.header == null) throw new Error("Table must have a header.");
        if (table.separator == null) throw new Error("Table must have a separator.");
        if (table.rows == null || table.rowCount == 0) throw new Error("Table must have rows.");
        /*
            * thow error for null
            * write the header in the first row
            * write the separator in the second row
            * write the rows in the next n rows
            * after all but the last columns, the separator "|" must be written
            * in case the view model has left border, start all rows with separator
            * in case the view model has right border, end all rows with separator
        */
        let buffer = this.getLeftBorderIfNeeded(table);
        for (let col = 0; col < table.columnCount; col++) {
            buffer += table.header.getValueAt(col);
            buffer += this.getSeparatorIfNeeded(table, col);
        }
        buffer += this.getRightBorderIfNeeded(table);
        buffer += "\r\n";

        buffer += this.getLeftBorderIfNeeded(table);
        for (let col = 0; col < table.columnCount; col++) {
            buffer += table.separator.getValueAt(col);
            buffer += this.getSeparatorIfNeeded(table, col);
        }
        buffer += this.getRightBorderIfNeeded(table);
        buffer += "\r\n";
        
        for (let row = 0; row < table.rowCount; row++) {
            buffer += this.getLeftBorderIfNeeded(table);
            for (let col = 0; col < table.columnCount; col++) {
                buffer += table.rows[row].getValueAt(col);
                buffer += this.getSeparatorIfNeeded(table, col);
            }
            buffer += this.getRightBorderIfNeeded(table);
            if (row != table.rowCount - 1)
                buffer += "\r\n";
        }

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