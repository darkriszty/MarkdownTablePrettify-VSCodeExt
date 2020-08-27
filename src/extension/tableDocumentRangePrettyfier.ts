import * as vscode from "vscode";
import { SizeLimitChecker } from "../prettyfiers/sizeLimit/sizeLimitChecker";
import { ILogger } from "../diagnostics/logger";
import { SelectionBasedLogToogler } from "../diagnostics/selectionBasedLogToogler";
import { Document } from "../models/doc/document";
import { Range } from "../models/doc/range";
import { Table } from "../models/table";
import { TableFactory } from "../modelFactory/tableFactory";
import { TableValidator } from "../modelFactory/tableValidator";
import { TableViewModel } from "../viewModels/tableViewModel";
import { TableViewModelFactory } from "../viewModelFactories/tableViewModelFactory";
import { TableStringWriter } from "../writers/tableStringWriter";

export class TableDocumentRangePrettyfier implements vscode.DocumentRangeFormattingEditProvider {

    constructor(
        private readonly _tableFactory: TableFactory,
        private readonly _tableValidator: TableValidator,
        private readonly _viewModelFactory: TableViewModelFactory,
        private readonly _writer: TableStringWriter,
        private readonly _loggers: ILogger[],
        private readonly _sizeLimitChecker: SizeLimitChecker
    ) { }

    public provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument, range: vscode.Range,
        options: vscode.FormattingOptions, token: vscode.CancellationToken) : vscode.TextEdit[]
    {
        const result: vscode.TextEdit[] = [];
        const selection: string = document.getText(range);

        this.toogleLogging(document, range);
        let message: string = null;

        try {
            if (!this._sizeLimitChecker.isWithinAllowedSizeLimit(selection)) {
                return result;
            } else if (this._tableValidator.isValid(selection)) {
                const table: Table = this._tableFactory.getModel(new Document(selection), new Range(range.start.line, range.end.line));
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

    private toogleLogging(document: vscode.TextDocument, range: vscode.Range): void {
        const toogler = new SelectionBasedLogToogler(document, range);
        toogler.toogleLoggers(this._loggers);
    }
}