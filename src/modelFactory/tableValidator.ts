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
        return false;
    }
}