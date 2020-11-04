import * as vscode from "vscode";
import { MultiTablePrettyfier } from "../prettyfiers/multiTablePrettyfier";

export class TableDocumentRangePrettyfier implements vscode.DocumentRangeFormattingEditProvider {

    constructor(
        private readonly _multiTablePrettyfier: MultiTablePrettyfier
    ) { }

    public provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument, range: vscode.Range,
        options: vscode.FormattingOptions, token: vscode.CancellationToken) : vscode.TextEdit[]
    {
        const formattedSelection: string = this._multiTablePrettyfier.formatTables(document.getText(range));

        return formattedSelection != null
            ? [new vscode.TextEdit(range, formattedSelection) ]
            : [ ];
    }
}