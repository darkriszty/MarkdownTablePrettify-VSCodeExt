import * as vscode from "vscode";
import { TableFinder } from "../tableFinding/tableFinder";
import { SingleTablePrettyfier } from "../prettyfiers/singleTablePrettyfier";
import { Document } from "../models/doc/document";
import { Range } from "../models/doc/range";

export class TableAtCursorPrettyfier {

    constructor(
        private readonly _tableFinder: TableFinder,
        private readonly _singleTablePrettyfier: SingleTablePrettyfier
    ) { }

    public async prettifyTableAtCursor(editor: vscode.TextEditor): Promise<boolean> {
        const cursorLine = editor.selection.active.line;
        const document = new Document(editor.document.getText());

        const tableRange = this.findTableRangeAtLine(document, cursorLine);
        if (tableRange == null) {
            return false;
        }

        const formattedTable = this._singleTablePrettyfier.prettifyTable(document, tableRange);

        await editor.edit(editBuilder => {
            editBuilder.replace(
                new vscode.Range(
                    new vscode.Position(tableRange.startLine, 0),
                    editor.document.lineAt(tableRange.endLine).range.end
                ),
                formattedTable
            );
        });

        return true;
    }

    public hasTableAtCursor(document: Document, cursorLine: number): boolean {
        return this.findTableRangeAtLine(document, cursorLine) != null;
    }

    private findTableRangeAtLine(document: Document, cursorLine: number): Range | null {
        return this._tableFinder.getRangeContainingLine(document, cursorLine);
    }
}