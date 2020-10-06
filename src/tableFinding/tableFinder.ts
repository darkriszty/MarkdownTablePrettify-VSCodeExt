import { Document } from "../models/doc/document";
import { Range } from "../models/doc/range";
import { TableValidator } from "../modelFactory/tableValidator";

export class TableFinder {
    constructor(
        private readonly _tableValidator: TableValidator
    ) { }

    public getNextRange(document: Document, startLine: number): Range {
        // look for the separator row, assume table starts 1 row before & ends when invalid
        let rowIndex = startLine;

        while (rowIndex < document.lines.length) {
            const isValidSeparatorRow = this._tableValidator.lineIsValidSeparator(document.lines[rowIndex].value);
            let tableRange = isValidSeparatorRow
                ? this.getNextValidTableRange(document, rowIndex)
                : null;
            if (tableRange != null) {
                return tableRange;
            }
            rowIndex++;
        }

        return null;
    }

    private getNextValidTableRange(document: Document, separatorRowIndex: number): Range {
        let firstTableFileRow = separatorRowIndex - 1;
        let lastTableFileRow = separatorRowIndex + 1;
        let selection = null;

        while (lastTableFileRow < document.lines.length) {
            const newSelection = document.getText(new Range(firstTableFileRow, lastTableFileRow));
            const tableValid = this._tableValidator.isValid(newSelection);
            if (tableValid) {
                selection = newSelection;
                lastTableFileRow++;
            } else {
                break;
            }
        }

        if (selection == null) {
            return null;
        }

        // return the row to the last valid try
        lastTableFileRow--;
        return new Range(firstTableFileRow, lastTableFileRow);
    }
}