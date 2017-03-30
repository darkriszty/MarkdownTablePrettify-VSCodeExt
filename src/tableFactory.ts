import { ITable, Table } from "./table";

export interface ITableFactory {
    create(text: string): ITable;
}

export class TableFactory implements ITableFactory {
    public create(text: string): ITable {
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

        return new Table(rowsWithoutSeparator);
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