import * as vscode from "vscode";
import { ILogger } from "../diagnostics/logger";
import { Table } from "../models/table";
import { TableFactory } from "../modelFactory/tableFactory";
import { TableViewModel } from "../viewModels/tableViewModel";
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
            const table: Table = this._tableFactory.getModel(selection);
            const tableVm: TableViewModel = this._viewModelBuilder.build(table);
            const formattedTable: string = this._writer.writeTable(tableVm);
            result.push(new vscode.TextEdit(range, formattedTable));
        } catch (ex) {
            this._logger.logError(ex);
            console.error("Error: \n\n" + ex);
        }

        if (!!message)
            this._logger.logInfo(message);

        return result;
    }
}