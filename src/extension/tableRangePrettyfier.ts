import * as vscode from "vscode";
import { ILogger } from "../diagnostics/logger";
import { Table } from "../models/table";
import { TableFactory } from "../modelFactory/tableFactory";
import { TableValidator } from "../modelFactory/tableValidator";
import { TableViewModel } from "../viewModels/tableViewModel";
import { TableViewModelFactory } from "../viewModelFactories/tableViewModelFactory";
import { TableStringWriter } from "../writers/tableStringWriter";

export class TableRangePrettyfier implements vscode.DocumentRangeFormattingEditProvider {

    constructor(
        private _tableFactory: TableFactory,
        private _tableValidator: TableValidator,
        private _viewModelFactory: TableViewModelFactory,
        private _writer: TableStringWriter,
        private _loggers: ILogger[]
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
            if (this._tableValidator.isValid(table)) {
                const tableVm: TableViewModel = this._viewModelFactory.build(table);
                const formattedTable: string = this._writer.writeTable(tableVm);
                result.push(new vscode.TextEdit(range, formattedTable));
            } else {
                message = "Can't parse table from invalid text."
            }
        } catch (ex) {
            this._loggers.forEach(_ => _.logError(ex));
        }

        if (!!message)
            this._loggers.forEach(_ => _.logInfo(message));

        return result;
    }
}