export class TableValidator {
    public isValid(rows: string[][], checkSeparator: boolean = true): boolean {
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
        if (rows == null) 
            return false;

        return checkSeparator
            ? this.validateWithSeparator(rows)
            : this.validateWithoutSeparator(rows);
    }


    private validateWithoutSeparator(rawRows: string[][]): boolean {
        return rawRows.length > 1 && // at least two rows are required
               rawRows[0].length > 1 && // at least two columns are required
               rawRows.every(r => r.length == rawRows[0].length); // all rows of a column must match the length of the first row of that column
    }

    private validateWithSeparator(rawRows: string[][]): boolean {
        let sizeValid = rawRows.length > 2 && // at least two rows are required besides the separator
                        rawRows[0].length > 1 && // at least two columns are required
                        rawRows.every(r => r.length == rawRows[0].length); // all rows of a column must match the length of the first row of that column

        const withoutEmptyColumns = this.removeEmptyColumns(rawRows);
        return sizeValid && this.hasValidSeparators(withoutEmptyColumns);
    }

    //TODO: make a model and put these method on it
    private removeEmptyColumns(rows: string[][]): string[][] {
        let emptyColumnIndexes: number[] = this.getEmptyColumnIndexes(rows);

        let clonedRows = rows.map(arr => arr.slice(0));
        for (let i = emptyColumnIndexes.length - 1; i >=0; i--)
            this.removeColumn(clonedRows, emptyColumnIndexes[i]);

        return clonedRows;
    }

    private getEmptyColumnIndexes(rows: string[][]): number[] {
        let emptyColumnIndexes: number[] = [];
        const colLength = rows[0].length;
        for (let col = 0; col < colLength; col++)
            if (this.isColumnEmpty(rows, col))
                emptyColumnIndexes.push(col);
        return emptyColumnIndexes;
    }

    private isColumnEmpty(rows: string[][], column: number): boolean {
        for (let row = 0; row < rows.length; row++)
            if (rows[row][column].trim() != "")
                return false;
        return true;
    }

    private removeColumn(rows: string[][], column: number): void {
        for (let row = 0; row < rows.length; row++)
            rows[row].splice(column, 1);
    }

    private hasValidSeparators(rawRows: string[][]): boolean {
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

    private composedOfDashes(cellValue: string): boolean {
        const trimmedSpace = cellValue.trim();
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
        const middleColumnsAllDash = middleColumns.every(cell => this.composedOfDashes(cell));
        if (middleColumnsAllDash && (hasStartingBorder || hasEndingBorder))
            return true;
        return false;
    }
}