import { Column, ColumnPositioning, ColumnFactory } from "./column";

export class Table {
    private _columns: Column[] = [];

    public static create(text: string): Table {
        const lines = text.split(/\r\n|\r|\n/);
        const columns = 0;

        // split by separators to get a 2d array remove any empty lines
        const rows = lines
            .map(l => l.split("|"))
            .filter(arr => !(arr.length == 1 && arr[0] == ""));

        // remove the separator line from second line
        const rowsWithoutSeparator = TableValidator.containsHeaderSeparator(rows)
            ? rows.filter((v, i) => i != 1) // remove the separator line from second line
            : null;

        if (!TableValidator.areValidRows(rowsWithoutSeparator))
            return null;

        var result = new Table();
        result._generateColumns(rowsWithoutSeparator);
        return result;
    }

    private constructor() { }

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

class TableValidator {
    public static containsHeaderSeparator(rawRows: string[][]): boolean {
        if (!rawRows || rawRows.length < 1 || !rawRows[1])
            return false;
        const secondRow = rawRows[1];
        return secondRow.every((v, i) => this.isSeparator(v, i == 0 || i == secondRow.length - 1));
    }

    private static isSeparator(cellValue: string, isFirstOrLast: boolean): boolean {
        if (cellValue.trim() == "-")
            return true;
        // If the first or last column is empty then it still can be a header containing separator, 
        // for example table starting or ending with borders ("|") would produce this.
        if (cellValue.trim() == "" && isFirstOrLast)
            return true;
        return false;
    }

    public static areValidRows(rawRows: string[][]): boolean {
        return !!rawRows && 
                rawRows.length > 1 && // at least two rows are required
                rawRows[0].length > 1 && // at least two columns are required
                rawRows.every(r => r.length == rawRows[0].length); // all rows of a column must match the length of the first row of that column
    }
}
