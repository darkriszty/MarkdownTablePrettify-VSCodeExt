import * as vscode from "vscode";
import { Document } from "../models/doc/document";
import { Range } from "../models/doc/range";
import { SingleTablePrettyfier } from "../prettyfiers/singleTablePrettyfier";

export class TableDocumentRangePrettyfier implements vscode.DocumentRangeFormattingEditProvider {

    constructor(
        private readonly _singleTablePrettyfier: SingleTablePrettyfier
    ) { }

    public provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument, range: vscode.Range,
        options: vscode.FormattingOptions, token: vscode.CancellationToken) : vscode.TextEdit[]
    {
        const formattedTable: string = this._singleTablePrettyfier.prettifyTable(
            new Document(document.getText()), new Range(range.start.line, range.end.line)
        );
        return formattedTable != null
            ? [ new vscode.TextEdit(range, formattedTable) ]
            : [ ];
    }
}