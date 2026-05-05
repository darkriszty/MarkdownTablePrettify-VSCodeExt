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

    public prettifyTableAtCursor(editor: vscode.TextEditor): boolean {
        const cursorLine = editor.selection.active.line;
        const document = new Document(editor.document.getText());

        const tableRange = this.findTableRangeAtLine(document, cursorLine);
        if (tableRange == null) {
            return false;
        }

        const formattedTable = this._singleTablePrettyfier.prettifyTable(document, tableRange);

        editor.edit(editBuilder => {
            editBuilder.replace(
                new vscode.Range(
                    new vscode.Position(tableRange.startLine, 0),
                    new vscode.Position(tableRange.endLine, Number.MAX_SAFE_INTEGER)
                ),
                formattedTable
            );
        });

        return true;
    }

    private findTableRangeAtLine(document: Document, cursorLine: number): Range | null {
        const searchStart = Math.max(0, cursorLine - 1);
        let searchFrom = 0;

        let candidate: Range | null = null;
        while (true) {
            const range = this._tableFinder.getNextRange(document, searchFrom);
            if (range == null) break;

            if (range.startLine <= cursorLine && cursorLine <= range.endLine) {
                candidate = range;
                break;
            }

            if (range.startLine > cursorLine) break;

            searchFrom = range.endLine + 1;
        }

        return candidate;
    }
}