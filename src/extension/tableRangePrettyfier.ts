import * as vscode from "vscode";
import { ITable } from "../models/table";
import { ITableFactory } from "../models/tableFactory";
import { ILogger } from "../diagnostics/logger";

export class TableRangePrettyfier implements vscode.DocumentRangeFormattingEditProvider {

    constructor(
        private _tableFactory: ITableFactory,
        private _logger: ILogger
    ) { }

    provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument, range: vscode.Range,
        options: vscode.FormattingOptions, token: vscode.CancellationToken) : vscode.TextEdit[]
    {
        const result: vscode.TextEdit[] = [];
        const selection = document.getText(range);

        let message: string = null;
        let table: ITable = null;

        const silent = this._isWholeDocumentFormatting(document, range);

        try {
            table = this._tableFactory.create(selection);
            if (table == null) {
                message = "Mismatching table column sizes.";
            } else {
                const formattedTable = table.prettyPrint();
                result.push(new vscode.TextEdit(range, formattedTable));
            }
        } catch (ex) {
            if (!silent)
                this._logger.logError(ex);
            console.error(`Error: ${ex}`);
        }

        if (!!message && !silent)
            this._logger.logInfo(message);

        return result;
    }

    private _isWholeDocumentFormatting(document: vscode.TextDocument, range: vscode.Range): boolean {
        if (document.lineCount < 1)
            return true;

        const zeroPosition = new vscode.Position(0, 0);
        const documentEndPosition = document.lineAt(document.lineCount - 1).range.end;
        if (range.start.isEqual(zeroPosition) && range.end.isEqual(documentEndPosition))
            return true;

        return false;
    }
}