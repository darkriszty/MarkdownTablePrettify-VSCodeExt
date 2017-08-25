import { Table } from "../models/table";

export class TableValidator {
    public isValid(table: Table, checkSeparator: boolean = true): boolean {
        /*
            Check for:
                * null
                * at least 2 rows (besides the separator)
                * at least two columns
                * all rows of a column must match the length of the first row of that column
                * empty first, middle and last columns are supported
            If checkSeparator the check for 
                * all dashes, or
                * all dashes with border
        */
        if (table == null || table.isEmpty())
            return false;

        return checkSeparator
            ? this.validateWithSeparator(table)
            : this.validateWithoutSeparator(table);
    }

    private validateWithoutSeparator(table: Table): boolean {
        var rawRows = table.rows;
        return rawRows.length > 1 && // at least two rows are required
               rawRows[0].length > 1 && // at least two columns are required
               rawRows.every(r => r.length == rawRows[0].length); // all rows of a column must match the length of the first row of that column
    }

    private validateWithSeparator(table: Table): boolean {
        var rawRows = table.rows;
        let sizeValid = rawRows.length > 2 && // at least two rows are required besides the separator
                        rawRows[0].length > 1 && // at least two columns are required
                        rawRows.every(r => r.length == rawRows[0].length); // all rows of a column must match the length of the first row of that column

        const withoutEmptyColumns = table.withoutEmptyColumns().rows;
        return sizeValid && this.hasValidSeparators(withoutEmptyColumns);
    }

    private hasValidSeparators(rawRows: string[][]): boolean {
        if (!rawRows || rawRows.length < 1 || !rawRows[1])
            return false;

        // if all columns are dashes, then it is valid
        const secondRow = rawRows[1];
        const allCellsDash = secondRow.every(cell => this.validSeparator(cell));
        if (allCellsDash)
            return true;

        // now it can only be valid of the table starts or ends with a border and the middle columns are dashes
        return this.allDashesWithBorder(secondRow);
    }

    private validSeparator(cellValue: string): boolean {
        let trimmedSpace = cellValue.trim();
        // alignment options with dash are allowed
        if (trimmedSpace[0] == ":")
            trimmedSpace = trimmedSpace.slice(1);
        if (trimmedSpace[trimmedSpace.length - 1] == ":")
            trimmedSpace = trimmedSpace.slice(0, -1);

        const firstDash = trimmedSpace.replace(/(?!^)-/g, "");
        if (firstDash === "-")
            return true;
        
        return false;
    }

    private allDashesWithBorder(secondRow: string[]): boolean {
        const hasStartingBorder = secondRow.length >= 3 && secondRow[0].trim() === "";
        const hasEndingBorder = secondRow.length >= 3 && secondRow[secondRow.length - 1].trim() === "";

        let startIndex = hasStartingBorder ? 1 : 0;
        let endIndex = hasEndingBorder ? secondRow.length - 2 : secondRow.length - 1;

        const middleColumns = secondRow.filter((v, i) => i >= startIndex && i <= endIndex);
        const middleColumnsAllDash = middleColumns.every(cell => this.validSeparator(cell));
        if (middleColumnsAllDash && (hasStartingBorder || hasEndingBorder))
            return true;
        return false;
    }
}