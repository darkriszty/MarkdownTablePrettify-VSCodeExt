'use strict';
import * as vscode from 'vscode';
import { getSupportLanguageIds, getDocumentRangePrettyfier, getDocumentPrettyfier, getDocumentPrettyfierCommand, getTableAtCursorPrettyfier, invalidateCache } from './prettyfierFactory';
import { TableAtCursorContextKeyUpdater } from './tableAtCursorContextKeyUpdater';

// This method is called when the extension is activated.
// The extension is activated the very first time the command is executed.
export function activate(context: vscode.ExtensionContext): void {

    // Invalidate cache when configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration("markdownTablePrettify")) {
                invalidateCache();
            }
        })
    );

    const supportedLanguageIds = getSupportLanguageIds();
    for (let language of supportedLanguageIds) {
        context.subscriptions.push(
            vscode.languages.registerDocumentRangeFormattingEditProvider({ language }, getDocumentRangePrettyfier()),
            vscode.languages.registerDocumentFormattingEditProvider({ language }, getDocumentPrettyfier())
        );
    }

    const tableAtCursorContextKey = "markdownTablePrettify.hasTableAtCursor";
    const contextKeyUpdater = new TableAtCursorContextKeyUpdater(
        supportedLanguageIds,
        tableAtCursorContextKey,
        getTableAtCursorPrettyfier(),
        vscode.commands.executeCommand
    );

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => void contextKeyUpdater.update(editor)),
        vscode.window.onDidChangeTextEditorSelection(event => void contextKeyUpdater.update(event.textEditor))
    );

    void contextKeyUpdater.update(vscode.window.activeTextEditor);

    const command = "markdownTablePrettify.prettifyTables";
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand(command, async textEditor => {
            if (supportedLanguageIds.includes(textEditor.document.languageId))
                await getDocumentPrettyfierCommand().prettifyDocument(textEditor);
        })
    );

    const formatTableCommand = "markdownTablePrettify.prettifyTableAtCursor";
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand(formatTableCommand, async textEditor => {
            if (supportedLanguageIds.includes(textEditor.document.languageId)) {
                await getTableAtCursorPrettyfier().prettifyTableAtCursor(textEditor);
            }
        })
    );
}

export function deactivate() { }
