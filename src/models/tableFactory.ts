import { Cell } from "./cell";
import { Column } from "./column";
import { ColumnFactory } from "./columnFactory";
import { ITable, Table } from "./table";

export interface ITableFactory {
    create(text: string): ITable;
}

export class TableFactory implements ITableFactory {
    public create(text: string): ITable {
        const lines = text.split(/\r\n|\r|\n/);

        // split by separators to get a 2d array remove any empty lines
        const rows = lines
            .map(l => l.split("|"))
            .filter(arr => !(arr.length == 1 && arr[0] == ""));

        if (!TableValidator.rowAndColumnSizeValid(rows))
            return null;

        // remove the separator line from second line
        const rowsWithoutSeparator = TableValidator.hasValidSeparators(rows)
            ? rows.filter((v, i) => i != 1) // remove the separator line from second line
            : null;

        return rowsWithoutSeparator != null
            ? new Table(ColumnFactory.generateColumns(rowsWithoutSeparator))
            : null;
    }
}

class TableValidator {
    public static rowAndColumnSizeValid(rawRows: string[][]): boolean {
        return !!rawRows && 
                rawRows.length > 2 && // at least two rows are required besides the separator
                rawRows[0].length > 1 && // at least two columns are required
                rawRows.every(r => r.length == rawRows[0].length); // all rows of a column must match the length of the first row of that column
    }

    public static hasValidSeparators(rawRows: string[][]): boolean {
        if (!rawRows || rawRows.length < 1 || !rawRows[1])
            return false;

        // if all columns are dashes, then it is valid
        const secondRow = rawRows[1];
        const allCellsDash = secondRow.every(cell => this.composedOfDashes(cell));
        if (allCellsDash)
            return true;

        // now it can only be valid of the table starts or ends with a border and the middle columns are dashes
        return this.allDashesWithBorder(secondRow);
    }

    private static composedOfDashes(cellValue: string): boolean {
        const trimmedSpace = cellValue.trim();
        const firstDash = trimmedSpace.replace(/(?!^)-/g, "");
        if (firstDash === "-")
            return true;
        return false;
    }

    private static allDashesWithBorder(secondRow: string[]): boolean {
        const hasStartingBorder = secondRow.length >= 3 && secondRow[0].trim() === "";
        const hasEndingBorder = secondRow.length >= 3 && secondRow[secondRow.length - 1].trim() === "";

        let startIndex = hasStartingBorder ? 1 : 0;
        let endIndex = hasEndingBorder ? secondRow.length - 2 : secondRow.length - 1;

        const middleColumns = secondRow.filter((v, i) => i >= startIndex && i <= endIndex);
        const middleColumnsAllDash = middleColumns.every(cell => this.composedOfDashes(cell));
        if (middleColumnsAllDash && (hasStartingBorder || hasEndingBorder))
            return true;
        return false;
    }
}