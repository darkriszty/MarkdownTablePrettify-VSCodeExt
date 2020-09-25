import * as vscode from "vscode";
import { MultiTablePrettyfier } from "../prettyfiers/multiTablePrettyfier";

export class TableDocumentPrettyfier implements vscode.DocumentFormattingEditProvider {

    constructor(
        private readonly _multiTablePrettyfier: MultiTablePrettyfier
    ) { }

    public provideDocumentFormattingEdits(document: vscode.TextDocument, 
        options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.TextEdit[] 
    {
        const formattedDocument: string = this._multiTablePrettyfier.formatTables(document.getText());

        return [
            new vscode.TextEdit(
                new vscode.Range(
                    new vscode.Position(0, 0),
                    new vscode.Position(document.lineCount - 1, Number.MAX_SAFE_INTEGER)
                ), 
                formattedDocument
            )
        ];
    }
}
