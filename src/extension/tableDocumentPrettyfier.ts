import * as vscode from "vscode";
import { SizeLimitChecker } from "../prettyfiers/sizeLimitCheker";
import { TableDocumentRangePrettyfier } from "./tableDocumentRangePrettyfier";
import { TableFinder } from "../tableFinding/tableFinder";
import { Document } from "../models/doc/document";
import { Range } from "../models/doc/range";

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
        const input = document.getText();

        if (!this._sizeLimitChecker.isWithinAllowedSizeLimit(input)) {
            return result;
        }

        const doc = new Document(document.getText());
        let tableRange: Range = null;
        let tableSearchStartLine = 0;

        while ((tableRange = this._tableFinder.getNextRange(doc, tableSearchStartLine)) != null) {
            const vsCodeRange = new vscode.Range(new vscode.Position(tableRange.startLine, 0), new vscode.Position(tableRange.endLine, Number.MAX_SAFE_INTEGER));
            result = result.concat(this._tableDocumentRangePrettyfier.provideDocumentRangeFormattingEdits(document, vsCodeRange, options, token));
            tableSearchStartLine = tableRange.endLine + 1;
        }
        return result;
    }
}
