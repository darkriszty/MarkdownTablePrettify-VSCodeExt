import * as vscode from "vscode";
import { EOL } from "os";
import { TableValidator } from "../modelFactory/tableValidator";

export class TableFinder {
    private readonly _separatorMarker = "-|-";
    constructor(
        private readonly _tableValidator: TableValidator
    ) { }

    public getTables(document: vscode.TextDocument): vscode.Range[] {
        let rows: string[] = document.getText().split(/\r\n|\r|\n/);

        let result = [];
        let previousRowIndex = 0;
        while(true) {
            let { tableStartRow, tableEndRow } = this.getNextResult(rows, previousRowIndex);
            if (tableStartRow == null || tableEndRow == null)
                break;
            result.push(this.getRangeForLines(rows, tableStartRow, tableEndRow));
            previousRowIndex = tableEndRow;
        }

        return result;
    }

    private getNextResult(rows: string[], startAtRow: number) {
        // look for the separator row, assume table starts 1 row before & ends when invalid
        let rowIndex = startAtRow;
        while (rowIndex < rows.length) {
            let table = rows[rowIndex].indexOf(this._separatorMarker) >= 0
                ? this.getTableFromSeparatorIndex(rows, rowIndex)
                : null;
            if (table != null) return table;
            rowIndex++;
        }

        return {
            tableStartRow: null,
            tableEndRow: null
        };
    }

    private getTableFromSeparatorIndex(rows: string[], separatorRowIndex: number) {
        let tableValid = true;
        let tableStartRow = separatorRowIndex - 1;
        let tableEndRow = separatorRowIndex;

        while (tableValid && tableEndRow < rows.length) {
            tableEndRow++;
            let selection = this.concatRows(rows, tableStartRow, tableEndRow)
            tableValid = this._tableValidator.isValid(selection);
        }

        // make sure there is at least 1 row after the separator
        return tableEndRow > separatorRowIndex + 1
            ? {
                tableStartRow: tableStartRow ,
                tableEndRow: tableEndRow - 1
            }
            : null;
    }

    private concatRows(rows: string[], from: number, to: number) {
        let relevantRows = rows.slice(from, to + 1);
        return relevantRows.join(EOL);
    }

    private getRangeForLines(rows: string[], startLine: number, endLine: number): vscode.Range {
        return new vscode.Range(
            new vscode.Position(startLine, 0),
            new vscode.Position(endLine, rows[endLine - 1].length)
        );
    }
}