import * as vscode from "vscode";
import { SizeLimitChecker } from "./sizeLimitCheker";
import { TableDocumentRangePrettyfier } from "./tableDocumentRangePrettyfier";
import { TableFinder } from "../tableFinding/tableFinder";

export class TableDocumentPrettyfier implements vscode.DocumentFormattingEditProvider {

    constructor(
        private readonly _tableFinder: TableFinder,
        private readonly _tableDocumentRangePrettyfier: TableDocumentRangePrettyfier,
        private readonly _sizeLimitChecker: SizeLimitChecker
    ) { }

    public provideDocumentFormattingEdits(document: vscode.TextDocument, 
        options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.TextEdit[] 
    {
        let result: vscode.TextEdit[] = [];

        let tables: vscode.Range[] = this._sizeLimitChecker.isWithinAllowedSizeLimit(document.getText())
            ? this._tableFinder.getTables(document)
            : [];
        for (let tableRange of tables) {
            let edits = this._tableDocumentRangePrettyfier.provideDocumentRangeFormattingEdits(document, tableRange, options, token);
            result = result.concat(edits);
        }
        return result;
    }
}
