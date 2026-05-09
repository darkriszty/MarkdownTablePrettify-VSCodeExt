import * as vscode from 'vscode';
import { Document } from '../models/doc/document';
import { TableAtCursorPrettyfier } from '../prettyfiers/tableAtCursorPrettyfier';

export class TableAtCursorContextKeyUpdater {
    private _lastEditorUri: string | null = null;
    private _lastDocumentVersion: number | null = null;
    private _lastLine: number | null = null;

    constructor(
        private readonly _supportedLanguageIds: string[],
        private readonly _contextKey: string,
        private readonly _tableAtCursorPrettyfier: TableAtCursorPrettyfier,
        private readonly _executeCommand: (command: string, ...args: any[]) => Thenable<unknown>
    ) { }

    public async update(editor?: vscode.TextEditor): Promise<void> {
        if (!editor || !this._supportedLanguageIds.includes(editor.document.languageId)) {
            this._lastEditorUri = null;
            this._lastDocumentVersion = null;
            this._lastLine = null;
            await this._executeCommand('setContext', this._contextKey, false);
            return;
        }

        const currentEditorUri = editor.document.uri.toString();
        const currentDocumentVersion = editor.document.version;
        const currentLine = editor.selection.active.line;

        if (this._lastEditorUri === currentEditorUri
            && this._lastDocumentVersion === currentDocumentVersion
            && this._lastLine === currentLine) {
            return;
        }

        this._lastEditorUri = currentEditorUri;
        this._lastDocumentVersion = currentDocumentVersion;
        this._lastLine = currentLine;

        const hasTableAtCursor = this._tableAtCursorPrettyfier.hasTableAtCursor(
            new Document(editor.document.getText()),
            currentLine);

        await this._executeCommand('setContext', this._contextKey, hasTableAtCursor);
    }
}
