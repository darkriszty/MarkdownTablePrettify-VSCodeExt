import * as vscode from "vscode";
import { MultiTablePrettyfier } from "../prettyfiers/multiTablePrettyfier";

export class TableDocumentPrettyfierCommand {

    constructor(
        private readonly _multiTablePrettyfier: MultiTablePrettyfier
    ) { }

    public prettifyDocument(editor: vscode.TextEditor) {
        if (editor.document.languageId !== "markdown") {
            return;
        }

        const formattedDocument: string = this._multiTablePrettyfier.formatTables(editor.document.getText());

        editor.edit(textEditorEdit => {
            textEditorEdit.replace(new vscode.Range(
                new vscode.Position(0, 0),
                new vscode.Position(editor.document.lineCount - 1, Number.MAX_SAFE_INTEGER)
            ), formattedDocument);
        });
    }
}
