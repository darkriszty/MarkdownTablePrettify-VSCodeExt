import { Document } from "../models/doc/document";
import { Range } from "../models/doc/range";
import { TableValidator } from "../modelFactory/tableValidator";

export class TableFinder {
    private readonly _ignoreStart: string = "<!-- markdown-table-prettify-ignore-start -->";
    private readonly _ignoreEnd: string = "<!-- markdown-table-prettify-ignore-end -->";

    constructor(
        private readonly _tableValidator: TableValidator
    ) { }

    public getNextRange(document: Document, startLine: number): Range {
        // look for the separator row, assume table starts 1 row before & ends when invalid
        let rowIndex = startLine;
        let isInIgnoreBlock = false;

        while (rowIndex < document.lines.length) {
            if (document.lines[rowIndex].value.trim() == this._ignoreStart) {
                isInIgnoreBlock = true;
            } else if (document.lines[rowIndex].value.trim() == this._ignoreEnd) {
                isInIgnoreBlock = false;
            }

            if (!isInIgnoreBlock) {
                const isValidSeparatorRow = this._tableValidator.lineIsValidSeparator(document.lines[rowIndex].value);
                const nextRangeResult = isValidSeparatorRow
                    ? this.getNextValidTableRange(document, rowIndex)
                    : { range: null, ignoreBlockStarted: isInIgnoreBlock};

                isInIgnoreBlock = nextRangeResult.ignoreBlockStarted;

                if (nextRangeResult.range != null) {
                    return nextRangeResult.range;
                }
            }
            rowIndex++;
        }

        return null;
    }

    private getNextValidTableRange(document: Document, separatorRowIndex: number): { range: Range, ignoreBlockStarted: boolean} {
        let firstTableFileRow = separatorRowIndex - 1;
        let lastTableFileRow = separatorRowIndex;
        let selection = null;
        let ignoreBlockedStarted = false;

        // accept also tables with no body (just header + separator rows), if valid, as a fallback in case more table rows cannot be found
        const headerSeparatorSelection = document.getText(new Range(firstTableFileRow, lastTableFileRow));
        if (this._tableValidator.isValid(headerSeparatorSelection)) {
            selection = headerSeparatorSelection;
        }

        lastTableFileRow++;
        while (lastTableFileRow < document.lines.length) {
            // when the ignore-start is in the middle of a possible table don't go further
            if (document.lines[lastTableFileRow].value.trim() == this._ignoreStart) {
                ignoreBlockedStarted = true;
                break;
            }

            const newSelection = document.getText(new Range(firstTableFileRow, lastTableFileRow));
            const tableValid = this._tableValidator.isValid(newSelection);
            if (tableValid) {
                selection = newSelection;
                lastTableFileRow++;
            } else {
                break;
            }
        }

        // return the row to the last valid try
        return {
            range: selection != null ? new Range(firstTableFileRow, lastTableFileRow - 1) : null,
            ignoreBlockStarted: ignoreBlockedStarted
        };
    }
}