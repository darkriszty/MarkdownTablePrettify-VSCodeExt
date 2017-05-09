import { Cell } from "./cell";
import { Column } from "./column";
import { ColumnPositioning } from "./columnPositioning";

export class ColumnFactory {
    public static generateColumns(rawRows: string[][]): Column[] {
        const columns: Column[] = this._getColumns(rawRows);
        columns.forEach((c, index) => c.setPositioning(this._getPositioning(index, columns.length)));
        return columns;
    }

    private static _getColumns(rawRows: string[][]): Column[] {
        let columns: Column[] = this._createColumns(rawRows);
        this._addRemoveComplementaryColumns(columns, rawRows.length);
        return columns;
    }

    private static _getPositioning(columnIndex: number, columnCount: number): ColumnPositioning {
        return columnIndex == 0
                ? ColumnPositioning.First
                : columnIndex == columnCount - 1
                    ? ColumnPositioning.Last
                    : ColumnPositioning.Middle;
    }

    private static _createColumns(rawRows: string[][]): Column[] {
        let columns: Column[] = [];
        for (let col = 0; col < rawRows[0].length; col++) {
            const trimmedRows = rawRows.map(r => r[col].trim());
            columns.push(this._createColumnFromRows(trimmedRows));
        }
        return columns;
    }

    private static _addRemoveComplementaryColumns(columns: Column[], rowCount: number): void {
        if (this._removeLastColumn(columns)) {
            // if the first column is not empty, but the last one is, then remove the last one
            columns.splice(columns.length - 1, 1);
        } else if (this._addEmptyFirstColumn(columns)) {
            // add an empty column at the end if the first one is an empty column but the last one isn't
            const emptyRawRows = new Array(rowCount).fill(0);
            columns.push(this._createColumnFromRows(emptyRawRows));
        }
    }

    private static _createColumnFromRows(rows: string[]): Column {
        return new Column(rows.map(val => new Cell(val)))
    }

    private static _removeLastColumn(columns: Column[]): boolean {
        return columns.length > 1 && !columns[0].isEmpty() && columns[columns.length - 1].isEmpty();
    }

    private static _addEmptyFirstColumn(columns: Column[]): boolean {
        return columns.length > 1 && columns[0].isEmpty() && !columns[columns.length - 1].isEmpty();
    }
}
