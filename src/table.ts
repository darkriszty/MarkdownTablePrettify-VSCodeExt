import { Column, ColumnPositioning, ColumnFactory } from "./column";

export class Table {
    private _columns: Column[] = [];

    constructor(rawRows: string[][]) {
        if (!TableColumnCountValidator.isValidTable(rawRows))
            throw "Invalid table: mismatching column counts.";
        this._generateColumns(rawRows);
    }

    private _generateColumns(rawRows: string[][]): void {
        for (let column of ColumnFactory.generateColumns(rawRows)) {
            this._columns.push(column);
        }
    }

    public prettyPrint(): string {
        const rowCount = this._columns[0].getSize();
        const colCount = this._columns.length;

        let buffer = "";
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < colCount; col++) {
                const column = this._columns[col];
                buffer += column.getValue(row);
                if (column.getPositioning() != ColumnPositioning.Last)
                    buffer += "|";
            }
            buffer += "\r";
        }

        return buffer;
    }
}

export class TableFactory {
    public static createTable(text: string): Table {
        const lines = text.split(/\r\n|\r|\n/);
        const columns = 0;

        let rows = lines
            .map(l => l.split("|"))
            .filter(arr => !(arr.length == 1 && arr[0] == "")) // remove any empty lines
            .filter((v, i) => i != 1); // remove the separator line from second line

        return TableColumnCountValidator.isValidTable(rows)
            ? new Table(rows)
            : null;
    }
}

class TableColumnCountValidator {
    public static isValidTable(rawRows: string[][]): boolean {
        return !!rawRows && rawRows.length > 0 && rawRows.every(r => r.length == rawRows[0].length)
    }
}
