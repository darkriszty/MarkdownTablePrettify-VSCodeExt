'use strict';
import * as vscode from 'vscode';
import { getSupportLanguageIds, getDocumentRangePrettyfier, getDocumentPrettyfier, getDocumentPrettyfierCommand, invalidateCache } from './prettyfierFactory';

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

    const command = "markdownTablePrettify.prettifyTables";
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand(command, textEditor => {
            if (supportedLanguageIds.indexOf(textEditor.document.languageId) >= 0)
                getDocumentPrettyfierCommand().prettifyDocument(textEditor);
        })
    );
}

export function deactivate() { }
