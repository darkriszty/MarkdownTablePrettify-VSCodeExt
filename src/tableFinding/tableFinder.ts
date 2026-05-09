import { Document } from "../models/doc/document";
import { Range } from "../models/doc/range";
import { TableValidator } from "../modelFactory/tableValidator";

export class TableFinder {
    private readonly _ignoreStart: string = "<!-- markdown-table-prettify-ignore-start -->";
    private readonly _ignoreEnd: string = "<!-- markdown-table-prettify-ignore-end -->";

    constructor(
        private readonly _tableValidator: TableValidator
    ) { }

    public getNextRange(document: Document, startLine: number): Range | null {
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
                const nextRangeResult = this.getRangeAtSeparatorRow(document, rowIndex);
                isInIgnoreBlock = nextRangeResult.ignoreBlockStarted;

                if (nextRangeResult.range != null) {
                    return nextRangeResult.range;
                }
            }
            rowIndex++;
        }

        return null;
    }

    public getRangeContainingLine(document: Document, lineIndex: number): Range | null {
        if (lineIndex < 0 || lineIndex >= document.lines.length) {
            return null;
        }

        // search locally around the cursor
        const trySeparator = (separatorRowIndex: number): Range | null => {
            if (this.isLineInsideIgnoreBlock(document, separatorRowIndex)) {
                return null;
            }

            const range = this.getRangeAtSeparatorRow(document, separatorRowIndex).range;
            return range != null && range.startLine <= lineIndex && lineIndex <= range.endLine
                ? range
                : null;
        };

        const initialRange = trySeparator(lineIndex);
        if (initialRange != null) {
            return initialRange;
        }

        let offset = 1;
        while (lineIndex - offset >= 0 || lineIndex + offset < document.lines.length) {
            if (lineIndex - offset >= 0) {
                const range = trySeparator(lineIndex - offset);
                if (range != null) {
                    return range;
                }
            }

            if (lineIndex + offset < document.lines.length) {
                const range = trySeparator(lineIndex + offset);
                if (range != null) {
                    return range;
                }
            }

            offset++;
        }

        return null;
    }

    private isLineInsideIgnoreBlock(document: Document, lineIndex: number): boolean {
        let ignoreBlockStarted = false;

        for (let index = 0; index <= lineIndex && index < document.lines.length; index++) {
            const trimmedLine = document.lines[index].value.trim();
            if (trimmedLine == this._ignoreStart) {
                ignoreBlockStarted = true;
            } else if (trimmedLine == this._ignoreEnd) {
                ignoreBlockStarted = false;
            }
        }

        return ignoreBlockStarted;
    }

    private getRangeAtSeparatorRow(document: Document, separatorRowIndex: number): { range: Range | null, ignoreBlockStarted: boolean } {
        if (!this._tableValidator.lineIsValidSeparator(document.lines[separatorRowIndex].value)) {
            return { range: null, ignoreBlockStarted: false };
        }

        return this.getNextValidTableRange(document, separatorRowIndex);
    }

    private getNextValidTableRange(document: Document, separatorRowIndex: number): { range: Range | null, ignoreBlockStarted: boolean} {
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