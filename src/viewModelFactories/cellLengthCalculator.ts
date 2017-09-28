import { Table } from "../models/table";

export class CellLengthCalculator {
    // TODO: consider creating a cell class for the table cells and putting these methods on the Cell.
    public static getMaxLengths(table: Table): number[] {
        let maxColLengths: number[] = new Array(table.columnCount).fill(0);

        for (let col = 0; col < table.rows.length; col++)
            for (let row = 0; row < table.rows[col].length; row++)
                maxColLengths[col] = Math.max(this.getLength(table.rows[row][col]), maxColLengths[col])

        return maxColLengths;
    }

    public static getLength(cell: string): number {
        let length: number = 0;

        for (let i = 0, n = cell.length; i < n; i++)
            length += this._getCharDisplayLength(cell.charAt(i));

        return length;
    }

    private static _getCharDisplayLength(character: string): number {
        // for the specified ranges use a length of 2, otherwise a length of 1
        return /^(([\u{4E00}-\u{9FFF}])|([\u{3400}-\u{4DBF}])|([\u{20000}-\u{2A6DF}])|([\u{2A700}-\u{2B73F}])|([\u{2B740}-\u{2B81F}]))$/u.test(character)
            ? 2
            : 1;
    }
}