import { Column, ColumnType } from "./column";

export class Table {
    private _columns: Column[] = [];

    constructor(rawRows: string[][]) {
        if (!TableColumnCountValidator.isValidTable(rawRows))
            throw "Invalid table: mismatching column counts.";

        this._generateColumns(rawRows);
    }

    private _generateColumns(rawRows: string[][]): void {
        const rowCount = rawRows.length;
        const colCount = rawRows[0].length;

        // determine the expected maximum length for each column
        let maxColumnLengths = new Array(colCount).fill(0);
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < colCount; col++) {
                const cellLength = rawRows[row][col].length
                if (cellLength > maxColumnLengths[col])
                    maxColumnLengths[col] = cellLength;
            }
        }

        // create the columns and add the values
        for (let col = 0; col < colCount; col++) {
            const expectedLength = maxColumnLengths[col];
            const firstNonEmptyIndex = maxColumnLengths.findIndex(eLength => eLength > 0);
            const tempMaxColumns = [...maxColumnLengths];
            const lastNonEmptyIndex = maxColumnLengths.length - 1 - tempMaxColumns.reverse().findIndex(eLength => eLength > 0);

            const columnType = col == firstNonEmptyIndex
                ? ColumnType.First
                : col == lastNonEmptyIndex
                    ? ColumnType.Last
                    : ColumnType.Middle;

            if (expectedLength > 0 || columnType == ColumnType.Middle) {
                let column = new Column(expectedLength, columnType);
                for (let row = 0; row < rowCount; row++) {
                    column.addValue(rawRows[row][col]);
                }
                this._columns.push(column);
            }
        }
    }

    public prettyPrint(): string {
        const rowCount = this._columns[0].getSize();
        const colCount = this._columns.length;

        let buffer = "";
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < colCount; col++) {
                const column = this._columns[col];
                if (!column.isEmpty()) {
                    buffer += this._columns[col].getValue(row);
                    if (column.getType() != ColumnType.Last)
                        buffer += "|";
                }
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
