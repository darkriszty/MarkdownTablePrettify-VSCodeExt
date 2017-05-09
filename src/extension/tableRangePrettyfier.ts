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

        try {
            table = this._tableFactory.create(selection);
            if (table == null) {
                message = "Mismatching table column sizes.";
            } else {
                const formattedTable = table.prettyPrint();
                result.push(new vscode.TextEdit(range, formattedTable));
            }
        } catch (ex) {
            this._logger.logError(ex);
            console.error("Error: \n\n" + ex);
        }

        if (!!message)
            this._logger.logInfo(message);

        return result;
    }
}