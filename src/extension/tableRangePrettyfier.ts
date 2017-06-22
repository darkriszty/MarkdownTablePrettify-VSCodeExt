import * as vscode from "vscode";
import { ILogger } from "../diagnostics/logger";
import { TableViewModel } from "../viewModels/tableViewModel";
import { TableFactory } from "../modelFactory/tableFactory";
import { TableViewModelBuilder } from "../viewModelBuilders/tableViewModelBuilder";
import { TableStringWriter } from "../writers/tableStringWriter";

export class TableRangePrettyfier implements vscode.DocumentRangeFormattingEditProvider {

    constructor(
        private _tableFactory: TableFactory,
        private _viewModelBuilder: TableViewModelBuilder,
        private _writer: TableStringWriter,
        private _logger: ILogger
    ) { }

    provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument, range: vscode.Range,
        options: vscode.FormattingOptions, token: vscode.CancellationToken) : vscode.TextEdit[]
    {
        const result: vscode.TextEdit[] = [];
        const selection = document.getText(range);

        let message: string = null;
        try {
            const rows: string[][] = this._tableFactory.getModel(selection);
            if (rows == null) {
                message = "Mismatching table column sizes.";
            } else {
                const tableVm = this._viewModelBuilder.build(rows);
                const formattedTable = this._writer.writeTable(tableVm);
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