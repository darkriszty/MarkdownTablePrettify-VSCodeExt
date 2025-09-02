import { SelectionInterpreter } from "./selectionInterpreter";

export class TableValidator {

    constructor(private _selectionInterpreter: SelectionInterpreter) { }

    public isValid(selection: string): boolean {
        if (selection == null || selection === undefined)
            return false;
        const rawRows: string[][] = this._selectionInterpreter.allRows(selection);

        const sizeValid = rawRows.length >= 2 && // at least header and separator rows are required
                          rawRows[0].length > 1 && // at least two columns are required
                          rawRows.every(r => r.length == rawRows[0].length); // all rows of a column must match the length of the first row of that column

        return sizeValid && this.hasValidSeparators(this._selectionInterpreter.separator(selection));
    }

    public lineIsValidSeparator(separatorLine: string): boolean {
        return this.hasValidSeparators(
            this._selectionInterpreter.splitLine(separatorLine)
        );
    }

    public hasValidSeparators(separator: string[]): boolean {
        if (!separator || separator.length < 1 || !separator[1])
            return false;

        // if all columns are dashes, then it is valid
        const allCellsDash = separator.every(cell => this.validSeparator(cell));
        if (allCellsDash)
            return true;

        // now it can only be valid of the table starts or ends with a border and the middle columns are dashes
        return this.allDashesWithBorder(separator);
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